import * as ts from "typescript";
import * as fs from "fs";

interface NodeSummary {
  name?:string;
  kind?:string;
  type?:{id:number, name:string};
  text?:string;
  children?:NodeSummary[];
}

interface Type {
  type: ts.Type;
  id: number;
  name: string;
}

function walkProgram(fileNames: string[], options: ts.CompilerOptions) : void {
  // Build a program using the set of root file names in fileNames
  let program = ts.createProgram(fileNames, options);

  // Get the checker, we will use it to find more about classes
  let checker = program.getTypeChecker();

  let output: NodeSummary[] = [];

  // Visit every sourceFile in the program
  for (const sourceFile of program.getSourceFiles()) {
    if (!sourceFile.isDeclarationFile) {
      // Walk the tree
      let summary = visit(sourceFile, checker);
      if (summary) {
        output.push(summary);
      }
    }
  }

  // print out the doc
  fs.writeFileSync("ast.json", JSON.stringify(output, undefined, 4));

  // for (let [t, i] of knownTypes.entries()) {
  //   let symbol = t.getSymbol();
  //   if (symbol) {
  //     console.log(i + ': ' + checker.symbolToString(symbol) + ' -> ' + checker.typeToString(t));
  //   } else {
  //     console.log(i + ': <no symbol> -> ' + checker.typeToString(t));
  //   }
  // }
}

function hasModifier(node: ts.Node, modifier: ts.ModifierFlags) : boolean {
  return (ts.getCombinedModifierFlags(node) & modifier) !== 0;
}

function isExported(node: ts.Node) : boolean {
  return hasModifier(node, ts.ModifierFlags.Export) || hasModifier(node, ts.ModifierFlags.ExportDefault);
}

function isPublic(node: ts.Node) : boolean {
  return hasModifier(node, ts.ModifierFlags.Public) || (!hasModifier(node, ts.ModifierFlags.Protected) && !hasModifier(node, ts.ModifierFlags.Private));
}

function getNameAsString(name:string|ts.Identifier|ts.QualifiedName|ts.StringLiteral|ts.NumericLiteral|ts.ComputedPropertyName|ts.BindingPattern|undefined):string {
  if (name === undefined) {
    return 'undefined';
  } else if (typeof name === 'string') {
    return name;
  } else if (ts.isIdentifier(name)) {
    return name.text;
  } else if (ts.isQualifiedName(name)) {
    return getNameAsString(name.left) + '.' + getNameAsString(name.right);
  } else if (ts.isStringLiteral(name)) {
    return name.text;
  } else if (ts.isNumericLiteral(name)) {
    return name.text;
  } else if (ts.isComputedPropertyName(name)) {
    return '{computed: ' + name.getText() + '}';
  } else if (ts.isObjectBindingPattern(name)) {
    return '{object-binding: ' + name.getText() + '}';
  } else if (ts.isArrayBindingPattern(name)) {
    return '{array-binding: ' + name.getText() + '}';
  } else {
    return '{unknown}';
  }
}

function isType(object:any) : object is ts.Type {
  return (object as any)['getSymbol'] !== undefined;
}

let knownTypes:Map<ts.Type, number> = new Map();
let typeIDSeq = 1;
function getType(nodeOrType: ts.Type | ts.Node | undefined, checker:ts.TypeChecker) : Type | undefined {
  let type: ts.Type | undefined = undefined;

  if (nodeOrType === undefined) {
    return undefined;
  } else if (isType(nodeOrType)) {
    // First argument is a type already
    type = nodeOrType;
  } else {
    // First argument is a node
    if (ts.isTypeNode(nodeOrType)) {
      type = checker.getTypeFromTypeNode(nodeOrType);
    } else if ((nodeOrType as any).name && nodeOrType.flags) {
      try {
        type = checker.getTypeAtLocation(nodeOrType);
      } catch(e) {
        console.log('Unable to determine type: ' + nodeOrType.getText());
      }
    }
  }

  if (type) {
    let id = knownTypes.get(type);
    if (id === undefined) {
      id = typeIDSeq++;
      knownTypes.set(type, id);
    }

    // Have an id, now get a name for the type
    let name = checker.typeToString(type);
    return {type, id, name};
  }

  return undefined;
}

function getJSONSafeType(type:Type|undefined): {name:string, id:number}|undefined {
  if(type) {
    return {name: type.name, id: type.id};
  } else {
    return undefined;
  }
}

function visitChildren(node:ts.Node, checker: ts.TypeChecker) : NodeSummary[] | undefined {
  let children: NodeSummary[] = [];
  node.forEachChild(c => {
    let summary = visit(c, checker);
    if (summary) {
      if (summary.kind === 'skipped') {
        children.push(...summary.children!);
      } else {
        children.push(summary);
      }
    }
    return undefined;
  });

  if (children.length > 0) {
    return children;
  } else {
    return undefined;
  }
}

