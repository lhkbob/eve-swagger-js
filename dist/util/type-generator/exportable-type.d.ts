import * as swagger from 'swagger-schema-official';
import * as ts from 'typescript';
import * as esi from '../esi-api';
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
export declare type TypeVisitor<T> = (path: {
    node: ExportableType;
    key: string;
}[], priorVisitResult: T | undefined, childResults: Map<ExportableType, T>) => T;
/**
 *  A swagger defined type that should be exported into some namespace.
 * It may also be an inlined type that none-the-less depends on types that
 * were exported.
 *
 * This tracks what other exportable types it depends on, what uses itself,
 * and what its possible names could be.
 */
export declare class ExportableType {
    readonly type: ts.DeclarationStatement | ts.VariableStatement | ts.TypeNode | string;
    readonly titles: string[];
    private dependencies_;
    private dependents_;
    private typeName_?;
    private explicitTypeName_;
    private descriptions;
    private memberDescriptions;
    constructor(title: string, type: ts.DeclarationStatement | ts.VariableStatement | ts.TypeNode | string);
    readonly isLeaf: boolean;
    readonly hasDeclaration: boolean;
    readonly isVirtualAggregate: boolean;
    readonly isInlined: boolean;
    readonly isArray: boolean;
    readonly dependencies: IterableIterator<ExportableType>;
    readonly dependents: IterableIterator<{
        key: string;
        parent: ExportableType;
    }>;
    readonly typeName: string;
    readonly isTypeNameExplicitlySet: boolean;
    dependency(memberName: string): ExportableType | undefined;
    renameType(newName: string, explicit?: boolean): void;
    visit<T>(visitor: TypeVisitor<T>): T;
    collect<T>(visitor: TypeVisitor<T>): Map<ExportableType, T>;
    private visitWithState<T>(visitor, currentKey, path, state);
    private createReferenceType();
    private addDescription(blob, forMember?);
    private updateASTWithJSDoc();
    private addDependency(key, child);
    private buildMaximalReuseGraph();
    private static mergeAllTypes(types);
    private merge(type);
    private updateTypeReference(key);
    private static createInterfaceType(title, members, dependencies);
    private static createTypeLiteral(title, members, dependencies);
    private static astSimpleType(type);
    private static astEnum(schema, title);
    private static astObject(schema, title, isTopLevel);
    private static astArray(schema, title);
    static processDefinition(schemaOrType: string | swagger.Response | swagger.Parameter | swagger.Schema, title: string, isTopLevel?: boolean): ExportableType | ts.TypeNode;
    private static createParameterType(route, root);
    private static createParameterTypeAggregate(spec, root);
    private static createResponseTypeAggregate(spec, root);
    private static createRouteURLMap(spec);
    static buildTypeGraph(spec: esi.API): ExportableType;
}
