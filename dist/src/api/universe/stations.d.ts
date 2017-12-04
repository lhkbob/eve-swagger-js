import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about an
 * planetary interaction station or multiple stations. This interface
 * will not be used directly, but will be filtered through some mapper, such as
 * {@link Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification
 * for
 * all variants: single, multiple, and all tasks.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the
 * key's type if multiple stations are being accessed at once.
 *
 * This is an API wrapper over the end points handling stations in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface StationAPI {
    details: Responses['get_universe_stations_station_id'];
    taxes: number;
    industry: esi.industry.Facility;
    names: string;
}
/**
 * An api adapter for accessing various details of a single station,
 * specified by a provided id when the api is instantiated.
 */
export declare class Station extends r.impl.SimpleResource implements r.Async<StationAPI> {
    private agent;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the station
     */
    details(): Promise<esi.universe.Station>;
    /**
     * @esi_route ~get_industry_facilities
     *
     * @returns The taxes imposed on the station, or 0
     */
    taxes(): Promise<number>;
    /**
     * @esi_route ~get_industry_facilities
     *
     * @returns The industry information for the station
     */
    industry(): Promise<esi.industry.Facility>;
    /**
     * @esi_route ~get_universe_stations_station_id
     *
     * @returns The name of the station
     */
    names(): Promise<string>;
}
/**
 * An api adapter for accessing various details of multiple station ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedStations extends r.impl.SimpleMappedResource implements r.Mapped<StationAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Station details mapped by station id
     */
    details(): Promise<Map<number, esi.universe.Station>>;
    /**
     * @esi_route ~get_sovereignty_map
     *
     * @returns Sovereignty information for the specified stations
     */
    industry(): Promise<Map<number, esi.industry.Facility>>;
    /**
     * @esi_route ~get_industry_facilities
     *
     * @returns Taxes for the specified stations
     */
    taxes(): Promise<Map<any, any>>;
    /**
     * @esi_route post_universe_names [station]
     *
     * @returns The specified stations' names
     */
    names(): Promise<Map<number, string>>;
}
/**
 * An api adapter for accessing various details about every station in the
 * universe.
 */
export declare class IteratedStations extends r.impl.SimpleIteratedResource<esi.industry.Facility> implements r.Iterated<StationAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns The details of every station in the universe
     */
    details(): AsyncIterableIterator<[number, esi.universe.Station]>;
    /**
     * @esi_route get_industry_facilities
     *
     * @returns Industry facility information for all stations
     */
    industry(): AsyncIterableIterator<[number, esi.industry.Facility]>;
    /**
     * @esi_route get_industry_facilities
     *
     * @returns Taxes for all stations
     */
    taxes(): AsyncIterableIterator<[number, number]>;
    /**
     * @esi_route post_universe_names [station]
     *
     * @returns Names of all stations in the universe
     */
    names(): AsyncIterableIterator<[number, string]>;
}
/**
 * A functional interface for getting APIs for a specific station or a
 * known set of station ids.
 */
export interface Stations {
    /**
     * Create a new station api targeting every single facility in the game,
     * as reported by the industry facilities ESI route.
     *
     * @esi_route industry get_industry_facilities
     *
     * @returns An IteratedStations API wrapper
     */
    facilities(): IteratedStations;
    /**
     * Create a new station api targeting the particular station by `id`.
     *
     * @param id The station id
     * @returns An Station API wrapper for the given id
     */
    (id: number): Station;
    /**
     * Create a new station api targeting the multiple solarSystem ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The station ids
     * @returns A MappedStations API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedStations;
    /**
     * Create a new station api targeting the stations returned from a
     * search given the `query` text.
     *
     * @esi_route ids get_search [station]
     *
     * @param query The search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns A MappedStations API which accesses stations based on the
     *    dynamic search results
     */
    (query: string, strict?: boolean): MappedStations;
}
/**
 * Create a new Stations instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Stations instance
 */
export declare function makeStations(agent: ESIAgent): Stations;
