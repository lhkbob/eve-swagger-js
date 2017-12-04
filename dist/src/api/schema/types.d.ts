import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about an
 * in-game type or multiple types. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all types.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple types are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI
 * endpoints.
 */
export interface TypeAPI {
    details: Responses['get_universe_types_type_id'];
    prices: esi.market.Price;
    names: string;
}
/**
 * An api adapter for accessing various details of a single in-game type,
 * specified by a provided id when the api is instantiated.
 */
export declare class Type extends r.impl.SimpleResource implements r.Async<TypeAPI> {
    private agent;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the type
     */
    details(): Promise<esi.universe.Type>;
    /**
     * @esi_route ~get_markets_prices
     *
     * @returns Price data for the type
     */
    prices(): Promise<esi.market.Price>;
    /**
     * @esi_route ~get_universe_types_type_id
     *
     * @returns The name of the type
     */
    names(): Promise<string>;
}
/**
 * An api adapter for accessing various details of multiple type ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedTypes extends r.impl.SimpleMappedResource implements r.Mapped<TypeAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Type details mapped by type id
     */
    details(): Promise<Map<number, esi.universe.Type>>;
    /**
     * @esi_route ~get_markets_prices
     *
     * @returns Price data for each of the mapped types
     */
    prices(): Promise<Map<number, esi.market.Price>>;
    /**
     * @esi_route post_universe_names [type]
     *
     * @returns The names for each of the mapped types
     */
    names(): Promise<Map<number, string>>;
}
/**
 * An api adapter for accessing various details about every type in the game.
 */
export declare class IteratedTypes extends r.impl.SimpleIteratedResource<number> implements r.Iterated<TypeAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game types
     */
    details(): AsyncIterableIterator<[number, esi.universe.Type]>;
    /**
     * @esi_route get_markets_prices
     *
     * @returns An iterator over every price-able item type
     */
    prices(): AsyncIterableIterator<[number, esi.market.Price]>;
    /**
     * @esi_route post_universe_names [type]
     *
     * @returns Iterator over type names
     */
    names(): AsyncIterableIterator<[number, string]>;
}
/**
 * A functional interface for getting APIs for a specific type, a
 * known set of type ids, or every type in the game.
 */
export interface Types {
    /**
     * Create a new type api targeting every single type in the game.
     *
     * @esi_route ids get_universe_types
     *
     * @returns An IteratedTypes API wrapper
     */
    (): IteratedTypes;
    /**
     * Create a new type api targeting the particular type by `id`.
     *
     * @param id The type id
     * @returns An Type API wrapper for the given id
     */
    (id: number): Type;
    /**
     * Create a new type api targeting the multiple type ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The type ids
     * @returns A MappedTypes API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedTypes;
    /**
     * Create a new type api targeting the types returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [type]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedTypes API which accesses types based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedTypes;
}
/**
 * Create a new Types instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Types instance
 */
export declare function makeTypes(agent: ESIAgent): Types;
