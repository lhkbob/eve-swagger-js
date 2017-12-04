import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';
import { Market } from './market';
import * as r from '../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * structure or multiple structures. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all structures.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple structures are being accessed at once.
 */
export interface StructureAPI {
    summary: Responses['get_universe_structures_structure_id'];
    details: esi.corporation.structure.Structure;
    names: string;
}
/**
 * An api adapter for accessing various details of a single structure, specified
 * by a provided id when the api is instantiated. It must be provided with a
 * character id or a corporation id as well. When needed, it will infer the
 * other resource id based on information. For example, if a corp id is needed
 * for an ESI request but only the character id is available, then the
 * corporation of the character is used. If the character id is needed, then the
 * CEO of the corporation will be used.
 */
export declare class Structure extends r.impl.SimpleResource implements r.Async<StructureAPI> {
    private agent;
    private charAndCorp;
    private market_?;
    private details_?;
    constructor(agent: ESIAgent, ssoToken: string, id: number, charID?: number | r.impl.IDProvider, corpID?: number | r.impl.IDProvider);
    readonly market: Market;
    /**
     * @esi_route ~get_corporations_corporation_id_structures
     *
     * @returns More detailed information of the structure, including
     *     vulnerability periods and security
     */
    details(): Promise<esi.corporation.structure.Structure>;
    /**
     * @returns The summary and name of the structure
     */
    summary(): Promise<esi.universe.Structure>;
    /**
     * @esi_route ~get_universe_structures_structure_id
     *
     * @returns The name of the structure
     */
    names(): Promise<string>;
    /**
     * @param newSchedule The schedule specification
     * @returns An empty promise that resolves when the new schedule is saved
     */
    updateSchedule(newSchedule: esi.corporation.structure.VulnerabilitySchedule[]): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of multiple structures,
 * specified by a provided an array, set of ids, or search query.
 */
export declare class MappedStructures extends r.impl.SimpleMappedResource implements r.Mapped<StructureAPI> {
    private charAndCorp;
    private details_;
    constructor(agent: ESIAgent, ssoToken: string, ids: number[] | Set<number> | r.impl.IDSetProvider, charID?: number | r.impl.IDProvider, corpID?: number | r.impl.IDProvider);
    /**
     * @esi_route ~get_corporations_corporation_id_structures
     *
     * @returns More detailed information of the structures, including
     *     vulnerability periods and security, mapped by their id
     */
    details(): Promise<Map<number, esi.corporation.structure.Structure>>;
    /**
     * @returns The summary and name of the structures, mapped by id
     */
    summary(): Promise<Map<number, esi.universe.Structure>>;
    /**
     * @esi_route ~get_universe_structures_structure_id
     *
     * @returns The name of the structures, mapped by id
     */
    names(): Promise<Map<number, string>>;
}
/**
 * An api adapter for accessing various details of all structures owned by
 * a corporation (either specified directly, or the dynamic corporation of
 * a specific character).
 */
export declare class IteratedStructures extends r.impl.SimpleIteratedResource<esi.corporation.structure.Structure> implements r.Iterated<StructureAPI> {
    private charAndCorp;
    constructor(agent: ESIAgent, ssoToken: string, charID?: number | r.impl.IDProvider, corpID?: number | r.impl.IDProvider);
    /**
     * @esi_route get_corporations_corporation_id_structures
     *
     * @returns More detailed information of the corp-owned structures, including
     *     vulnerability periods and security
     */
    details(): AsyncIterableIterator<[number, esi.corporation.structure.Structure]>;
    /**
     * @returns The summary and name of each structure owned by the corp
     */
    summary(): AsyncIterableIterator<[number, esi.universe.Structure]>;
    /**
     * @esi_route ~get_universe_structures_structure_id
     *
     * @returns The name of each structure owned by the corporation
     */
    names(): AsyncIterableIterator<[number, string]>;
}
/**
 * A functional interface for getting APIs for a specific structure, a known
 * set of structure ids, the structures returned by a search query, or every
 * structure of a corporation.
 *
 * All structure queries require an authenticated request, and many are
 * associated with either authenticated character, or that character's
 * corporation. If accessed from the authenticated corporation API where no
 * specific character was provided to the API, the corporation's CEO will be
 * used. Similarly, if no explicit corporation ID was provided then the
 * character's dynamic corporation ID will be used.
 */
export interface Structures {
    /**
     * Create a new structures api targeting every single structure owned by
     * a corporation, or a character's corporation (assuming they have proper
     * roles).
     *
     * @esi_route ids ~get_corporations_corporation_id_structures
     *
     * @returns An IteratedStructures API wrapper
     */
    (): IteratedStructures;
    /**
     * Create a new structure api targeting the particular structure by `id`.
     *
     * @param id The structure id
     * @returns An Structure API wrapper for the given id
     */
    (id: number): Structure;
    /**
     * Create a new structure api targeting the multiple structure ids. If an
     * array is provided, duplicates are removed (although the input array
     * is not modified).
     *
     * @param ids The structure ids
     * @returns A MappedStructures API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedStructures;
    /**
     * Create a new structure api targeting the structures returned from a
     * search given the `query` text. The available structures are determined
     * by the character, or CEO of the corporation.
     *
     * @esi_route ids get_characters_character_id_search [structure]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedStructures API which accesses structures based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedStructures;
}
/**
 * Create a new {@link Structures} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * At least one of `charID` or `corpID` must be defined.
 *
 * @param agent The agent used to access information
 * @param ssoToken The authenticating token
 * @param charID The optional character ID used with certain requests, if not
 *     provided, the CEO of the corporation is used
 * @param corpID The optional corporation ID used with certain requests, if not
 *    provided, the character's corp is used
 * @returns An Mail API instance
 */
export declare function makeStructures(agent: ESIAgent, ssoToken: string, charID?: number | r.impl.IDProvider, corpID?: number | r.impl.IDProvider): Structures;
