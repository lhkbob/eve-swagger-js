"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
function hasModifier(node, modifier) {
    return (ts.getCombinedModifierFlags(node) & modifier) !== 0;
}
exports.hasModifier = hasModifier;
function isExported(node) {
    return hasModifier(node, ts.ModifierFlags.Export) || hasModifier(node, ts.ModifierFlags.ExportDefault);
}
exports.isExported = isExported;
function getNameAsString(name) {
    if (name === undefined) {
        return 'undefined';
    }
    else if (typeof name === 'string') {
        return name;
    }
    else if (ts.isIdentifier(name)) {
        return name.text;
    }
    else if (ts.isQualifiedName(name)) {
        return getNameAsString(name.left) + '.' + getNameAsString(name.right);
    }
    else if (ts.isStringLiteral(name)) {
        return name.text;
    }
    else if (ts.isNumericLiteral(name)) {
        return name.text;
    }
    else if (ts.isComputedPropertyName(name)) {
        return '{computed: ' + name.getText() + '}';
    }
    else if (ts.isObjectBindingPattern(name)) {
        return '{object-binding: ' + name.getText() + '}';
    }
    else if (ts.isArrayBindingPattern(name)) {
        return '{array-binding: ' + name.getText() + '}';
    }
    else {
        return '{unknown}';
    }
}
exports.getNameAsString = getNameAsString;
//# sourceMappingURL=tsc-util.js.map