import * as esi from '../esi-api';
import { ExportableType } from './exportable-type';
import { Namespace } from './namespace';
import { getTypeName } from './get-type-name';

import * as ts from 'typescript';
import { outputFileSync, removeSync } from 'fs-extra';
import { join } from 'path';

function correctPrintedSyntax(code: string) :string {
  // Currently, the TypeScript Compiler's printer adds a "var" token to variable
  // statements regardless of what other modifiers are there. Even if it is
  // a const variable (which should just be const NAME = ...).
  //
  // So this employs a couple of semi-dumb fixes:
  // 1. Replaces "const var NAME =" with "const NAME ="
  code = code.replace(/const\s+var(\s+.+\s*)([=:])/g, 'const$1$2');
  // 2. Replaces "let var NAME =" and "var NAME =" with "let NAME ="
  code = code.replace(/(let)?\s*var(\s+.+\s*)([=:])/g, 'let$2$3');

  // The printer also uses the keyword 'module' instead of the newer and
  // preferred 'namespace' token.
  code = code.replace(/export module/g, 'export namespace');
  return code;
}

function generateTypeNamesForNamespace(namespace: Namespace): void {
  let typeNames: Map<string, ExportableType> = new Map();

  for (let type of namespace.members) {
    if (!type.hasDeclaration) {
      continue;
    }

    let name = getTypeName(namespace, type);
    if (typeNames.has(name)) {
      // Duplicate type name was computed
      let dup = typeNames.get(name)!;
      throw new Error(
          'Duplicate type name: ' + name + ', caused by ' + type.titles[0]
          + ' and ' + dup.titles[0]);
    } else {
      typeNames.set(name, type);
    }
  }

  // No duplicate types so push renames into type system
  let namespaceName = namespace.fullName;
  for (let name of typeNames.keys()) {
    let type = typeNames.get(name)!;
    let fullName = namespaceName !== '' ? namespaceName + '.' + name : name;
    type.renameType(fullName);
  }

  for (let c of namespace.children) {
    generateTypeNamesForNamespace(c);
  }
}

function writeTypescriptFile(namespace: Namespace, rootDir: string,
    printer: ts.Printer): number {
  let statements = [];

  // First import the base ESI module that will allow all type references to
  // be resolved properly. This technically creates cycles but since its only
  // to resolve type names, the compiler seems to be able to handle it (even
  // when the base module imports itself).
  // - but not necessary for true root since it will import esi as one of its
  // children.
  if (namespace.parent) {
    let baseImportPath = 'esi';
    let depth = namespace.depth;
    if (namespace.leaf) {
      depth--;
    }
    for (let i = 0; i < depth; i++) {
      baseImportPath = '../' + baseImportPath;
    }

    statements.push(ts.createImportDeclaration(undefined, undefined,
        ts.createImportClause(undefined,
            ts.createNamespaceImport(ts.createIdentifier('esi'))),
        ts.createLiteral(baseImportPath)));
  }

  // Next include re-export statements for each child namespace and generate
  // the TypeScript file to import in the first place.
  let childDeclCount = 0;
  for (let c of namespace.children) {
    childDeclCount += writeTypescriptFile(c, rootDir, printer);
    // The child namespace will either be written to ./<name>.ts if it is a leaf
    // or it will be written to ./<name>/index.ts. In either case, importing
    // from ./<name> will work with Typescripts module resolution strategy.
    let importFile = './' + c.name.toLowerCase();

    statements.push(ts.createImportDeclaration(undefined, undefined,
        ts.createImportClause(undefined,
            ts.createNamespaceImport(ts.createIdentifier(c.name))),
        ts.createLiteral(importFile)));

    statements.push(ts.createExportDeclaration(undefined, undefined,
        ts.createNamedExports([ts.createExportSpecifier(undefined, c.name)])));
  }

  // Now include all immediate type declarations
  for (let t of namespace.members) {
    if (!t.hasDeclaration) {
      continue;
    }

    statements.push(t.type as ts.Statement);
  }

  // Now determine the file location for the generate file and write it out
  let relativeSourcePath;

  if (namespace.parent) {
    relativeSourcePath = join('.', ...namespace.parent!.fullName.split('.'));
    if (namespace.leaf) {
      relativeSourcePath = join(relativeSourcePath, namespace.name + '.ts');
    } else {
      relativeSourcePath = join(relativeSourcePath, namespace.name, 'index.ts');
    }
  } else {
    relativeSourcePath = './routes.ts';
  }

  let sourceFile = ts.createSourceFile(relativeSourcePath, '',
      ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  sourceFile = ts.updateSourceFileNode(sourceFile, statements);
  let code = correctPrintedSyntax(printer.printFile(sourceFile));

  outputFileSync(join(rootDir, relativeSourcePath), code);

  return childDeclCount + namespace.declarationCount;
}

function toNamespaceAST(namespace:Namespace) :[ts.Statement[], number] {
  let declCount = 0;
  let statements = [];
  for (let c of namespace.children) {
    let [cn, ct] = toNamespaceAST(c);
    declCount += ct;
    statements.push(...cn);
  }

  for (let m of namespace.members) {
    if (m.hasDeclaration) {
      statements.push(m.type as ts.Statement);
      declCount++;
    }
  }

  if (namespace.parent) {
    let name = ts.createIdentifier(namespace.name);
    let body = ts.createModuleBlock(statements);
    return [
     [ ts.createModuleDeclaration(undefined,
          [ts.createToken(ts.SyntaxKind.ExportKeyword)], name, body) ], declCount
    ];
  } else {
    return [ statements, declCount ];
  }
}

function writeMonolithicNamespace(namespace:Namespace, file:string, printer: ts.Printer) :number {
  let [ast, count] = toNamespaceAST(namespace);
  let sourceFile = ts.createSourceFile(file, '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  sourceFile = ts.updateSourceFileNode(sourceFile, ast);
  let code = correctPrintedSyntax(printer.printFile(sourceFile));

  outputFileSync(file, code);
  return count;
}

export function generateTypes(rootDir: string): void {
  let spec = esi.API.getLocalAPI();
  let root = ExportableType.buildTypeGraph(spec);
  Namespace.assign(spec, root);
  Namespace.root.reduce(3);

  // Calculate good types for every declaration
  generateTypeNamesForNamespace(Namespace.root);

  let printer = ts.createPrinter(
      { newLine: ts.NewLineKind.LineFeed, removeComments: false });

  // TODO uncomment and use separate module files once TypeScript supports
  // properly inferring types that are re-exported. As it stands, having these
  // types broken up into multiple modules isn't useful if you have to explicitly
  // import everything.
  // Now export everything by first purging the root generated directory
  // and then writing out all files
  /*removeSync(join(rootDir, 'esi'));
  removeSync(join(rootDir, 'routes.ts'));
  let typeCount = writeTypescriptFile(Namespace.root, rootDir,
      printer);

  console.log(`Generated ${typeCount} types successfully as modules.`);*/

  let monolith = join(rootDir, 'esi.ts');
  removeSync(monolith);
  let typeCount = writeMonolithicNamespace(Namespace.root, monolith, printer);
  console.log(`Generated ${typeCount} types in monolithic namespace.`);
}

if (!module.parent) {
  try {
    generateTypes(join(__dirname, '../../../gen'));
  } catch (e) {
    console.error('Failed to generate types:', e.message);
    console.error(e.stack);
  }
}
