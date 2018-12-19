import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../../gen/esi';
/**
 * An api adapter that provides functions for accessing various details for an
 * war specified by id, via functions in the
 * [wars](https://esi.evetech.net/latest/#/Wars) ESI endpoints.
 */
export interface War {
    /**
     * @esi_route get_wars_war_id
     * @esi_example esi.wars(1).info()
     *
     * @return {Promise.<Object>} A Promise that resolves to the response of
     *   the request
     */
    info(): Promise<Responses['get_wars_war_id']>;
    /**
     * Get the kill details for the war's {@link War#killmails
     * killmails} and then uses {@link Killmail#get} to map the details.
     * The request resolves to an array, each containing a killmail detail.
     *
     * @esi_route get_wars_war_id_killmails
     * @esi_example esi.wars(id).kills()
     *
     * @param page Optional; the page of killmails to fetch, starting
     *     with page 1. If not provided then all kills are returned.
     * @returns {Promise.<Array.<Object>>}
     */
    kills(page?: number): Promise<esi.killmail.Killmail[]>;
    /**
     * @esi_example esi.wars(id).killmails()
     *
     * @param page If undefined, then all pages are fetched and concatenated
     *     together, otherwise the specific page
     * @returns A page of killmail links from the war
     */
    killmails(page?: number): Promise<Responses['get_wars_war_id_killmails']>;
    /**
     * @returns The war's id
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling multiple wars via functions in
 * the [wars](https://esi.evetech.net/latest/#/Wars) ESI endpoints.
 */
export interface Wars {
    /**
     * Get the most recent wars. This is equivalent to calling {@link #recent()}
     * without any max ID.
     *
     * @esi_example esi.wars()
     *
     * @return An array of war IDs ordered chronologically from newest to oldest
     */
    (): Promise<Responses['get_wars']>;
    /**
     * Create a new War end point targeting the particular war by `id`.
     *
     * @param id The war id
     * @returns A War API wrapper for the given war
     */
    (id: number): War;
    /**
     * Note that due to the large number of wars in Eve, and its unbounded
     * nature, there is no utility function provided to fetch all war IDs.
     *
     * @esi_example esi.wars.recent()
     *
     * @param maxId If not provided, the newest wars are returned
     * @return An array of war IDs ordered chronologically from newest to oldest
     */
    recent(maxId?: number): Promise<Responses['get_wars']>;
}
/**
 * Create a new {@link Wars} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Wars API instance
 */
export declare function makeWars(agent: ESIAgent): Wars;
