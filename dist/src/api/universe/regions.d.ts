import { Search } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing various details for a
 * region specified by id, via functions in the
 * [market](https://esi.evetech.net/latest/#/Market) ESI endpoints.
 */
export interface Region {
    /**
     * @esi_example esi.regions(id).info()
     *
     * @returns Information about the region
     */
    info(): Promise<Responses['get_universe_regions_region_id']>;
    /**
     * @esi_example esi.regions(id).history(typeid)
     *
     * @param typeId The type whose market history is fetched
     * @return Price history for the given type in this region
     */
    history(typeId: number): Promise<Responses['get_markets_region_id_history']>;
    /**
     * Get all market orders for the region, possibly paginated. If no page is
     * provided then all pages are fetched and returned as a single list,
     * otherwise the specific page is loaded.
     *
     * @esi_route get_markets_region_id_orders [all]
     * @esi_example esi.regions(id).orders()
     *
     * @param page The page to load, starting at 1, or undefined for all pages
     * @return All market orders, regardless of class
     */
    orders(page?: number): Promise<Responses['get_markets_region_id_orders']>;
    /**
     * Get all buy market orders in the region for the given item type id.
     * Note that this is not paginated, all buy orders for the type are returned.
     *
     * @esi_route get_markets_region_id_orders [buy,typeId]
     * @esi_example esi.regions(id).buyOrdersFor(typeId)
     *
     * @param typeId The item type associated with the buy orders
     * @return Buy orders in this region for the given type
     */
    buyOrdersFor(typeId: number): Promise<Responses['get_markets_region_id_orders']>;
    /**
     * Get all sell market orders in the region for the given item type id.
     * Note that this is not paginated, all buy orders for the type are returned.
     *
     * @esi_route get_markets_region_id_orders [sell,typeId]
     * @esi_example esi.regions(id).sellOrdersFor(typeId)
     *
     * @param typeId The item type associated with the sell orders
     * @return Sell orders in this region for the given type
     */
    sellOrdersFor(typeId: number): Promise<Responses['get_markets_region_id_orders']>;
    /**
     * Get all buy and sell market orders in the region for the given item type
     * id. Note that this is not paginated, all buy orders for the type are
     * returned.
     *
     * @esi_route get_markets_region_id_orders [typeId]
     * @esi_example esi.regions(id).ordersFor(typeId)
     *
     * @param typeId The item type associated with the orders
     * @return Orders in this region for the given type
     */
    ordersFor(typeId: number): Promise<Responses['get_markets_region_id_orders']>;
    /**
     * @returns The region id
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling regions via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI endpoints.
 */
export interface Regions {
    /**
     * Create a new Region end point targeting the particular region by `id`.
     *
     * @param id The region id
     * @returns Region API wrapper for the given id
     */
    (id: number): Region;
    /**
     * @esi_example esi.regions()
     *
     * @returns All region ids
     */
    (): Promise<Responses['get_universe_regions']>;
    /**
     * @esi_route post_universe_names [region]
     * @esi_example esi.regions.names(ids)
     *
     * @param ids If not provided then the names of all regions will be
     *     returned.
     * @returns Map from queried id to returned region name
     */
    names(ids?: number[]): Promise<Map<number, string>>;
    /**
     * A Search module instance configured to search over the `'region'` type.
     *
     * @esi_route get_search [region]
     * @esi_example esi.regions.search('text')
     */
    search: Search;
}
/**
 * Create a new {@link Regions} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Regions API instance
 */
export declare function makeRegions(agent: ESIAgent): Regions;
