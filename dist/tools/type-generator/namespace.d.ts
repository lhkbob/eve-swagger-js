import { API, Route } from '../esi-api';
import { ExportableType } from './exportable-type';
export declare class Namespace {
    readonly name: string;
    static readonly root: Namespace;
    log: string[];
    members: ExportableType[];
    private children_;
    private parent_;
    private constructor();
    readonly declarationCount: number;
    readonly parent: Namespace | undefined;
    readonly children: Namespace[];
    readonly fullName: string;
    readonly depth: number;
    readonly childCount: number;
    readonly leaf: boolean;
    child(name: string): Namespace | undefined;
    sortMembers(): void;
    ensure(name: string): Namespace;
    join(other: Namespace): Namespace;
    /**
     * Child namespaces with fewer than minTypes will be collapsed into parent. If
     * all child (and descendent) namespaces have fewer than minSiblings sibling
     * namespaces then they will be collapsed into this node. This filter is
     * checked after other child namespaces may have been collapsed due to
     * minTypes. Both filters are applied after each child has reduced its own
     * children.
     *
     * @param minTypes
     * @param minSiblings
     */
    reduce(minTypes?: number, minSiblings?: number): void;
    static parse(namespace: string): Namespace;
    static forRoute(route: Route): [Namespace, boolean];
    static assign(spec: API, root: ExportableType): void;
}
