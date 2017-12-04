import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { MappedConstellations } from './constellations';
import { Market, MarketHistory } from '../market';
/**
 * The API specification for all variants that access information about an
 * region or multiple regions. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what regions of ids are being accessed. However, this allows for
 * a concise and consistent specification for all variants: single, multiple,
 * and all regions.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's region, or a collection related to
 * the key's region if multiple regions are being accessed at once.
 *
 * This is an API wrapper over the end points handling regions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface RegionAPI {
    details: Responses['get_universe_regions_region_id'];
    names: string;
}
/**
 * An api adapter for accessing various details of a single in-game region,
 * specified by a provided id when the api is instantiated.
 */
export declare class Region extends r.impl.SimpleResource implements r.Async<RegionAPI> {
    private agent;
    private constellations_;
    private market_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns A MappedConstellations instance tied to the constellations
     *    referenced by the details of this region
     */
    readonly constellations: MappedConstellations;
    /**
     * @esi_route orders get_markets_region_id_orders [all]
     * @esi_route buyOrdersFor get_markets_region_id_orders [type, buy]
     * @esi_route sellOrdersFor get_markets_region_id_orders [type, sell]
     * @esi_route ordersFor get_markets_region_id_orders [type]
     * @esi_route types get_markets_region_id_types
     * @esi_route history get_markets_region_id_history
     *
     * @returns An API for accessing the region's market
     */
    readonly market: Market & MarketHistory;
    /**
     * @returns Information about the region
     */
    details(): Promise<esi.universe.Region>;
    /**
     * @esi_route ~get_universe_regions_region_id
     *
     * @returns The name of the region
     */
    names(): Promise<string>;
}
/**
 * An api adapter for accessing various details of multiple region ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedRegions extends r.impl.SimpleMappedResource implements r.Mapped<RegionAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Region details mapped by region id
     */
    details(): Promise<Map<number, esi.universe.Region>>;
    /**
     * @esi_route post_universe_names [region]
     *
     * @returns The names for each of the mapped regions
     */
    names(): Promise<Map<number, string>>;
}
/**
 * An api adapter for accessing various details about every region in
 * the game.
 */
export declare class IteratedRegions extends r.impl.SimpleIteratedResource<number> implements r.Iterated<RegionAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game regions
     */
    details(): AsyncIterableIterator<[number, esi.universe.Region]>;
    /**
     * @esi_route post_universe_names [region]
     *
     * @returns Iterator over region names
     */
    names(): AsyncIterableIterator<[number, string]>;
}
/**
 * A functional interface for getting APIs for a specific region, a known
 * set of region ids, or every region in the game.
 */
export interface Regions {
    /**
     * Create a new region api targeting every single region in the game.
     *
     * @esi_route ids get_universe_regions
     *
     * @returns An IteratedRegions API wrapper
     */
    (): IteratedRegions;
    /**
     * Create a new region api targeting the particular region by `id`.
     *
     * @param id The region id
     * @returns An Region API wrapper for the given id
     */
    (id: number): Region;
    /**
     * Create a new region api targeting the multiple region ids. If an array is
     * provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The region ids
     * @returns A MappedRegions API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedRegions;
    /**
     * Create a new region api targeting the regions returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [region]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedRegions API which accesses regions based on
     *    the dynamic search results
     */
    (query: string, strict?: boolean): MappedRegions;
}
/**
 * Create a new Regions instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Regions instance
 */
export declare function makeRegions(agent: ESIAgent): Regions;
