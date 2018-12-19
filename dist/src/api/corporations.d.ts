import { Search } from '../internal/search';
import { ESIAgent } from '../internal/esi-agent';
import { Responses } from '../../gen/esi';
/**
 * An api adapter that provides functions for accessing various details for a
 * corporation specified by id via functions in the
 * [corporation](https://esi.evetech.net/latest/#/Corporation) ESI endpoints.
 * This only describes the non-authenticated corporation end points.
 */
export interface Corporation {
    /**
     * @esi_example esi.corporations(id).info()
     * @returns The public info about the corporation
     */
    info(): Promise<Responses['get_corporations_corporation_id']>;
    /**
     * @esi_example esi.corporations(id).history()
     * @returns The history of alliances the corporation has belonged to
     */
    history(): Promise<Responses['get_corporations_corporation_id_alliancehistory']>;
    /**
     * @esi_example esi.corporations(id).icon()
     * @returns URL info for accessing the corporation icon images
     */
    icon(): Promise<Responses['get_corporations_corporation_id_icons']>;
    /**
     * @esi_example esi.corporations(id).loyaltyOffers()
     * @returns The loyalty store offers available from the corporation (only
     * meaningful for NPC corporations)
     */
    loyaltyOffers(): Promise<Responses['get_loyalty_stores_corporation_id_offers']>;
    /**
     * @returns The id of this corporation
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling multiple corporations  via
 * functions in the [corporation](https://esi.evetech.net/latest/#/Corporation)
 * ESI endpoints.
 */
export interface Corporations {
    /**
     * Create a new Corporation end point targeting the particular corporation by
     * `id`.
     *
     * @param id The corporation id
     * @returns A Corporation API wrapper for the given id
     */
    (id: number): Corporation;
    /**
     * A Search module instance configured to search over the `'corporation'`
     * type.
     *
     * @esi_route get_search [corporation]
     * @esi_example esi.corporations.search('text')
     */
    search: Search;
    /**
     * @esi_example esi.corporations.npc()
     *
     * @returns The corporation ids for all NPC corporations in Eve
     */
    npc(): Promise<Responses['get_corporations_npccorps']>;
    /**
     * @esi_route get_corporations_names
     * @esi_route post_universe_names [corporation]
     * @esi_example esi.corporations.names(ids)
     *
     * @param ids The ids to look up
     * @returns  Map from queried id to returned corporation name
     */
    names(ids: number[]): Promise<Map<number, string>>;
}
/**
 * Create a new {@link Corporations} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Corporations API instance
 */
export declare function makeCorporations(agent: ESIAgent): Corporations;
/**
 * Create a new {@link Corporation} instance that uses the given `agent` to make
 * its HTTP requests to the ESI interface for the corporation `id`.
 *
 * @param agent The agent making requests
 * @param id The corporation id
 * @returns  A Corporation API instance, when the whole Corporations API is
 *    not needed
 */
export declare function makeCorporation(agent: ESIAgent, id: number): Corporation;
