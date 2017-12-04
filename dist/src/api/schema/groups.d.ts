import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { MappedTypes } from './types';
/**
 * The API specification for all variants that access information about an
 * in-game group or multiple groups. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
 * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all groups.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple groups are being accessed at once.
 *
 * This is an API wrapper over the end points handling groups in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface GroupAPI {
    details: Responses['get_universe_groups_group_id'];
}
/**
 * An api adapter for accessing various details of a single in-game group,
 * specified by a provided id when the api is instantiated.
 */
export declare class Group extends r.impl.SimpleResource implements r.Async<GroupAPI> {
    private agent;
    private members_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the group
     */
    details(): Promise<esi.universe.Group>;
    /**
     * @returns A MappedTypes instance tied to the types defined in the details of
     *    this group
     */
    readonly members: MappedTypes;
}
/**
 * An api adapter for accessing various details of multiple group ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedGroups extends r.impl.SimpleMappedResource implements r.Mapped<GroupAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Group details mapped by group id
     */
    details(): Promise<Map<number, esi.universe.Group>>;
}
/**
 * An api adapter for accessing various details about every group in the game.
 * Even though a route exists to get all group ids at once, due to their
 * quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export declare class IteratedGroups extends r.impl.SimpleIteratedResource<number> implements r.Iterated<GroupAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game groups
     */
    details(): AsyncIterableIterator<[number, esi.universe.Group]>;
}
/**
 * A functional interface for getting APIs for a specific group, a
 * known set of group ids, or every group in the game.
 */
export interface Groups {
    /**
     * Create a new group api targeting every single group in the game.
     *
     * @esi_route ids get_universe_groups
     *
     * @returns An IteratedGroups API wrapper
     */
    (): IteratedGroups;
    /**
     * Create a new group api targeting the particular group by `id`.
     *
     * @param id The group id
     * @returns An Group API wrapper for the given id
     */
    (id: number): Group;
    /**
     * Create a new group api targeting the multiple group ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The group ids
     * @returns A MappedGroups API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedGroups;
}
/**
 * Create a new Groups instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Groups instance
 */
export declare function makeGroups(agent: ESIAgent): Groups;
