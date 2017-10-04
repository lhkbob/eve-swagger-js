import * as esi from '../esi-api';
import { ExportableType } from './exportable-type';
import { Namespace } from './namespace';
import { getTypeName } from './get-type-name';

import * as ts from 'typescript';
import { writeFileSync } from 'fs';
import { join } from 'path';

export interface Options {
  printTypeScript: boolean; // Whether or not TS is written
  verbose: boolean; // Whether or not debugging info is output to console
  outputFile?: string; // File path to print TS to file, or undefined to print
                       // to console
  restrictNamespace?: string; // If defined, restrict to a specific namespace
  restrictRoute?: string; // If defined, restrict to a specific route
  parameter?: string | '__response__'; // If defined, restrict to a route's
                                       // parameter or response
  children: boolean; // If true, include children of restricted namespace
}

export function generateTypes(opts: Options): void {
  let spec = esi.API.getLocalAPI();
  let root = ExportableType.buildTypeGraph(spec);
  Namespace.assign(spec, root);
  Namespace.root.reduce(3);

  // Calculate good types for every declaration
  generateTypeNamesForNamespace(Namespace.root);

  // Handle all the output
  let typeCount = writeMonolithicNamespace(spec, opts);

  if (!opts.printTypeScript) {
    console.log(`Generated ${typeCount} types in monolithic namespace.`);
  }
}

function correctPrintedSyntax(code: string): string {
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
  let explicitNames: Map<string, boolean> = new Map();

  for (let type of namespace.members) {
    if (!type.hasDeclaration) {
      continue;
    }

    let [name, explicit] = getTypeName(namespace, type);
    if (typeNames.has(name)) {
      // Duplicate type name was computed
      let dup = typeNames.get(name)!;
      throw new Error(
          'Duplicate type name: ' + name + ', caused by ' + type.titles[0]
          + ' and ' + dup.titles[0]);
    } else {
      typeNames.set(name, type);
      explicitNames.set(name, explicit);
    }
  }

  // No duplicate types so push renames into type system
  let namespaceName = namespace.fullName;
  for (let name of typeNames.keys()) {
    let type = typeNames.get(name)!;
    let fullName = namespaceName !== '' ? namespaceName + '.' + name : name;
    type.renameType(fullName, explicitNames.get(name));
  }

  for (let c of namespace.children) {
    generateTypeNamesForNamespace(c);
  }

  namespace.sortMembers();
}

function getTypeDebugLog(type: ExportableType): string {
  let log = '-----------------\n';
  log += `Type ${type.typeName} (explicit = ${type.isTypeNameExplicitlySet}), from:\n`;
  for (let t of type.titles) {
    log += `  - ${t}\n`;
  }
  log += ` Considered namespaces:\n`;
  for (let l of type.log) {
    log += `  - ${l}\n`;
  }
  return log;
}

function getNamespaceDebugLog(namespace: Namespace): string {
  let log = '-----------------\n';
  log += `Namespace ${namespace.fullName} (type count = ${namespace.declarationCount}):\n`;
  for (let l of namespace.log) {
    log += `  - ${l}\n`;
  }
  return log;
}

function toNamespaceAST(namespace: Namespace,
    opts: Options): [ts.Statement[], number] {
  // This function assumes that the provided namespace passes any namespace
  // restriction imposed by options (ignores restrictNamespace). It does respect
  // and implement the other options.

  let declCount = 0;
  let statements = [];

  // Only process child namespaces if there was no restriction (e.g. full tree),
  // or if specifically enabled on the restricted namespace.
  if (opts.restrictNamespace === undefined || opts.children) {
    for (let c of namespace.children) {
      let [cn, ct] = toNamespaceAST(c, opts);
      declCount += ct;
      if (ct > 0) {
        statements.push(...cn);
      }
    }
  }

  let declarations = [];
  for (let m of namespace.members) {
    if (m.hasDeclaration && checkTypeAgainstFilter(m, opts)) {
      declarations.push(m);
      statements.push(m.type as ts.Statement);
      declCount++;
    }
  }

  let namespaceLog = '';
  if (declarations.length > 0 && opts.verbose) {
    // First print namespace information
    namespaceLog = getNamespaceDebugLog(namespace);
    if (!opts.printTypeScript) {
      // Just output the log to the console and then clear so it doesn't get
      // attached to the AST later
      console.log(namespaceLog);
      namespaceLog = '';
    }

    // Next print every declaration in alphabetic order in package
    for (let m of declarations) {
      let log = getTypeDebugLog(m);
      if (opts.printTypeScript) {
        if (log) {
          // Attach the log as comments to the statement
          for (let l of log.split('\n')) {
            ts.addSyntheticLeadingComment(m.type as ts.Node,
                ts.SyntaxKind.SingleLineCommentTrivia, l, false);
          }
        }
      } else {
        // Just output the log to the console
        console.log(log);
      }
    }
  }

  if (namespace.parent) {
    let name = ts.createIdentifier(namespace.name);
    let body = ts.createModuleBlock(statements);
    // Convert statements into a single declaration
    statements = [
      ts.createModuleDeclaration(undefined,
          [ts.createToken(ts.SyntaxKind.ExportKeyword)], name, body)
    ];
  }

  // Attach namespace log if it's available to export namespace, or just first
  // line if at the root.
  if (namespaceLog) {
    for (let l of namespaceLog.split('\n')) {
      ts.addSyntheticLeadingComment(statements[0],
          ts.SyntaxKind.SingleLineCommentTrivia, l, false);
    }
  }
  return [statements, declCount];
}

