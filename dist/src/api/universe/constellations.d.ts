import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { MappedSolarSystems } from './solar-systems';
/**
 * The API specification for all variants that access information about an
 * constellation or multiple constellations. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what constellations of ids are being accessed.
 * However, this allows for a concise and consistent specification for all
 * variants: single, multiple, and all constellations.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's constellation, or a collection
 * related to the key's constellation if multiple constellations are being
 * accessed at once.
 *
 * This is an API wrapper over the end points handling constellations in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface ConstellationAPI {
    details: Responses['get_universe_constellations_constellation_id'];
    names: string;
}
/**
 * An api adapter for accessing various details of a single in-game
 * constellation, specified by a provided id when the api is instantiated.
 */
export declare class Constellation extends r.impl.SimpleResource implements r.Async<ConstellationAPI> {
    private agent;
    private systems_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns A MappedSolarSystems instance tied to the solar systems referenced
     *    by the details of this constellation
     */
    readonly solarSystems: MappedSolarSystems;
    /**
     * @returns Information about the constellation
     */
    details(): Promise<esi.universe.Constellation>;
    /**
     * @esi_route ~get_universe_constellations_constellation_id
     *
     * @returns The name of the constellation
     */
    names(): Promise<string>;
}
/**
 * An api adapter for accessing various details of multiple constellation ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedConstellations extends r.impl.SimpleMappedResource implements r.Mapped<ConstellationAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Constellation details mapped by constellation id
     */
    details(): Promise<Map<number, esi.universe.Constellation>>;
    /**
     * @esi_route post_universe_names [constellation]
     *
     * @returns The names for each of the mapped constellations
     */
    names(): Promise<Map<number, string>>;
}
/**
 * An api adapter for accessing various details about every constellation in
 * the game.
 */
export declare class IteratedConstellations extends r.impl.SimpleIteratedResource<number> implements r.Iterated<ConstellationAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game constellations
     */
    details(): AsyncIterableIterator<[number, esi.universe.Constellation]>;
    /**
     * @esi_route post_universe_names [constellation]
     *
     * @returns Iterator over constellation names
     */
    names(): AsyncIterableIterator<[number, string]>;
}
/**
 * A functional interface for getting APIs for a specific constellation, a known
 * set of constellation ids, or every constellation in the game.
 */
export interface Constellations {
    /**
     * Create a new constellation api targeting every single constellation in the
     * game.
     *
     * @esi_route ids get_universe_constellations
     *
     * @returns An IteratedConstellations API wrapper
     */
    (): IteratedConstellations;
    /**
     * Create a new constellation api targeting the particular constellation by
     * `id`.
     *
     * @param id The constellation id
     * @returns An Constellation API wrapper for the given id
     */
    (id: number): Constellation;
    /**
     * Create a new constellation api targeting the multiple constellation ids. If
     * an array is provided, duplicates are removed (although the input array is
     * not modified).
     *
     * @param ids The constellation ids
     * @returns A MappedConstellations API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedConstellations;
    /**
     * Create a new constellation api targeting the constellations returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [constellation]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedConstellations API which accesses constellations based on
     *    the dynamic search results
     */
    (query: string, strict?: boolean): MappedConstellations;
}
/**
 * Create a new Constellations instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Constellations instance
 */
export declare function makeConstellations(agent: ESIAgent): Constellations;
