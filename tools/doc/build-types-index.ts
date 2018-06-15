import { Indexable, LabeledData } from './doc-tree';
import { isExported, getNameAsString } from './tsc-util';

import * as ts from 'typescript';


// FIXME will there need to be a unified ID system, or is that only important
// during the type checking?
export interface Type<K extends string> {
  kind: K;
}

export interface PrimitiveType extends Type<'primitive'> {
  name: 'boolean' | 'number' | 'string';
}

export interface EnumType extends Type<'enum'> {
  name: string;
  members: string[];
  // null means enum has no explicit values, otherwise the array is parallel
  // to the 'members' array.
  values: string[] | number[] | null;
}

// FIXME if there was a need for ID system, the reference type would need to be
// updated to hold onto that
export interface ReferenceType extends Type<'reference'> {
  name: string;
}

export interface AliasType extends Type<'alias'> {
  name: string;
  value: Type<any>;
}

export interface ArrayType extends Type<'array'> {
  element: Type<any>;
}

export interface PropertyType<K extends string> extends Type<K> {
  members: string[];
  // Parallel to members, which defines the names of the properties
  types: Type<any>[];
}

export interface ObjectLiteralType extends PropertyType<'object'> {

}

export interface ClassType<K extends 'class' | 'interface'> extends PropertyType<K> {
  name: string;
  parent: Type<any> | null;
}

export interface SimpleTypeData extends Indexable {
  // FIXME is this the right spot for the description? what about inline
  // comments for members?
  description: string;
  type: Type<any>;
}

export function buildTypesIndex(): LabeledData<SimpleTypeData>[] {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(['src/esi.ts'], {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
  });

  let checker = program.getTypeChecker();

  let output: LabeledData<SimpleTypeData>[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree
      let summary = visit(sourceFile, checker, '');
      if (summary) {
        if (summary.label == '' && summary.children) {
          output.push(...summary.children);
        } else {
          output.push(summary);
        }
      }
    }
  }

  return output;
}

export function isPrimitiveType(t: Type<any>): t is PrimitiveType {
  return t.kind == 'primitive';
}

export function isEnumType(t: Type<any>): t is EnumType {
  return t.kind == 'enum';
}

export function isReferenceType(t: Type<any>): t is ReferenceType {
  return t.kind == 'reference';
}

export function isAliasType(t: Type<any>): t is AliasType {
  return t.kind == 'alias';
}

export function isArrayType(t: Type<any>): t is ArrayType {
  return t.kind == 'array';
}

export function isObjectLiteralType(t: Type<any>): t is ObjectLiteralType {
  return t.kind == 'object';
}

export function isClassType(t: Type<any>): t is ClassType<'class'> {
  return t.kind == 'class';
}

export function isInterfaceType(t: Type<any>): t is ClassType<'interface'> {
  return t.kind == 'interface';
}



function visit(node: ts.Node,
    checker: ts.TypeChecker, packageName:string): LabeledData<SimpleTypeData> | undefined {
  let data = visitNode(node, checker, packageName);

  if (data && data.data === undefined) {
    // This was a module, so update the package name
    packageName = packageName + data.label.toLowerCase() + '_';
  }

  let children = visitChildren(node, checker, packageName);

  if (data) {
    // The current node is defined, so incorporate children if needed
    if (data.data && children) {
      // Awkward circumstance where it's a "leaf" with children
      return { label: '', children: [data, ...children] };
    } else {
      data.children = children;
      return data;
    }
  } else {
    return { label: '', children: children };
  }
}

function visitChildren(node: ts.Node,
    checker: ts.TypeChecker, packageName:string): LabeledData<SimpleTypeData>[] | undefined {
  let children: LabeledData<SimpleTypeData>[] = [];
  node.forEachChild(c => {
    let data = visit(c, checker, packageName);
    if (data && (data.data || data.children)) {
      if (data.label == '' && data.children) {
        // An empty label is a special signal to expand children
        children.push(...data.children);
      } else {
        children.push(data);
      }
    }
  });

  if (children.length > 0) {
    return children;
  } else {
    return undefined;
  }
}

function visitNode(node: ts.Node,
    checker: ts.TypeChecker, packageName:string): LabeledData<SimpleTypeData> | undefined {
  if (!isExported(node)) {
    return undefined;
  }

  if (ts.isModuleDeclaration(node)) {
    // visitChildren handles collecting all of the declarations within the namespace
    return {label: getNameAsString(node.name)};
  } else if (ts.isClassDeclaration(node)) {
    let type = getClassType(node, checker);
    let data = {key: packageName + type.name, type: type, description: 'class'};

    return {label: type.name, data: data};
  } else if (ts.isInterfaceDeclaration(node)) {
    let type = getInterfaceType(node, checker);
    let data = {key: packageName + type.name, type: type, description: 'interface'};

    return {label: type.name, data: data};
  } else if (ts.isEnumDeclaration(node)) {
    let type = getEnumType(node, checker);
    let data = {key: packageName + type.name, type: type, description: 'enum'};

    return {label: type.name, data: data};
  }

  return undefined;
}

function getClassType(node: ts.ClassDeclaration, checker:ts.TypeChecker) : ClassType<'class'> {
  let members:string[] = [];
  for (let m of node.members) {
    members.push(getNameAsString(m.name));
  }
  // FIXME complete types array
  return {kind: 'class', name: getNameAsString(node.name), members: members, parent: null, types: []};
}

function getInterfaceType(node: ts.InterfaceDeclaration, checker:ts.TypeChecker) :ClassType<'interface'> {
  let members:string[] = [];
  for (let m of node.members) {
    members.push(getNameAsString(m.name));
  }
  // FIXME complete types array
  return {kind: 'interface', name: getNameAsString(node.name), members: members, parent: null, types: []};

}

function getEnumType(node: ts.EnumDeclaration, checker: ts.TypeChecker) :EnumType {
  let members:string[] = [];
  for (let m of node.members) {
    members.push(getNameAsString(m.name));
  }
  // FIXME complete values array
  return {kind: 'enum', name: getNameAsString(node.name), members: members, values: []};

}