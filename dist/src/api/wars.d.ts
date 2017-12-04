import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';
import { IteratedKillmails } from './killmails';
import * as r from '../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * war or multiple wars. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all wars.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple wars are being accessed at once.
 *
 * This is an API adapter that provides functions for accessing wars and their
 * kills, via functions in the [wars](https://esi.tech.ccp.is/latest/#/Wars) ESI
 * endpoints.
 */
export interface WarAPI {
    details: Responses['get_wars_war_id'];
}
/**
 * An api adapter for accessing various details of a single war, specified
 * by a provided id when the api is instantiated.
 */
export declare class War extends r.impl.SimpleResource implements r.Async<WarAPI> {
    private agent;
    private kills_?;
    constructor(agent: ESIAgent, id: number);
    /**
     * @return The details of the specific war
     */
    details(): Promise<esi.War>;
    /**
     * Get all of the kills within the war as an iterated API.
     *
     * @esi_route links get_wars_war_id_killmails
     *
     * @returns An AllKillmails API instance associated with this war
     */
    readonly kills: IteratedKillmails;
}
/**
 * An api adapter for accessing various details of multiple wars, specified by a
 * provided an array or set of ids.
 */
export declare class MappedWars extends r.impl.SimpleMappedResource implements r.Mapped<WarAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number>);
    /**
     * @returns The details for the set of wars
     */
    details(): Promise<Map<number, esi.War>>;
}
/**
 * An api adapter for accessing various details about every war in the game. The
 * functions are exposed as asynchronous iterators. There are potentially many
 * wars, so it is recommended to have a specific termination criteria like
 * amount received, date, or maximum id.
 */
export declare class IteratedWars extends r.impl.SimpleIteratedResource<number> implements r.Iterated<WarAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterated details of each war, ordered from highest to lowest id
     */
    details(): AsyncIterableIterator<[number, esi.War]>;
}
/**
 * A functional interface for getting APIs for a specific war, a known set of
 * war ids, or every war in the game.
 */
export interface Wars {
    /**
     * Create a new war api targeting every single war in the game.
     *
     * @esi_route ids get_wars
     *
     * @returns An IteratedWars API wrapper
     */
    (): IteratedWars;
    /**
     * Create a new War end point targeting the particular war by `id`.
     *
     * @param id The war id
     * @returns A War API wrapper for the given war
     */
    (id: number): War;
    /**
     * Create a new MappedWars api targeting the multiple wars ids. If an
     * array is provided, duplicates are removed (although the input array
     * is not modified).
     *
     * @param ids The war ids
     * @returns A MappedWars API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedWars;
}
/**
 * Create a new Wars API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Wars
 */
export declare function makeWars(agent: ESIAgent): Wars;
