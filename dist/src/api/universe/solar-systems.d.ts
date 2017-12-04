import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { Star } from './stars';
import { MappedStargates } from './stargates';
import { MappedPlanets } from './planets';
import { MappedStations } from './stations';
/**
 * The API specification for all variants that access information about an solar
 * system or multiple solar systems. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
    * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all solar systems.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple solar systems are being accessed at once.
 *
 * This is an API wrapper over the end points handling solar systems in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface SolarSystemAPI {
    details: Responses['get_universe_systems_system_id'];
    jumpStats: number;
    killStats: esi.universe.SystemKills;
    sovereignty: esi.sovereignty.Map;
    costIndices: esi.industry.CostIndex[];
    names: string;
}
/**
 * An api adapter for accessing various details of a single solar system,
 * specified by a provided id when the api is instantiated.
 */
export declare class SolarSystem extends r.impl.SimpleResource implements r.Async<SolarSystemAPI> {
    private agent;
    private star_;
    private gates_;
    private planets_;
    private stations_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns A MappedStations instance tied to the stations referenced in the
     *    details of this solar system
     */
    readonly stations: MappedStations;
    /**
     * @returns A Star API interface tied to the star referenced in the details
     *    of this solar system
     */
    readonly star: Star;
    /**
     * @returns A MappedStargates instance tied to the stargates referenced in
     *    the details of this solar system
     */
    readonly stargates: MappedStargates;
    /**
     * @returns A MappedPlanets instance tied to the planets referenced in the
     *    details of this solar system
     */
    readonly planets: MappedPlanets;
    /**
     * @esi_route get_route_origin_destination [shortest]
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     * @returns Route specified by ordered solar system ids
     */
    shortestRoute(to: number, avoid?: number[], connections?: number[]): Promise<Responses['get_route_origin_destination']>;
    /**
     * @esi_route get_route_origin_destination [secure]
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     * @returns Route specified by ordered solar system ids
     */
    secureRoute(to: number, avoid?: number[], connections?: number[]): Promise<Responses['get_route_origin_destination']>;
    /**
     * @esi_route get_route_origin_destination [insecure]
     * @esi_example esi.solarSystems(fromId).insecureRoute(toId, ...)
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     */
    insecureRoute(to: number, avoid?: number[], connections?: number[]): Promise<Responses['get_route_origin_destination']>;
    private getRoute(type, to, avoid?, connections?);
    /**
     * @returns Information about the solar system
     */
    details(): Promise<esi.universe.System>;
    /**
     * @esi_route ~get_universe_system_jumps
     *
     * @returns The number of recent jumps through the system
     */
    jumpStats(): Promise<number>;
    /**
     * @esi_route ~get_universe_system_kills
     *
     * @returns The number of recent kills through the system
     */
    killStats(): Promise<esi.universe.SystemKills>;
    /**
     * @esi_route ~get_sovereignty_map
     *
     * @returns Sovereignty control information for the system
     */
    sovereignty(): Promise<esi.sovereignty.Map>;
    /**
     * @esi_route ~get_industry_systems
     *
     * @returns Industry cost indices for the system
     */
    costIndices(): Promise<esi.industry.CostIndex[]>;
    /**
     * @esi_route ~get_universe_systems_system_id
     *
     * @returns The name of the solar system
     */
    names(): Promise<string>;
}
/**
 * An api adapter for accessing various details of multiple solar system ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedSolarSystems extends r.impl.SimpleMappedResource implements r.Mapped<SolarSystemAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns SolarSystem details mapped by solar system id
     */
    details(): Promise<Map<number, esi.universe.System>>;
    /**
     * @esi_route ~get_universe_system_jumps
     *
     * @returns Jump stats for the specified solar systems
     */
    jumpStats(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_universe_system_kills
     *
     * @returns Kill statistics for the specified solar systems
     */
    killStats(): Promise<Map<number, esi.universe.SystemKills>>;
    /**
     * @esi_route ~get_sovereignty_map
     *
     * @returns Sovereignty information for the specified solar systems
     */
    sovereignty(): Promise<Map<number, esi.sovereignty.Map>>;
    /**
     * @esi_route ~get_industry_systems
     *
     * @returns Cost indices for the specified solar systems
     */
    costIndices(): Promise<Map<any, any>>;
    /**
     * @esi_route post_universe_names [system]
     *
     * @returns The specified solar systems' names
     */
    names(): Promise<Map<number, string>>;
}
/**
 * An api adapter for accessing various details about every solar system in the
 * universe.
 */
export declare class IteratedSolarSystems extends r.impl.SimpleIteratedResource<number> implements r.Iterated<SolarSystemAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns The details of every solar system in the universe
     */
    details(): AsyncIterableIterator<[number, esi.universe.System]>;
    /**
     * @esi_route get_universe_system_jumps
     *
     * @returns Jump statistics for every solar system in the universe, besides
     *    worm hole systems
     */
    jumpStats(): AsyncIterableIterator<[number, number]>;
    /**
     * @esi_route get_universe_system_kills
     *
     * @returns Kill statistics for every solar system in the universe, besides
     *    worm hole systems
     */
    killStats(): AsyncIterableIterator<[number, esi.universe.SystemKills]>;
    /**
     * @esi_route get_sovereignty_map
     *
     * @returns Sovereignty information for all solar systems
     */
    sovereignty(): AsyncIterableIterator<[number, esi.sovereignty.Map]>;
    /**
     * @esi_route get_industry_systems
     *
     * @returns Industry cost indices for all solar systems
     */
    costIndices(): AsyncIterableIterator<[number, esi.industry.CostIndex[]]>;
    /**
     * @esi_route post_universe_names [system]
     *
     * @returns Names of all solar systems in the universe
     */
    names(): AsyncIterableIterator<[number, string]>;
}
/**
 * A functional interface for getting APIs for a specific solar system or a
 * known set of solar system ids.
 */
export interface SolarSystems {
    /**
     * Create a new solar system api targeting every single system in the game.
     *
     * @esi_route ids get_universe_systems
     *
     * @returns An IteratedSolarSystems API wrapper
     */
    (): IteratedSolarSystems;
    /**
     * Create a new solar system api targeting the particular solar system by
     * `id`.
     *
     * @param id The solar system id
     * @returns An SolarSystem API wrapper for the given id
     */
    (id: number): SolarSystem;
    /**
     * Create a new solar system api targeting the multiple solar system ids. If
     * an array is provided, duplicates are removed (although the input array is
     * not modified).
     *
     * @param ids The solar system ids
     * @returns A MappedSolarSystems API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedSolarSystems;
    /**
     * Create a new solar system api targeting the systems returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [system]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedSolarSystems API which accesses systems based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedSolarSystems;
}
/**
 * Create a new SolarSystems instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A SolarSystems instance
 */
export declare function makeSolarSystems(agent: ESIAgent): SolarSystems;
