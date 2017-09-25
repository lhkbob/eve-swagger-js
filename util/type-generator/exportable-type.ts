import * as swagger from 'swagger-schema-official';
import * as ts from 'typescript';
import deepEquals = require('deep-equal');

import * as esi from '../esi-api';

// Parameters common to all ESI routes that are handled at a lower level by the
// library that should not be included in the parameter specification for a
// route
const FILTER_PARAMS = [
  'token', 'datasource', 'language', 'user_agent', 'X-User-Agent'
];

// The official swagger type spec makes it a little bit of a pain to work with
// the wrappers around type definitions.
function isSchema(blob: any): blob is swagger.Schema {
  // A schema will have one of these
  return blob.properties !== undefined || blob.enum !== undefined || blob.items
      !== undefined || blob.type !== undefined;
}

function checkMemberCompatibility(a: ts.NodeArray<ts.TypeElement>,
    b: ts.NodeArray<ts.TypeElement>): boolean {
  if (a.length != b.length) {
    return false;
  }
  // Since property sets are same size, if all of a's properties can be found
  // in b, then the two sets are equal.
  for (let i = 0; i < a.length; i++) {
    let aProp: ts.PropertySignature = <ts.PropertySignature> a[i];
    // Property can be in any order between the two
    let correspondingFound = false;
    for (let j = 0; j < b.length; j++) {
      let bProp: ts.PropertySignature = <ts.PropertySignature> b[j];
      if (deepEquals(aProp.name, bProp.name)) {
        // Found the property of the same name, so make sure types are valid
        // (and check question mark state)
        if (!deepEquals(aProp.questionToken, bProp.questionToken)
            || !checkTypeCompatibility(aProp.type, bProp.type)) {
          return false;
        }
        correspondingFound = true;
        break;
      }
    }

    if (!correspondingFound) {
      // Couldn't find a property in b that was defined in a
      return false;
    }
  }
  return true;
}

