import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { MappedTypes } from './types';
/**
 * The API specification for all variants that access information about an
 * in-game market group or multiple market groups. This interface will not be
 * used directly, but will be filtered through some mapper, such as {@link
    * Async} or {@link Mapped} depending on what types of ids are being
    * accessed. However, this allows for a concise and consistent specification
    * for all variants: single, multiple, and all market groups.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the
 * key's type if multiple market groups are being accessed at once.
 *
 * This is an API wrapper over the end points handling market groups in the
 * [market](https://esi.tech.ccp.is/latest/#/market) ESI endpoints.
 */
export interface MarketGroupAPI {
    details: Responses['get_markets_groups_market_group_id'];
}
/**
 * An api adapter for accessing various details of a single in-game market
 * group, specified by a provided id when the api is instantiated.
 */
export declare class MarketGroup extends r.impl.SimpleResource implements r.Async<MarketGroupAPI> {
    private agent;
    private members_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the market group
     */
    details(): Promise<esi.market.MarketGroup>;
    /**
     * @returns A MappedTypes instance tied to the types defined in the details of
     *    this market group
     */
    readonly members: MappedTypes;
}
/**
 * An api adapter for accessing various details of multiple market group ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedMarketGroups extends r.impl.SimpleMappedResource implements r.Mapped<MarketGroupAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number>);
    /**
     * @returns MarketGroup details mapped by marketGroup id
     */
    details(): Promise<Map<number, esi.market.MarketGroup>>;
}
/**
 * An api adapter for accessing various details about every market group in the
 * game. Even though a route exists to get all group ids at once, due to their
 * quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export declare class IteratedMarketGroups extends r.impl.SimpleIteratedResource<number> implements r.Iterated<MarketGroupAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game market groups
     */
    details(): AsyncIterableIterator<[number, esi.market.MarketGroup]>;
}
/**
 * A functional interface for getting APIs for a specific market group, a
 * known set of market group ids, or every market group in the game.
 */
export interface MarketGroups {
    /**
     * Create a new market group api targeting every single market group in the
     * game.
     *
     * @esi_route ids get_markets_groups
     *
     * @returns An IteratedMarketGroups API wrapper
     */
    (): IteratedMarketGroups;
    /**
     * Create a new market group api targeting the particular market group by
     * `id`.
     *
     * @param id The market group id
     * @returns An MarketGroup API wrapper for the given id
     */
    (id: number): MarketGroup;
    /**
     * Create a new market group api targeting the multiple market group ids. If
     * an array is provided, duplicates are removed (although the input array is
     * not modified).
     *
     * @param ids The market group ids
     * @returns A MappedMarketGroups API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedMarketGroups;
}
/**
 * Create a new MarketGroups instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A MarketGroups instance
 */
export declare function makeMarketGroups(agent: ESIAgent): MarketGroups;
