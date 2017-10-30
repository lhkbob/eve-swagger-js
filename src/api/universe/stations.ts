import { makeDefaultSearch } from '../../internal/search';
import { getIteratedNames, getNames } from '../../internal/names';
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
export class Station extends r.impl.SimpleResource implements r.Async<StationAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the station
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_industry_facilities
   *
   * @returns The taxes imposed on the station, or 0
   */
  taxes() {
    return this.industry().then(result => result.tax || 0);
  }

  /**
   * @esi_route ~get_industry_facilities
   *
   * @returns The industry information for the station
   */
  industry() {
    return getFacilities(this.agent).then(all => r.impl.filterArray(all, this.id_, e => e.facility_id));
  }

  /**
   * @esi_route ~get_universe_stations_station_id
   *
   * @returns The name of the station
   */
  names() {
    return this.details().then(result => result.name);
  }
}

/**
 * An api adapter for accessing various details of multiple station ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedStations extends r.impl.SimpleMappedResource implements r.Mapped<StationAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Station details mapped by station id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route ~get_sovereignty_map
   *
   * @returns Sovereignty information for the specified stations
   */
  industry() {
    return this.arrayIDs().then(ids => {
      return getFacilities(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, e => e.facility_id));
    });
  }

  /**
   * @esi_route ~get_industry_facilities
   *
   * @returns Taxes for the specified stations
   */
  taxes() {
    return this.arrayIDs().then(ids => {
      return getFacilities(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, e => e.facility_id))
      .then(objMap => {
        let aMap = new Map();
        for (let [k, v] of objMap.entries()) {
          aMap.set(k, v.tax || 0);
        }
        return aMap;
      });
    });
  }

  /**
   * @esi_route post_universe_names [station]
   *
   * @returns The specified stations' names
   */
  names() {
    return this.arrayIDs()
    .then(ids => getNames(this.agent, esi.universe.NameCategory.STATION,
        ids));
  }
}

/**
 * An api adapter for accessing various details about every station in the
 * universe.
 */
export class AllStations extends r.impl.SimpleIteratedResource<esi.industry.Facility> implements r.Iterated<StationAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(() => agent.request('get_industry_facilities', undefined)), e => e.facility_id);
  }

  /**
   * @returns The details of every station in the universe
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route get_industry_facilities
   *
   * @returns Industry facility information for all stations
   */
  industry() {
    return this.getPaginatedResource();
  }

  /**
   * @esi_route get_industry_facilities
   *
   * @returns Taxes for all stations
   */
  async * taxes() {
    for await (let station of this.getPaginatedResource()) {
      yield <[number, number]> [station[0], station[1].tax || 0];
    }
  }

  /**
   * @esi_route post_universe_names [station]
   *
   * @returns Names of all stations in the universe
   */
  names() {
    return getIteratedNames(this.agent, esi.universe.NameCategory.STATION,
        this.ids());
  }
}

/**
 * A functional interface for getting APIs for a specific station or a
 * known set of station ids.
 */
export interface StationAPIFactory {
  /**
   * Create a new station api targeting every single station in the game,
   * as reported by the industry facilities ESI route.
   *
   * @returns An AllStations API wrapper
   */
  (): AllStations;

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
 * Create a new StationAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A StationAPIFactory instance
 */
export function makeStationAPIFactory(agent: ESIAgent): StationAPIFactory {
  const stationSearch = makeDefaultSearch(agent, esi.SearchCategory.STATION);

  return <StationAPIFactory> function (ids: number | number[] | Set<number> | string | undefined,
      strict: boolean = false) {
    if (ids === undefined) {
      // No id, so all stations
      return new AllStations(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Station(agent, ids);
    } else if (typeof ids === 'string') {
      // Search query, so mapped API with dynamic ids
      return new MappedStations(agent, () => stationSearch(ids, strict));
    } else {
      // Set or array, so mapped API with fixed ids
      return new MappedStations(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_stations_station_id',
      { path: { station_id: id } });
}

function getFacilities(agent: ESIAgent) {
  return agent.request('get_industry_facilities', undefined);
}