function checkTypeCompatibility(a?: ts.Node, b?: ts.Node): boolean {
  // First look for types being undefined
  if (!a && !b) {
    return true; // Both undefined
  } else if (!a || !b) {
    return false; // One is undefined
  }

  // Otherwise both types defined, so check more carefully
  if (ts.isArrayTypeNode(a) && ts.isArrayTypeNode(b)) {
    // Array types are compatible if their element types are compatible
    return checkTypeCompatibility(a.elementType, b.elementType);
  } else if (ts.isEnumDeclaration(a) && ts.isEnumDeclaration(b)) {
    // Enums are compatible if they have the same length and each corresponding
    // element is equal between the two
    if (a.members.length != b.members.length) {
      return false;
    }
    for (let i = 0; i < a.members.length; i++) {
      if (!deepEquals(a.members[i], b.members[i])) {
        return false;
      }
    }
    return true;
  } else if (ts.isTypeLiteralNode(a) && ts.isTypeLiteralNode(b)) {
    // Object types are compatible if each property is compatible, and they
    // have the same property key set.
    return checkMemberCompatibility(a.members, b.members);
  } else if (ts.isInterfaceDeclaration(a) && ts.isInterfaceDeclaration(b)) {
    // Interfaces are compatible in the same way type literals are
    return checkMemberCompatibility(a.members, b.members);
  } else if (ts.isUnionTypeNode(a) && ts.isUnionTypeNode(b)) {
    // Make sure the sets are the same, order doesn't matter
    if (a.types.length != b.types.length) {
      return false;
    }
    for (let i = 0; i < a.types.length; i++) {
      let matchFound = false;
      for (let j = 0; j < b.types.length; j++) {
        if (checkTypeCompatibility(a.types[i], b.types[j])) {
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        return false;
      }
    }

    return true;
  } else {
    // Either a very primitive type or an a type that hasn't been special cased
    // yet, so rely on deepEquals
    return deepEquals(a, b);
  }
}

function camelCaseToEnumName(camelCase: string): string {
  if (+camelCase) {
    // The string is actually just digits, in which case it won't produce a
    // valid name either.
    return 'V_' + camelCase;
  }
  if (camelCase[0] === '#') {
    // Heuristic for a hexcode color
    return 'C_' + camelCase.substring(1).toUpperCase();
  }

  let prevWasUpperOrDigit: boolean = false;
  let enumName: string = '';
  for (let i = 0; i < camelCase.length; i++) {
    let currentChar = camelCase[i];
    let toUpper = currentChar.toUpperCase();

    if (currentChar === toUpper) {
      // Potentially at a word boundary so add an underscore (unless the
      // character is already an underscore in which case just rely on it to
      // form the word separation automatically).
      if (i > 0 && !prevWasUpperOrDigit && currentChar !== '_') {
        // Add an underscore
        enumName += '_';
      }
      prevWasUpperOrDigit = true;

      // Exclude hyphens since they generate bad names
      if (toUpper !== '-') {
        enumName += toUpper;
      }
    } else {
      // Just include the upper-case version of the character
      prevWasUpperOrDigit = false;
      enumName += toUpper;
    }
  }

  return enumName;
}

function isValidDescription(description: string): boolean {
  return description.toLowerCase() !== description && description.split(
          ' ').length > 2;
}

function addJSDoc(node: ts.Node, description: string): ts.Node {
  let comment = '*\n';
  for (let line of description.split('\n')) {
    comment += ' * ' + line + '\n';
  }
  comment += ' ';
  return ts.addSyntheticLeadingComment(node,
      ts.SyntaxKind.MultiLineCommentTrivia, comment, true);
}

function toMarkdownList(description: string): string {
  // If the description contains a list pattern formed by ' - ', it splits it
  // and moves each to its own line. Text preceeding first ' - ' is included
  // but not as a list element. It is assumed that there is no closing, non-list
  // text that should not be on its own line.
  let listStart = description.indexOf('- ');
  if (listStart >= 0) {
    let preList = description.substring(0, listStart);
    let list = description.substring(listStart).split('- ');

    description = preList + '\n\n';
    for (let e of list) {
      e = e.trim();
      if (e !== '') {
        // Force punctuation
        if (e[e.length - 1] !== '.' && e[e.length - 1] !== '?' && e[e.length
            - 1] !== '!') {
          e += '.';
        }
        description += '- ' + e + '\n';
      }
    }
  }

  return description;
}

export const value = { hello: 'world' };

/**
 * The visit callback is called *after* all of the node's children have
 * been visited. The type graph is a DAG so a type may be visited multiple
 * times. This state is captured by different arguments to the function.
 * First, `priorVisitResult` is the value that visit() last returned for
 * this node or undefined if the node has never been visited before.
 *
 * The `path` array specifies the current node and all edges traveled to get
 * to the current node. The last element in the array represents the current
 * node, and the corresponding `key` value is the dependency name to go from
 * its parent to the current.
 *
 * If a node is visited multiple times due to dependency structure, each time
 * visit() is called it will have a different parentPath value. The root of the
 * visitation call (not necessarily the root of the DAG) will have a path of
 * length 1 and its key will be the empty string.
 *
 * The `childResults` map holds the return values of the visitor being
 * applied to each of `type`'s dependencies. The visitor will have been
 * called with a parent path equivalent to `parentPath` with `type` appended
 * to it.
 *
 * @param path
 * @param priorVisitResult
 * @param childResults
 */
export type TypeVisitor<T> = (path: { node: ExportableType, key: string }[],
    priorVisitResult: T | undefined, childResults: Map<ExportableType, T>) => T;

// A swagger defined type that should be exported into some namespace.
// It may also be an inlined type that none-the-less depends on types that
// were exported.
//
// This tracks what other exportable types it depends on, what uses itself,
// and what its possible names could be.
export class ExportableType {
  readonly titles: string[];

  // For dependencies and dependents, the keys associated with the type
  // are either the property name pointing to the type (from parent to this,
  // or this to child depending on context), or it is the special value '[]'
  // that signals the dependency represents the element type of an array.

  // Exported types that are referenced directly by the type declaration
  // of this exportable type
  private dependencies_: Map<string, ExportableType>;

  // Upwards map pointing to the immediate types that depend on this type.
  // Cannot use a conventional map since keys may not be unique across all
  // parents
  private dependents_: { key: string, parent: ExportableType }[];

  // Will include any namespace structure as well
  private typeName?: string;
  private descriptions: Set<string>;
  private memberDescriptions: Map<string, Set<string>>;


  constructor(title: string,
      readonly type: ts.DeclarationStatement | ts.VariableStatement | ts.TypeNode | string) {
    this.dependencies_ = new Map();
    this.dependents_ = [];
    this.titles = [title];
    this.descriptions = new Set();
    this.memberDescriptions = new Map();

    if (typeof type !== 'string') {
      if (ts.isInterfaceDeclaration(type) || ts.isEnumDeclaration(type)) {
        this.typeName = type.name.text;
      }
    }
  }

  get isLeaf(): boolean {
    return this.dependencies_.size == 0;
  }

  get hasDeclaration(): boolean {
    if (typeof this.type === 'string') {
      return false;
    } else {
      return !ts.isTypeNode(this.type);
    }
  }

  get isVirtualAggregate(): boolean {
    return typeof this.type === 'string';
  }

  get isInlined(): boolean {
    if (typeof this.type === 'string') {
      return false;
    } else {
      return ts.isTypeNode(this.type);
    }
  }

  get isArray(): boolean {
    return (this.isInlined || this.hasDeclaration) && this.dependencies_.size
        == 1 && this.dependencies_.has('[]');
  }

  get dependencies(): IterableIterator<ExportableType> {
    return this.dependencies_.values();
  }

  dependency(memberName: string): ExportableType | undefined {
    return this.dependencies_.get(memberName);
  }

  renameType(newName: string): void {
    if (!this.hasDeclaration) {
      throw new Error('Type is not declared, has no name');
    }
    this.typeName = newName;

    // Since it has a declaration, assert its type and rename the declaration
    let decl = <ts.DeclarationStatement> this.type;
    // But make sure to strip off any namespace for the actual declaration since
    // that will be local to the namespace/module.
    let dotIndex = newName.lastIndexOf('.');
    if (dotIndex >= 0) {
      newName = newName.substring(dotIndex + 1);
    }
    if (decl.name) {
      decl.name = ts.createIdentifier(newName);
    }

    // And rename all type references to this type
    for (let dep of this.dependents_) {
      dep.parent.updateTypeReference(dep.key);
    }
  }

  visit<T>(visitor: TypeVisitor<T>): T {
    return this.collect(visitor).get(this)!;
  }

  collect<T>(visitor: TypeVisitor<T>): Map<ExportableType, T> {
    // Create a new state context for use with the visitor so that this function
    // is re-entrant
    let state = new Map();
    this.visitWithState(visitor, '', [], state);
    return state;
  }

  private visitWithState<T>(visitor: TypeVisitor<T>, currentKey: string,
      path: { key: string, node: ExportableType }[],
      state: Map<ExportableType, T>): T {
    // First visit and collect results from child nodes
    let currentPath = path.concat({ node: this, key: currentKey });
    let childResults = new Map();
    for (let key of this.dependencies_.keys()) {
      // Note that multiple keys may point to the same exportable type value,
      // which is likely to occur after merging of the graph
      let dep = this.dependencies_.get(key)!;
      let result = dep.visitWithState(visitor, key, currentPath, state);
      childResults.set(dep, result);
    }

    // Lookup any previous value
    let oldValue = state.get(this);

    // Visit current node and save
    let newValue = visitor(currentPath, oldValue, childResults);
    state.set(this, newValue);
    return newValue;
  }

  private createReferenceType(): ts.TypeNode {
    if (this.isVirtualAggregate) {
      throw new Error('Virtual aggregate cannot be a referred to as a type');
    } else if (this.isInlined) {
      // There is no need to create a type reference, inline the definition
      return this.type as ts.TypeNode;
    } else {
      // Is a declaration, so return a reference by type name
      return ts.createTypeReferenceNode(this.typeName!, undefined);
    }
  }

  private addDescription(blob: { description?: string } | string,
      forMember?: string): void {
    let description = esi.API.createDescription(blob);

    // First check if it's a trivial description that should not be included.
    if (!isValidDescription(description)) {
      // Many descriptions in the ESI swagger are 'property_name type' in lower
      // case. These are completely redundant messages that can be removed.
      return;
    }

    if (description !== '') {
      let descSet;
      if (forMember) {
        descSet = this.memberDescriptions.get(forMember);
        if (!descSet) {
          descSet = new Set();
          this.memberDescriptions.set(forMember, descSet);
        }
      } else {
        descSet = this.descriptions;
      }

      descSet.add(toMarkdownList(description));
    }
  }

  /*
   * JSDoc rules:
   * 1. Declarations will have descriptions added to themselves.
   * 2. Types (literal and decl definitions) will attach children
   *    descriptions to the member nodes.
   * 3. Simple decls and types return computed description of their node
   *    (excludes any coalescing of child descriptions).
   * 4. Array types include description of its element type.
   * 5. Virtual aggregators have an empty string.
   * 6. If final description content is '', then no comment node is added
   *    to the AST.
   */
  private updateASTWithJSDoc(): Map<ExportableType, string> {
    return this.collect((path, oldValue, childResults) => {
      let node = path[path.length - 1].node;
      if (typeof oldValue !== 'undefined') {
        // Only visit once
        return oldValue;
      } else if (node.isVirtualAggregate) {
        return '';
      }

      let astNode = node.type as ts.Node;
      let members;
      // Extract members to attach comments to
      if (ts.isTypeLiteralNode(astNode)) {
        members = astNode.members;
      } else if (ts.isInterfaceDeclaration(astNode)) {
        members = astNode.members;
      }

      if (members) {
        for (let m of members) {
          let memberName = m.name;
          let key;
          if (!memberName) {
            // This happens for index signatures, etc.
            continue;
          } else if (ts.isStringLiteral(memberName)) {
            key = memberName.text;
          } else if (ts.isIdentifier(memberName)) {
            key = memberName.text;
          } else if (typeof memberName === 'string') {
            key = memberName;
          } else {
            continue;
          }

          let memberDesc = '';
          // Include member descriptions that don't have a linked type, e.g.
          // primitive fields that might still contain semantic information in
          // their description
          if (node.memberDescriptions.has(key)) {
            memberDesc = Array.from(node.memberDescriptions.get(key)!)
            .join(' ').trim();
          }

          let childType = node.dependencies_.get(key);
          if (childType) {
            let childDesc = childResults.get(childType)!;
            if (childDesc === memberDesc && childType.hasDeclaration
                && childType.descriptions.size === 1) {
              // Adding a member comment here would duplicate the type comment
              // added for the type generated from this member.
              memberDesc = '';
            }
          }

          // Add the comment
          if (memberDesc !== '') {
            addJSDoc(m, memberDesc);
          }
        }
      }

      let descSources = node.descriptions.size;
      let desc = Array.from(node.descriptions).join(' ');
      if (node.isArray) {
        desc += ' ' + childResults.get(node.dependencies_.get('[]')!);
        descSources += node.dependencies_.get('[]')!.descriptions.size;
      }
      desc = desc.trim();
      if (desc === '') {
        return ''; // Don't add an JSDoc for an empty string
      }

      // For declarations, attach the current description to the node as well
      if (node.hasDeclaration && descSources === 1) {
        addJSDoc(node.type as ts.DeclarationStatement, desc);
      }

      return desc;
    });
  }

  private addDependency(key: string, child: ExportableType) {
    if (this.dependencies_.has(key)) {
      throw new Error('Duplicate dependency key: ' + key);
    }
    if (child.isVirtualAggregate && !this.isVirtualAggregate) {
      throw new Error('Cannot add virtual aggregate to non-virtual aggregate');
    }

    this.dependencies_.set(key, child);
    child.dependents_.push({ key: key, parent: this });
  }

  private buildMaximalReuseGraph(): void {
    // First calculate dependency height; must merge nodes with least height
    // first and then proceed up to the root.
    let typeHeights: Map<ExportableType, number> = this.collect(
        (path, prior, children) => {
          if (typeof prior === 'number') {
            // No need to recompute maximum over children
            return prior;
          } else {
            let maxChildHeight = -1;
            for (let childHeight of children.values()) {
              if (childHeight > maxChildHeight) {
                maxChildHeight = childHeight;
              }
            }

            return maxChildHeight + 1;
          }
        });


    // Gather all nodes into lists based on their height; each type only
    // needs to consider merging with other types in its list.
    let heightMap: Array<ExportableType[]> = [];
    this.visit((path, prior) => {
      if (!prior) {
        // Add current node to the appropriate level
        let node = path[path.length - 1].node;

        let height = typeHeights.get(node)!;
        while (height >= heightMap.length) {
          heightMap.push([]);
        }
        heightMap[height].push(node);
      }

      return true;
    });

    // Merge all levels, proceeding from lowest to highest height
    for (let i = 0; i < heightMap.length; i++) {
      ExportableType.mergeAllTypes(heightMap[i]);
    }
  }

  private static mergeAllTypes(types: ExportableType[]): void {
    // It is assumed that all types in the array have the same height, and
    // all lesser height levels have been merged.
    // Perform a brute-force O(N^2) search to try finding nodes that
    // merge within this height level.
    let merged: Set<ExportableType> = new Set();
    for (let i = 0; i < types.length; i++) {
      if (merged.has(types[i])) {
        // Node has already been merged into something else, so skip it
        continue;
      }

      for (let j = i + 1; j < types.length; j++) {
        if (!merged.has(types[j]) && types[i].merge(types[j])) {
          // types[j] has been combined into types[i]
          merged.add(types[j]);
        }
      }
    }
  }

  private merge(type: ExportableType): boolean {
    let typesMatch = false;
    if (typeof this.type === 'string') {
      if (typeof type.type === 'string') {
        typesMatch = this.type == type.type;
      }
    } else {
      // this.type is a ts.Node
      if (typeof type.type !== 'string') {
        typesMatch = checkTypeCompatibility(this.type, type.type);
      }
    }

    if (typesMatch) {
      // The type definitions are logically equal, but for this to functionally
      // be a valid merge, the dependencies of this type and the other type
      // must already have been de-duplicated (e.g. this.deps == type.deps)
      if (this.dependencies_.size != type.dependencies_.size) {
        return false;
      }
      for (let key of this.dependencies_.keys()) {
        if (!type.dependencies_.has(key) || this.dependencies_.get(key)
            !== type.dependencies_.get(key)) {
          return false;
        }
      }

      // Mergeable, so add all of type's titles to this object
      this.titles.push(...type.titles);

      // Move parent edges pointing to type onto this object instead, and
      // rewrite their own type nodes to use new type reference nodes
      for (let dependent of type.dependents_) {
        dependent.parent.dependencies_.set(dependent.key, this);
        this.dependents_.push(dependent);
        // For just these dependents, its like the dependency was
        // renamed to the this node.
        dependent.parent.updateTypeReference(dependent.key);
      }

      // Now clean up the dependencies' back edges to the type instance
      // (they should be gone)
      for (let dep of this.dependencies_.values()) {
        for (let i = dep.dependents_.length - 1; i >= 0; i--) {
          if (dep.dependents_[i].parent === type) {
            // Remove this edge
            dep.dependents_.splice(i, 1);
          }
        }
      }

      // And combine descriptions into this type as well.
      for (let d of type.descriptions) {
        this.descriptions.add(d);
      }
      for (let m of type.memberDescriptions.keys()) {
        let memberSet = this.memberDescriptions.get(m);
        if (!memberSet) {
          memberSet = new Set();
          this.memberDescriptions.set(m, memberSet);
        }
        for (let d of type.memberDescriptions.get(m)!) {
          memberSet.add(d);
        }
      }

      return true;
    } else {
      // Not the same typescript type
      return false;
    }
  }

  private updateTypeReference(key: string): void {
    if (typeof this.type === 'string') {
      // Virtual aggregate so no type to rewrite
      return;
    } else if (ts.isArrayTypeNode(this.type)) {
      // Assert key is special [] and then replace element type
      if (key != '[]') {
        throw new Error('Unexpected key for array type dependency');
      }
      this.type.elementType = this.dependencies_.get(
          key)!.createReferenceType();
    } else if (ts.isTypeLiteralNode(this.type) || ts.isInterfaceDeclaration(
            this.type)) {
      // Update property signature with matching name
      for (let i = 0; i < this.type.members.length; i++) {
        let prop = <ts.PropertySignature> this.type.members[i];
        if ((prop.name as any).text == key) {
          prop.type = this.dependencies_.get(key)!.createReferenceType();
          return;
        }
      }
    } // else not a type we can update
  }

  private static createInterfaceType(title: string, members: ts.TypeElement[],
      dependencies: Map<string, ExportableType>): ExportableType {
    let tsType = ts.createInterfaceDeclaration(undefined,
        [ts.createToken(ts.SyntaxKind.ExportKeyword)], title, undefined,
        undefined, members);
    let exportInterface = new ExportableType(title, tsType);
    for (let name of dependencies.keys()) {
      exportInterface.addDependency(name, dependencies.get(name)!);
    }
    return exportInterface;
  }

  private static createTypeLiteral(title: string,
      members: ts.PropertySignature[],
      dependencies: Map<string, ExportableType>): ExportableType {
    let tsType = ts.createTypeLiteralNode(members);
    let exportLiteral = new ExportableType(title, tsType);

    for (let name of dependencies.keys()) {
      exportLiteral.addDependency(name, dependencies.get(name)!);
    }
    return exportLiteral;
  }

  // Simple types will never be exportable
  private static astSimpleType(type: string): ts.KeywordTypeNode | ts.ArrayTypeNode {
    // The values in schemaOrType refer to the type names of Swagger types
    let keyword: ts.SyntaxKind;
    if (type === 'string') {
      keyword = ts.SyntaxKind.StringKeyword;
    } else if (type === 'integer' || type === 'float' || type === 'number') {
      keyword = ts.SyntaxKind.NumberKeyword;
    } else if (type === 'boolean') {
      keyword = ts.SyntaxKind.BooleanKeyword;
    } else if (type === 'object') {
      keyword = ts.SyntaxKind.AnyKeyword;
    } else if (type === 'array') {
      // Must build up any[] representation, which doesn't fit the simple
      // keyword pattern used by the other cases.
      return ts.createArrayTypeNode(
          ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
    } else {
      throw new Error('Unexpected type: ' + type);
    }

    return ts.createKeywordTypeNode(keyword);
  }

  // If the schema requires creating an enum declaration, then an exportable
  // type is returned. If it's an inline-able enum then a union type node is
  // made.
  private static astEnum(schema: swagger.Schema,
      title: string): ExportableType | ts.UnionTypeNode {
    if (!schema.type || !schema.enum) {
      throw new Error('Unsupported enum definition: ' + schema);
    }

    let members: ts.EnumMember[] = [];

    // In the swagger spec, the enumeration values can be strings, numbers,
    // booleans or objects (assumed not mixed). This supports string and number
    // enums; object ones don't map well to typescript. When the length of an
    // enum is small (<= 3), a union of literals is used without exporting a
    // name.
    if (schema.type === 'boolean') {
      // Always turn the boolean enum into a union, since it should definitely
      // have an enumeration length less than 3.
      let values: ts.TypeNode[] = [];
      for (let v of schema.enum) {
        if (v === true || v === 'true') {
          values.push(ts.createLiteral(true));
        } else if (v === false || v === 'false') {
          values.push(ts.createLiteral(false));
        } else {
          throw new Error('Unsupported enum value: ' + v);
        }
      }

      return ts.createUnionTypeNode(values);
    } else if (schema.type === 'string') {
      if (schema.enum.length <= 3) {
        // Embedded union string literals
        let values: ts.TypeNode[] = [];
        for (let v of schema.enum) {
          values.push(ts.createLiteralTypeNode(ts.createLiteral(v as string)));
        }
        return ts.createUnionTypeNode(values);
      } else {
        // Build a string const enum where keys are the string values in
        // uppercase
        for (let v of schema.enum) {
          let key = camelCaseToEnumName(v as string);
          members.push(ts.createEnumMember(key, ts.createLiteral(v as string)));
        }
      }
    } else if (schema.type === 'float' || schema.type === 'number'
        || schema.type === 'integer') {
      if (schema.enum.length <= 3) {
        // Embedded union of numeric literals
        let values: ts.TypeNode[] = [];
        for (let v of schema.enum) {
          values.push(ts.createLiteralTypeNode(ts.createLiteral(v as number)));
        }
        return ts.createUnionTypeNode(values);
      } else {
        // Build a numeric const enum. The swagger spec does not define names
        // for each enum value, it just defines a restricted set. Make up enum
        // names as V_<value>.
        for (let v of schema.enum) {
          members.push(
              ts.createEnumMember('V_' + v, ts.createLiteral(v as number)));
        }
      }
    } else {
      throw new Error('Unsupported enum definition: ' + schema);
    }

    // If we've reached here, create a const enum from the list of members
    // and export it (otherwise the enum was inlined).
    let enumDecl = ts.createEnumDeclaration(undefined, [
      ts.createToken(ts.SyntaxKind.ExportKeyword),
      ts.createToken(ts.SyntaxKind.ConstKeyword)
    ], title, members);

    // Create a new ExportableType, note that this will be a leaf type since
    // the enum by construction will not have any children dependencies.
    let complexType = new ExportableType(title, enumDecl);
    complexType.addDescription(schema);
    return complexType;
  }

  // Returns an ExportableType if any child is an ExportableType or if
  // isTopLevel is true
  private static astObject(schema: swagger.Schema, title: string,
      isTopLevel: boolean): ExportableType | ts.TypeLiteralNode {
    if (!schema.properties) {
      throw new Error('Unsupported object schema: ' + schema);
    }

    // Get type node for each property, then build a PropertySignature for it
    // based on the name and if it's required or not
    let members = [];
    let dependencies: Map<string, ExportableType> = new Map();
    let explicitMemberDesc = [];
    let memberNames = [];

    for (let name of Object.keys(schema.properties)) {
      let prop = schema.properties[name];
      // Sub-object properties are not at the top level
      let propType = ExportableType.processDefinition(prop, title + '_' + name,
          false);
      let tsType: ts.TypeNode;

      if (propType instanceof ExportableType) {
        // Record the dependency for later linkage (we will have to make an
        // exportable type for this object now). And change propType to be a
        // reference to the title of the export.
        dependencies.set(name, propType);
        tsType = propType.createReferenceType();
      } else {
        // Not a type that directly or transitively exports anything so
        // take the property type as-is
        tsType = propType;
      }

      let required = schema.required && schema.required.indexOf(name) >= 0;
      let questionToken = required ? undefined : ts.createToken(
          ts.SyntaxKind.QuestionToken);
      let signature = ts.createPropertySignature(undefined, name, questionToken,
          tsType, undefined);

      explicitMemberDesc.push(prop.description || '');
      members.push(signature);
      memberNames.push(name);
    }

    // If any children were exports or it's top level, return a properly linked
    // export. Otherwise return the type literal directly.
    if (isTopLevel || dependencies.size > 0) {
      let complexType;
      if (isTopLevel) {
        complexType = ExportableType.createInterfaceType(title, members,
            dependencies);
      } else {
        complexType = ExportableType.createTypeLiteral(title, members,
            dependencies);
      }

      // Add explicit member descriptions for members
      for (let i = 0; i < memberNames.length; i++) {
        complexType.addDescription(explicitMemberDesc[i], memberNames[i]);
      }

      complexType.addDescription(schema);
      return complexType;
    } else {
      // Add all descriptions to members, since there is no description merging
      // to be performed by ExportableType.
      for (let i = 0; i < members.length; i++) {
        let desc = esi.API.createDescription(explicitMemberDesc[i]);
        if (isValidDescription(desc)) {
          addJSDoc(members[i], desc);
        }
      }
      return ts.createTypeLiteralNode(members);
    }
  }

  private static astArray(schema: swagger.Schema,
      title: string): ExportableType | ts.ArrayTypeNode {
    if (!schema.items || Array.isArray(schema.items)) {
      throw new Error('Unsupported array schema: ' + schema);
    }

    // This array type has a single element in its items[],
    // so build a type node for that and then wrap it.
    // - bump top level to true so that array element types can be written
    //   as interface A { ... }; A[], instead of an awkward { ... }[].
    let element = ExportableType.processDefinition(schema.items,
        title + '_element', true);

    if (element instanceof ExportableType) {
      // This will be an export without a declaration (since arrays won't
      // actually be exported, but we need to track the element type's
      // dependencies). And treat the array's type as a type reference to the
      // exported type.
      let titles = [title];
      if (schema.title) {
        titles.push(schema.title);
      }

      let arrayExport = new ExportableType(title,
          ts.createArrayTypeNode(element.createReferenceType()));
      arrayExport.addDependency('[]', element);
      arrayExport.addDescription(schema);
      return arrayExport;
    } else {
      // Not a custom type, so return the node directly
      return ts.createArrayTypeNode(element);
    }
  }

  static processDefinition(schemaOrType: string | swagger.Response | swagger.Parameter | swagger.Schema,
      title: string, isTopLevel: boolean = true): ExportableType | ts.TypeNode {
    if (typeof schemaOrType === 'string') {
      // Simple types will not be exported
      return ExportableType.astSimpleType(schemaOrType);
    } else if (isSchema(schemaOrType)) {
      if (schemaOrType.properties) {
        return ExportableType.astObject(schemaOrType, title, isTopLevel);
      } else if (schemaOrType.items) {
        return ExportableType.astArray(schemaOrType, title);
      } else if (schemaOrType.enum) {
        return ExportableType.astEnum(schemaOrType, title);
      } else if (schemaOrType.type) {
        return ExportableType.processDefinition(schemaOrType.type, title,
            isTopLevel);
      } else {
        throw new Error('Unsupported schema definition: ' + schemaOrType);
      }
    } else if ((schemaOrType as any).schema) {
      // A Response or a BodyParameter, which don't share a common interface
      return ExportableType.processDefinition((schemaOrType as any).schema,
          title, isTopLevel);
    } else {
      return ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword);
    }
  }

  private static createParameterType(route: esi.Route,
      root: ExportableType): ExportableType | undefined {
    let routeType = root.dependency(route.id);
    if (!routeType) {
      throw new Error(
          'Route group is undefined after processing spec: ' + route.id);
    }

    // Collect types for the route's parameters, excluding the common core of
    // parameters that the agent manages on its own, and separate them into
    // their sources.
    let queryParams = new Map();
    let queryParamSigs :ts.PropertySignature[] = [];
    let pathParams = new Map();
    let pathParamSigs :ts.PropertySignature[] = [];
    let bodyParam;
    let bodyQuestionToken;
    for (let param of route.parameterNames) {
      if (FILTER_PARAMS.indexOf(param) >= 0) {
        continue;
      }

      let source = route.parameterSource(param);
      let questionToken = route.isParameterRequired(param) ? undefined
          : ts.createToken(ts.SyntaxKind.QuestionToken);
      let paramType = routeType.dependency(param);
      if (!paramType) {
        throw new Error(
            'Parameter type is undefined after processing route: ' + route.id
            + ' -> ' + param);
      }

      if (source === 'query' || source === 'path') {
        // These are handled the same, just changing which aggregate they go to
        let depMap = source === 'query' ? queryParams : pathParams;
        let sigs = source === 'query' ? queryParamSigs : pathParamSigs;
        depMap.set(param, paramType);
        sigs.push(ts.createPropertySignature(undefined, param, questionToken,
            paramType.createReferenceType(), undefined));
      } else if (source === 'body') {
        // There can only be one body parameter
        if (bodyParam) {
          throw new Error(
              'Multiple body parameters in route are not supported: '
              + route.id);
        } else {
          bodyParam = paramType;
          bodyQuestionToken = questionToken;
        }
      } else {
        throw new Error('Unsupported parameter source: ' + source);
      }
    }

    // Group the three sources into their own ExportableTypes as type literals
    let aggregateSigs = [];
    let aggregateDeps = new Map();
    // Include the query parameters as an object literal labeled 'query'
    if (queryParamSigs.length > 0) {
      let queryType = ExportableType.createTypeLiteral(
          route.id + '_query_params', queryParamSigs, queryParams);
      aggregateDeps.set('query', queryType);
      aggregateSigs.push(
          ts.createPropertySignature(undefined, 'query', undefined,
              queryType.createReferenceType(), undefined));
    }
    // Include the path parameters as an object literal labeled 'path'
    if (pathParamSigs.length > 0) {
      let pathType = ExportableType.createTypeLiteral(route.id + '_path_params',
          pathParamSigs, pathParams);
      aggregateDeps.set('path', pathType);
      aggregateSigs.push(
          ts.createPropertySignature(undefined, 'path', undefined,
              pathType.createReferenceType(), undefined));
    }
    // Include the body directly as the property 'body' if it exists
    if (bodyParam) {
      aggregateDeps.set('body', bodyParam);
      aggregateSigs.push(
          ts.createPropertySignature(undefined, 'body', bodyQuestionToken,
              bodyParam.createReferenceType(), undefined));
    }

    if (aggregateSigs.length > 0) {
      return ExportableType.createTypeLiteral(route.id + '_params',
          aggregateSigs, aggregateDeps);
    } else {
      // No parameters required for the route
      return undefined;
    }
  }

  private static createParameterTypeAggregate(spec: esi.API,
      root: ExportableType): ExportableType {
    let memberTypes = new Map();
    let members = [];

    for (let route of spec.routeIDs) {
      let paramType = ExportableType.createParameterType(spec.route(route)!,
          root);
      if (paramType) {
        memberTypes.set(route, paramType);
        members.push(ts.createPropertySignature(undefined, route, undefined,
            paramType.createReferenceType(), undefined));
      } else {
        members.push(ts.createPropertySignature(undefined, route, undefined,
            ts.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
            undefined));
      }
    }

    let params = ExportableType.createInterfaceType('Parameters', members,
        memberTypes);
    params.addDescription(
        'A special-purpose interface that provides keys mapping from route ID to a structure describing the parameters for the route.  This is not intended to be instantiated, but as a tool with TypeScript\'s `keyof` features to support type checking on generic request functions');
    for (let id of spec.routeIDs) {
      let route = spec.route(id)!;
      params.addDescription(
          'The type of this member specifies the path, query, and body parameters for the route: [`'
          + route.httpMethod.toUpperCase() + ' ' + route.path + '`]('
          + route.docURL
          + '). If the type does not have a `query`, `path`, or `body` property, then the route does not define parameters for that source type.',
          id);
    }

    return params;
  }

  private static createResponseTypeAggregate(spec: esi.API,
      root: ExportableType): ExportableType {
    let memberTypes = new Map();
    let members = [];

    for (let route of spec.routeIDs) {
      let routeAggregate = root.dependency(route);
      if (!routeAggregate) {
        throw new Error(
            'Route group is undefined after processing spec: ' + route);
      }
      let responseType = routeAggregate.dependency('__response__');
      if (!responseType) {
        throw new Error(
            'Route response type is undefined after processing spec: ' + route);
      }

      let sig = ts.createPropertySignature(undefined, route, undefined,
          responseType.createReferenceType(), undefined);

      memberTypes.set(route, responseType);
      members.push(sig);
    }

    let rawResponses = ExportableType.createInterfaceType('Responses', members,
        memberTypes);
    rawResponses.addDescription(
        'A special-purpose interface that provides keys mapping from route ID to the response type for each route.  This is not intended to be instantiated, but as a tool with TypeScript\'s `keyof` features to support type checking on generic response functions');
    for (let id of spec.routeIDs) {
      let route = spec.route(id)!;
      rawResponses.addDescription(
          'The type of this member is the response type of for the route: [`'
          + route.httpMethod.toUpperCase() + ' ' + route.path + '`]('
          + route.docURL + ').', id);
    }
    return rawResponses;
  }

  private static createRouteURLMap(spec: esi.API): ExportableType {
    // First create a value type to hold the URL and the HTTP method.
    let urlSig = ts.createPropertySignature(undefined, 'url', undefined,
        ts.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), undefined);
    let httpMethodType = ts.createUnionTypeNode([
      ts.createLiteralTypeNode(ts.createLiteral('GET')),
      ts.createLiteralTypeNode(ts.createLiteral('POST')),
      ts.createLiteralTypeNode(ts.createLiteral('PUT')),
      ts.createLiteralTypeNode(ts.createLiteral('DELETE'))
    ]);
    let methodSig = ts.createPropertySignature(undefined, 'method', undefined,
        httpMethodType, undefined);
    let urlMapType = ExportableType.createInterfaceType('URLInfo',
        [urlSig, methodSig], new Map());

    let mapInitializers = [];
    let mapMembers = [];
    let mapDependencies = new Map();
    for (let id of spec.routeIDs) {
      let route = spec.route(id)!;

      let url = ts.createPropertyAssignment('url',
          ts.createLiteral(route.path));
      let method = ts.createPropertyAssignment('method',
          ts.createLiteral(route.httpMethod.toUpperCase()));
      let value = ts.createObjectLiteral([url, method], false);

      mapInitializers.push(ts.createPropertyAssignment(id, value));
      mapMembers.push(ts.createPropertySignature(undefined, id, undefined,
          urlMapType.createReferenceType(), undefined));
      mapDependencies.set(id, urlMapType);
    }

    let routeMapType = ExportableType.createInterfaceType('RouteMap',
        mapMembers, mapDependencies);

    let declaration = ts.createVariableStatement([
      ts.createToken(ts.SyntaxKind.ExportKeyword),
      ts.createToken(ts.SyntaxKind.ConstKeyword)
    ], [
      ts.createVariableDeclaration('ROUTE_MAP',
          routeMapType.createReferenceType(),
          ts.createObjectLiteral(mapInitializers, true))
    ]);

    let routeMap = new ExportableType('ROUTE_MAP', declaration);
    routeMap.addDependency('RouteMap', routeMapType);
    return routeMap;
  }

  static buildTypeGraph(spec: esi.API): ExportableType {
    let root = new ExportableType('root', 'root');
    for (let routeID of spec.routeIDs) {
      let route = spec.route(routeID)!;
      let routeAggregator = new ExportableType(routeID, 'route');
      root.addDependency(routeID, routeAggregator);

      // Convert all parameters
      for (let param of route.parameterNames) {
        let type = ExportableType.processDefinition(route.parameterData(param)!,
            routeID + '_' + param);
        if (type instanceof ExportableType) {
          routeAggregator.addDependency(param, type);
          type.addDescription('This type is a parameter for the route, [`'
              + route.httpMethod.toUpperCase() + ' ' + route.path + '`]('
              + route.docURL + ').');
        } else {
          // Explicitly include the parameter as well
          routeAggregator.addDependency(param,
              new ExportableType(routeID + '_' + param, type));
        }
      }

      // Convert response
      let suffix = route.httpMethod != 'get' ? '_response' : '';
      let response = ExportableType.processDefinition(route.response, routeID);
      if (response instanceof ExportableType) {
        response.titles[0] = routeID + suffix;
        routeAggregator.addDependency('__response__', response);
        response.addDescription('This is the response type for the route, [`'
            + route.httpMethod.toUpperCase() + ' ' + route.path + '`]('
            + route.docURL + ').');
      } else {
        // Explicitly convert it to one, even though it's a simple type so that
        // the entire route ID -> type map can be built
        routeAggregator.addDependency('__response__',
            new ExportableType(routeID + suffix, response));
      }
    }

    root.buildMaximalReuseGraph();

    root.addDependency('Responses',
        ExportableType.createResponseTypeAggregate(spec, root));
    root.addDependency('Parameters',
        ExportableType.createParameterTypeAggregate(spec, root));
    root.addDependency('ROUTE_MAP', ExportableType.createRouteURLMap(spec));

    root.updateASTWithJSDoc();

    return root;
  }
}
