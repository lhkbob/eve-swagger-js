import * as ts from 'typescript';
export declare function hasModifier(node: ts.Node, modifier: ts.ModifierFlags): boolean;
export declare function isExported(node: ts.Node): boolean;
export declare function getNameAsString(name: string | ts.Identifier | ts.QualifiedName | ts.StringLiteral | ts.NumericLiteral | ts.ComputedPropertyName | ts.BindingPattern | undefined): string;
