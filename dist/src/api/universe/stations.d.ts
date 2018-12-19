import { Search } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter for dealing with a single station, currently only supporting
 * fetching simple information.
 */
export interface Station {
    /**
     * @esi_example esi.stations(id).info()
     *
     * @return Public information about the given station
     */
    info(): Promise<Responses['get_universe_stations_station_id']>;
    /**
     * @returns The id of the station
     */
    id(): Promise<number>;
}
/**
 * An api adapter that provides functions for accessing station information via
 * the [universe](https://esi.evetech.net/latest/#/Universe) and
 * [search](https://esi.evetech.net/latest/#/Search) ESI end points.
 */
export interface Stations {
    /**
     * Create a new Station end point targeting the particular system by `id`.
     *
     * @param id The station id
     * @returns A Station API wrapper
     */
    (id: number): Station;
    /**
     * A Search module instance configured to search over the `'station'`
     * type.
     *
     * @esi_route get_search [station]
     * @esi_example esi.stations.search('text')
     */
    search: Search;
    /**
     * @esi_route post_universe_names [station]
     * @esi_example esi.stations.names(ids)
     *
     * @param ids The list of station ids to resolve to names
     * @return A Map from station id to station name
     */
    names(ids: number[]): Promise<Map<number, string>>;
}
/**
 * Create a new {@link Stations} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Stations API instance
 */
export declare function makeStations(agent: ESIAgent): Stations;
