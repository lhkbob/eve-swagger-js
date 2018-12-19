import { Search } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter for dealing with a single solar system, currently only
 * supporting fetching simple information and calculating routes between
 * systems.
 */
export interface SolarSystem {
    /**
     * @esi_example esi.solarSystems(id).info()
     *
     * @return Information about the specific solar system
     */
    info(): Promise<Responses['get_universe_systems_system_id']>;
    /**
     * @esi_route get_route_origin_destination [shortest]
     * @esi_example esi.solarSystems(fromId).shortestRoute(toId, ...)
     *
     * @param to Destination solar system id
     * @param avoid Optional list of solar systems to avoid
     * @param connections Optional list of solar systems to pass through
     * @returns Route specified by ordered solar system ids
     */
    shortestRoute(to: number, avoid?: number[], connections?: number[]): Promise<Responses['get_route_origin_destination']>;
    /**
     * @esi_route get_route_origin_destination [secure]
     * @esi_example esi.solarSystems(fromId).secureRoute(toId, ...)
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
     * @returns Route specified by ordered solar system ids
     */
    insecureRoute(to: number, avoid?: number[], connections?: number[]): Promise<Responses['get_route_origin_destination']>;
    /**
     * @returns The solar system id
     */
    id(): Promise<number>;
}
/**
 * An api adapter that provides functions for accessing solar system information
 * via the [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI end points.
 */
export interface SolarSystems {
    /**
     * A Search module instance configured to search over the `'solarsystem'`
     * type.
     *
     * @esi_route get_search [solarsystem]
     * @esi_example esi.solarSystems.search('text')
     */
    search: Search;
    /**
     * Create a new SolarSystem end point targeting the particular system by `id`.
     *
     * @param id The solar system id
     * @returns SolarSystem API wrapper
     */
    (id: number): SolarSystem;
    /**
     * @esi_example esi.solarSystems()
     *
     * @returns All solar system ids in Eve
     */
    (): Promise<Responses['get_universe_systems']>;
    /**
     * @esi_example esi.solarSystems.jumpStats()
     *
     * @returns Jump transit statistics for all solar systems for the last hour
     */
    jumpStats(): Promise<Responses['get_universe_system_jumps']>;
    /**
     * @esi_example esi.solarSystems.killStats()
     *
     * @returns Kill statistics for all solar systems for the last hour
     */
    killStats(): Promise<Responses['get_universe_system_kills']>;
    /**
     * @esi_route post_universe_names [solar_system]
     * @esi_example esi.solarSystems.names()
     *
     * @param ids If no ids are provided, then all names are returned.
     * @return Map from solar system id to name
     */
    names(ids?: number[]): Promise<Map<number, string>>;
}
/**
 * Create a new {@link SolarSystems} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An SolarSystems API instance
 */
export declare function makeSolarSystems(agent: ESIAgent): SolarSystems;