function checkTypeAgainstFilter(type: ExportableType, opts: Options): boolean {
  if (opts.restrictRoute === undefined) {
    // Everything passes trivially
    return true;
  }

  // Walk up the dependency hierarchy from type until the route meta type
  // is reached, additionally checking for the parameter or response filter
  // if it is set.
  for (let backEdge of type.dependents) {
    if (backEdge.parent.isVirtualAggregate && backEdge.parent.type
        === 'route') {
      // Check the titles of the type for the specific required route id
      let routeFound = false;
      for (let id of backEdge.parent.titles) {
        if (id === opts.restrictRoute) {
          routeFound = true;
          break;
        }
      }

      if (routeFound) {
        // Additionally check for the specific parameter or response
        if (opts.parameter === undefined || opts.parameter === backEdge.key) {
          return true;
        }
      } // Else not the right route, so check other dependents
    } else {
      // Not a route, so recurse up
      if (checkTypeAgainstFilter(backEdge.parent, opts)) {
        return true;
      }
    }
  }

  // Not found in any path up to the root type
  return false;
}

function writeMonolithicNamespace(spec: esi.API, opts: Options): number {
  // Turn the namespace into an AST, starting at either the root or the
  // specified restricted namespace.
  let targetNamespace;
  if (opts.restrictNamespace !== undefined) {
    targetNamespace = Namespace.parse(opts.restrictNamespace);
  } else {
    targetNamespace = Namespace.root;
  }

  let [ast, count] = toNamespaceAST(targetNamespace, opts);

  // Update with a count in the AST
  let header = ts.createNotEmittedStatement(ts.createEmptyStatement());
  ts.addSyntheticLeadingComment(header, ts.SyntaxKind.SingleLineCommentTrivia,
      ' This is a generated file, take caution when editing manually.', false);
  ts.addSyntheticLeadingComment(header, ts.SyntaxKind.SingleLineCommentTrivia,
      ' Run `npm run gen:esi` to regenerate.', false);
  ts.addSyntheticLeadingComment(header, ts.SyntaxKind.SingleLineCommentTrivia,
      ` Generated ${count} types in monolithic namespace for ESI v${spec.version}.`,
      false);
  ast.unshift(header);

  let sourceFile = ts.createSourceFile(opts.outputFile || 'console.ts', '',
      ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
  sourceFile = ts.updateSourceFileNode(sourceFile, ast);

  if (opts.printTypeScript) {
    let printer = ts.createPrinter(
        { newLine: ts.NewLineKind.LineFeed, removeComments: false });
    let code = correctPrintedSyntax(printer.printFile(sourceFile));

    if (opts.outputFile !== undefined) {
      writeFileSync(opts.outputFile, code);
    } else {
      console.log(code);
    }
  }

  return count;
}

function parseArguments(): Options | undefined {
  // Default values before handling argument overrides
  let options: Options = {
    printTypeScript: true,
    verbose: false,
    outputFile: join(__dirname, '../../../src/internal/esi-types.ts'),
    restrictNamespace: undefined,
    restrictRoute: undefined,
    parameter: undefined,
    children: true
  };

  for (let i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === '--dry-run') {
      options.printTypeScript = false;
    } else if (process.argv[i] === '--verbose') {
      options.verbose = true;
    } else if (process.argv[i] === '--console') {
      options.outputFile = undefined;
    } else if (process.argv[i] === '--file') {
      if (i < process.argv.length - 1) {
        options.outputFile = process.argv[++i];
      } else {
        throw new Error('--file requires an argument');
      }
    } else if (process.argv[i] === '--namespace') {
      if (i < process.argv.length - 1) {
        options.restrictNamespace = process.argv[++i];
        options.children = false;
      } else {
        throw new Error('--namespace requires an argument');
      }
    } else if (process.argv[i] === '--namespace-deep') {
      if (i < process.argv.length - 1) {
        options.restrictNamespace = process.argv[++i];
        options.children = true;
      } else {
        throw new Error('--namespace requires an argument');
      }
    } else if (process.argv[i] === '--route') {
      if (i < process.argv.length - 1) {
        options.restrictRoute = process.argv[++i];
      } else {
        throw new Error('--route requires an argument');
      }
    } else if (process.argv[i] === '--response-only') {
      options.parameter = '__response__';
    } else if (process.argv[i] === '--parameter') {
      if (i < process.argv.length - 1) {
        options.parameter = process.argv[++i];
      } else {
        throw new Error('--parameter requires an argument');
      }
    } else if (process.argv[i] === '--help') {
      console.log('ESI type generator arguments:');
      console.log('--dry-run: Do not write out Typescript of generated types');
      console.log('--verbose: Print debug information about generated types');
      console.log('--console: Typescript written to console instead of a file');
      console.log(
          '--file [arg]: Override the file location that Typescript is printed to');
      console.log(
          '--namespace [arg]: Restrict generation and debugging to types within the namespace');
      console.log(
          '--namespace-deep [arg]: As --namespace, but includes all children of the namespace');
      console.log(
          '--route [arg]: Restrict generation and debugging to types from the given route');
      console.log(
          '--response-only: Combined with --route, further restrict to the response type of the route');
      console.log(
          '--parameter [arg]: Combined with --route, further restrict to a specific parameter of the route');
      return undefined;
    } else {
      console.error('Skipping unknown argument:', process.argv[i]);
    }
  }

  // --response-only and --parameter require being used with --route
  if (options.parameter !== undefined && options.restrictRoute === undefined) {
    console.error(
        'No route set with --route, but --response-only or --parameter is specified');
  }

  return options;
}

if (!module.parent) {
  try {
    let options = parseArguments();
    if (options !== undefined) {
      generateTypes(options);
    }
  } catch (e) {
    console.error('Failed to generate types:', e.message);
    console.error(e.stack);
  }
}