function visitNode(node:ts.Node, checker: ts.TypeChecker) :NodeSummary | undefined {
  let type = getType(node, checker);

  if (ts.isClassDeclaration(node) && isExported(node)) {
    return {
      name: getNameAsString(node.name),
      kind: 'class',
      type: getJSONSafeType(type)
    }
  } else if (ts.isInterfaceDeclaration(node) && isExported(node)) {
    return {
      name: getNameAsString(node.name),
      kind: 'interface',
      type: getJSONSafeType(type)
    }
  } else if (ts.isEnumDeclaration(node) && isExported(node)) {
    return {
      name: getNameAsString(node.name),
      kind: 'enum',
      type: getJSONSafeType(type)
    }
  } else if (ts.isFunctionDeclaration(node) && isExported(node)) {
    let summary:NodeSummary = {
      name: getNameAsString(node.name), kind: 'function'
    };
    let sig = checker.getSignatureFromDeclaration(node);
    if (sig) {
      summary.type = getJSONSafeType(getType(checker.getReturnTypeOfSignature(sig), checker));
    }
    return summary;
  } else if (ts.isModuleDeclaration(node) && isExported(node)) {
    return {
      name: getNameAsString(node.name),
      kind: 'namespace'
    }
  } else if (ts.isSourceFile(node)) {
    return {
      name: node.fileName, kind: 'source file'
    }
  } else if (ts.isSetAccessorDeclaration(node) && isPublic(node)) {
    let summary:NodeSummary = {
      name: getNameAsString(node.name), kind: 'setter'
    };
    let sig = checker.getSignatureFromDeclaration(node);
    if (sig) {
      summary.type = getJSONSafeType(getType(checker.getTypeOfSymbolAtLocation(sig.getParameters()[0], node), checker));
    }
    return summary;
  } else if (ts.isGetAccessorDeclaration(node) && isPublic(node)) {
    let summary: NodeSummary = {
      name: getNameAsString(node.name), kind: 'getter'
    };
    let sig = checker.getSignatureFromDeclaration(node);
    if (sig) {
      summary.type = getJSONSafeType(
          getType(checker.getReturnTypeOfSignature(sig), checker));
    }
    return summary;
  } else if ((ts.isMethodDeclaration(node) || ts.isMethodSignature(node)) && isPublic(node)) {
    // HACK for now
    // FIXME REVIEW what was this trying to accomplish?
    /*if (node.getText().indexOf('AsyncIterableIterator') >= 0) {
      console.log(node.kind);
      console.log(node.getText());
      console.log(checker.typeToString(checker.getTypeAtLocation(node)));

      node.forEachChild(c => {
        // console.log(c.kind);
        if (ts.isTypeReferenceNode(c)) {
          let itType = checker.getTypeFromTypeNode(c);
          console.log(c.getText());
          console.log(c.typeName.kind);
          console.log((c.typeArguments || []).length);
          if (c.typeArguments && c.typeArguments.length > 0) {
            let arg = checker.getTypeFromTypeNode(c.typeArguments[0]);
            console.log('arg:', checker.typeToString(arg));
          }
          console.log('itType:', checker.typeToString(itType));

        }
      });
    }*/

    let summary:NodeSummary = {
      name: getNameAsString(node.name), kind: 'method'
    };
    let sig = checker.getSignatureFromDeclaration(node);
    if (sig) {
      summary.type = getJSONSafeType(getType(checker.getReturnTypeOfSignature(sig), checker) || type);
    }
    return summary;
  } else if ((ts.isPropertyDeclaration(node) || ts.isPropertySignature(node)) && isPublic(node)) {
    return {
      name: getNameAsString(node.name), kind: 'property', type: getJSONSafeType(getType(node.type, checker) || type)
    }
  } else if (ts.isTypeElement(node) && isPublic(node)) {
    return {
      name: getNameAsString(node.name),
      kind: 'member',
      type: getJSONSafeType(type)
    }
  } else if (ts.isCallExpression(node)) {
    let caller = node.expression;
    if (ts.isPropertyAccessExpression(caller)) {
      let propertyName = getNameAsString(caller.name);

      if (propertyName == 'request') {
        let callerTypeName = checker.typeToString(
            checker.getTypeAtLocation(caller.expression));

        if (callerTypeName == 'ESIAgent') {
          // HACK for now
          let route = (node.arguments[0] as ts.StringLiteral).text;
          return {
            name: route, kind: 'route'
          };
        }
      }
    }
    return undefined;
  } else {
    return undefined;
  }
}

function visit(node:ts.Node, checker: ts.TypeChecker) :NodeSummary | undefined {
  let summary = visitNode(node, checker);
  let children = visitChildren(node, checker);
  // let text = node.getText();

  if (summary) {
    summary.children = children;
    // summary.text = text;
  } else if (children){
    summary = {kind: 'skipped', children, text: node.getText()};
  }

  return summary;
}

walkProgram(process.argv.slice(2), {
  target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
});