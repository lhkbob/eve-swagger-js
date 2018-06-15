import { Indexable, LabeledData } from './doc-tree';
export interface Type<K extends string> {
    kind: K;
}
export interface PrimitiveType extends Type<'primitive'> {
    name: 'boolean' | 'number' | 'string';
}
export interface EnumType extends Type<'enum'> {
    name: string;
    members: string[];
    values: string[] | number[] | null;
}
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
    types: Type<any>[];
}
export interface ObjectLiteralType extends PropertyType<'object'> {
}
export interface ClassType<K extends 'class' | 'interface'> extends PropertyType<K> {
    name: string;
    parent: Type<any> | null;
}
export interface SimpleTypeData extends Indexable {
    description: string;
    type: Type<any>;
}
export declare function buildTypesIndex(): LabeledData<SimpleTypeData>[];
export declare function isPrimitiveType(t: Type<any>): t is PrimitiveType;
export declare function isEnumType(t: Type<any>): t is EnumType;
export declare function isReferenceType(t: Type<any>): t is ReferenceType;
export declare function isAliasType(t: Type<any>): t is AliasType;
export declare function isArrayType(t: Type<any>): t is ArrayType;
export declare function isObjectLiteralType(t: Type<any>): t is ObjectLiteralType;
export declare function isClassType(t: Type<any>): t is ClassType<'class'>;
export declare function isInterfaceType(t: Type<any>): t is ClassType<'interface'>;
