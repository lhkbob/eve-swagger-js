"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tsc_util_1 = require("./tsc-util");
const ts = require("typescript");
function buildTypesIndex() {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(['src/esi.ts'], {
        target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
    });
    let checker = program.getTypeChecker();
    let output = [];
    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree
            let summary = visit(sourceFile, checker, '');
            if (summary) {
                if (summary.label == '' && summary.children) {
                    output.push(...summary.children);
                }
                else {
                    output.push(summary);
                }
            }
        }
    }
    return output;
}
exports.buildTypesIndex = buildTypesIndex;
function isPrimitiveType(t) {
    return t.kind == 'primitive';
}
exports.isPrimitiveType = isPrimitiveType;
function isEnumType(t) {
    return t.kind == 'enum';
}
exports.isEnumType = isEnumType;
function isReferenceType(t) {
    return t.kind == 'reference';
}
exports.isReferenceType = isReferenceType;
function isAliasType(t) {
    return t.kind == 'alias';
}
exports.isAliasType = isAliasType;
function isArrayType(t) {
    return t.kind == 'array';
}
exports.isArrayType = isArrayType;
function isObjectLiteralType(t) {
    return t.kind == 'object';
}
exports.isObjectLiteralType = isObjectLiteralType;
function isClassType(t) {
    return t.kind == 'class';
}
exports.isClassType = isClassType;
function isInterfaceType(t) {
    return t.kind == 'interface';
}
exports.isInterfaceType = isInterfaceType;
function visit(node, checker, packageName) {
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
        }
        else {
            data.children = children;
            return data;
        }
    }
    else {
        return { label: '', children: children };
    }
}
function visitChildren(node, checker, packageName) {
    let children = [];
    node.forEachChild(c => {
        let data = visit(c, checker, packageName);
        if (data && (data.data || data.children)) {
            if (data.label == '' && data.children) {
                // An empty label is a special signal to expand children
                children.push(...data.children);
            }
            else {
                children.push(data);
            }
        }
    });
    if (children.length > 0) {
        return children;
    }
    else {
        return undefined;
    }
}
function visitNode(node, checker, packageName) {
    if (!tsc_util_1.isExported(node)) {
        return undefined;
    }
    if (ts.isModuleDeclaration(node)) {
        // visitChildren handles collecting all of the declarations within the namespace
        return { label: tsc_util_1.getNameAsString(node.name) };
    }
    else if (ts.isClassDeclaration(node)) {
        let type = getClassType(node, checker);
        let data = { key: packageName + type.name, type: type, description: 'class' };
        return { label: type.name, data: data };
    }
    else if (ts.isInterfaceDeclaration(node)) {
        let type = getInterfaceType(node, checker);
        let data = { key: packageName + type.name, type: type, description: 'interface' };
        return { label: type.name, data: data };
    }
    else if (ts.isEnumDeclaration(node)) {
        let type = getEnumType(node, checker);
        let data = { key: packageName + type.name, type: type, description: 'enum' };
        return { label: type.name, data: data };
    }
    return undefined;
}
function getClassType(node, checker) {
    let members = [];
    for (let m of node.members) {
        members.push(tsc_util_1.getNameAsString(m.name));
    }
    // FIXME complete types array
    return { kind: 'class', name: tsc_util_1.getNameAsString(node.name), members: members, parent: null, types: [] };
}
function getInterfaceType(node, checker) {
    let members = [];
    for (let m of node.members) {
        members.push(tsc_util_1.getNameAsString(m.name));
    }
    // FIXME complete types array
    return { kind: 'interface', name: tsc_util_1.getNameAsString(node.name), members: members, parent: null, types: [] };
}
function getEnumType(node, checker) {
    let members = [];
    for (let m of node.members) {
        members.push(tsc_util_1.getNameAsString(m.name));
    }
    // FIXME complete values array
    return { kind: 'enum', name: tsc_util_1.getNameAsString(node.name), members: members, values: [] };
}
//# sourceMappingURL=build-types-index.js.map