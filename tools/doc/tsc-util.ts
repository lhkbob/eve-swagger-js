import * as ts from 'typescript';

export function hasModifier(node: ts.Node, modifier: ts.ModifierFlags) : boolean {
  return (ts.getCombinedModifierFlags(node) & modifier) !== 0;
}

export function isExported(node: ts.Node) : boolean {
  return hasModifier(node, ts.ModifierFlags.Export) || hasModifier(node, ts.ModifierFlags.ExportDefault);
}

export function getNameAsString(name:string|ts.Identifier|ts.QualifiedName|ts.StringLiteral|ts.NumericLiteral|ts.ComputedPropertyName|ts.BindingPattern|undefined):string {
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