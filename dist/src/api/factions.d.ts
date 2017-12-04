import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';
import * as r from '../internal/resource-api';
import { Corporation } from './corporation/corporations';
import { MappedSolarSystems } from './universe/solar-systems';
/**
 * The API specification for all variants that access information about an
 * faction or multiple factions. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all factions.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple factions are being accessed at once.
 *
 * This is an API wrapper over the end points handling factions via functions
 * in the [faction warfare](https://esi.tech.ccp.is/latest/#/Faction_Warfare)
 * and [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface FactionAPI {
    details: esi.universe.Faction;
    stats: esi.factionwarfare.FactionStatistics;
    wars: Set<number>;
    owned: esi.factionwarfare.System[];
    occupied: esi.factionwarfare.System[];
    names: string;
}
/**
 * An api adapter for accessing various details of a single faction, specified
 * by a provided id when the api is instantiated.
 */
export declare class Faction extends r.impl.SimpleResource implements r.Async<FactionAPI> {
    private agent;
    private corp_?;
    private militia_?;
    private owned_?;
    private occupied_?;
    constructor(agent: ESIAgent, id_: number);
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The public info of the faction
     */
    details(): Promise<esi.universe.Faction>;
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The name of the faction
     */
    names(): Promise<string>;
    /**
     * @esi_route ~get_fw_stats
     *
     * @returns The faction warfare statistics for this faction
     */
    stats(): Promise<esi.factionwarfare.FactionStatistics>;
    /**
     * @esi_route ~get_fw_wars
     *
     * @returns The faction ids of factions involved in war with this faction
     */
    wars(): Promise<Set<number>>;
    /**
     * @esi_route ~get_fw_systems
     *
     * @returns The statuses of all systems owned by the faction's militia
     */
    owned(): Promise<esi.factionwarfare.System[]>;
    /**
     * @esi_route ~get_fw_systems
     *
     * @returns The statuses of all systems occupied by the faction's militia
     */
    occupied(): Promise<esi.factionwarfare.System[]>;
    /**
     * @esi_route ids ~get_universe_factions
     *
     * @returns A Corporation API instance linked with the corporation id of the
     *     faction
     */
    readonly corporation: Corporation;
    /**
     * @esi_route ids ~get_universe_factions
     *
     * @returns A Corporation API instance linked with the militia corporation of
     *     the faction
     */
    readonly militia: Corporation;
    /**
     * @esi_route ids ~get_fw_systems [owned]
     *
     * @returns A MappedSolarSystems API dynamically linked with solar system ids
     *     that are owned by the faction's militia
     */
    readonly ownedSystems: MappedSolarSystems;
    /**
     * @esi_route ids ~get_fw_systems [occupied]
     *
     * @returns A MappedSolarSystems API dynamically linked with the solar system
     *     ids that are occupied by the faction's militia
     */
    readonly occupiedSystems: MappedSolarSystems;
}
/**
 * An api adapter for accessing various details of multiple faction, specified
 * by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
export declare class MappedFactions extends r.impl.SimpleMappedResource implements r.Mapped<FactionAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The public info of the factions, mapped by id
     */
    details(): Promise<Map<number, esi.universe.Faction>>;
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns The names of the factions, mapped by id
     */
    names(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_fw_stats
     *
     * @returns The faction warfare statistics for the factions, mapped by id
     */
    stats(): Promise<Map<number, esi.factionwarfare.FactionStatistics>>;
    /**
     * @esi_route ~get_fw_wars
     *
     * @returns The faction ids involved in wars against each faction
     */
    wars(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_fw_systems [owned]
     *
     * @returns The statuses of all systems owned by the faction's militia
     */
    owned(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_fw_systems [occupied]
     *
     * @returns The statuses of all systems occupied by the faction's militia
     */
    occupied(): Promise<Map<any, any>>;
}
/**
 * An api adapter for accessing various details about every faction in the
 * game. Even though a route exists to get all faction ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export declare class IteratedFactions extends r.impl.SimpleIteratedResource<esi.universe.Faction> implements r.Iterated<FactionAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @esi_route get_universe_factions
     *
     * @returns Iterator for details of every faction
     */
    details(): AsyncIterableIterator<[number, esi.universe.Faction]>;
    /**
     * @esi_route ~get_universe_factions
     *
     * @returns Iterator for the names of every faction
     */
    names(): AsyncIterableIterator<[number, string]>;
    /**
     * @esi_route get_fw_stats
     *
     * @returns Iterator over stats of every faction
     */
    stats(): AsyncIterableIterator<[number, esi.factionwarfare.FactionStatistics]>;
    /**
     * @esi_route get_fw_wars
     *
     * @returns Iterator over the wars each faction is involved in
     */
    wars(): AsyncIterableIterator<[number, Set<number>]>;
    /**
     * @esi_route get_fw_systems [owned]
     *
     * @returns Iterator over the systems owned by each faction
     */
    owned(): AsyncIterableIterator<[number, esi.factionwarfare.System[]]>;
    /**
     * @esi_route get_fw_systems [occupied]
     *
     * @returns Iterator over the systems occupied by each faction
     */
    occupied(): AsyncIterableIterator<[number, esi.factionwarfare.System[]]>;
}
/**
 * API wrapper around faction warfare leaderboards, measuring performance
 * over the recent past.
 */
export declare class Leaderboard {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Leaderboard of factions in faction warfare
     */
    forFactions(): Promise<Responses['get_fw_leaderboards']>;
    /**
     * @returns Leaderboard of characters participating in faction warfare
     */
    forCharacters(): Promise<Responses['get_fw_leaderboards_characters']>;
    /**
     * @returns Leaderboard of militia corporations participating in faction
     *     warfare
     */
    forCorporations(): Promise<Responses['get_fw_leaderboards_corporations']>;
}
/**
 * A functional interface for getting APIs for a specific faction, a known
 * set of faction ids, the factions returned by a search query, or every
 * faction in the game.
 *
 * Additionally exposes the faction warfare leaderboard and faction warfare
 * system map.
 */
export interface Factions {
    /**
     * Create a new faction api targeting every single faction in the game.
     *
     * @esi_route ids get_factions
     *
     * @returns An AllFactions API wrapper
     */
    (): IteratedFactions;
    /**
     * Create a new faction api targeting the particular faction by `id`.
     *
     * @param id The faction id
     * @returns An Faction API wrapper for the given id
     */
    (id: number): Faction;
    /**
     * Create a new faction api targeting the multiple faction ids. If an
     * array is provided, duplicates are removed (although the input array
     * is not modified).
     *
     * @param ids The faction ids
     * @returns A MappedFactions API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedFactions;
    /**
     * Create a new faction api targeting the factions returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [faction]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedFactions API which accesses factions based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedFactions;
    /**
     * @returns The raw solar systems status for each faction
     */
    systemStatuses(): Promise<Responses['get_fw_systems']>;
    readonly leaderboard: Leaderboard;
}
/**
 * Create a new factions API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Factions
 */
export declare function makeFactions(agent: ESIAgent): Factions;
