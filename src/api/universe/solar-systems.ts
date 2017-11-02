import { makeDefaultSearch } from '../../internal/search';
import { getIteratedNames, getNames } from '../../internal/names';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';
import { Star } from './stars';
import { MappedStargates } from './stargates';
import { MappedPlanets, Planet } from './planets';
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
export class SolarSystem extends r.impl.SimpleResource implements r.Async<SolarSystemAPI> {
  private star_: Star | undefined;
  private gates_: MappedStargates | undefined;
  private planets_: MappedPlanets | undefined;
  private stations_: MappedStations | undefined;

  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns A MappedStations instance tied to the stations referenced in the
   *    details of this solar system
   */
  get stations(): MappedStations {
    if (this.stations_ === undefined) {
      this.stations_ = new MappedStations(this.agent,
          () => this.details().then(r => r.stations || []));
    }
    return this.stations_!;
  }

  /**
   * @returns A Star API interface tied to the star referenced in the details
   *    of this solar system
   */
  get star(): Star {
    if (this.star_ === undefined) {
      this.star_ = new Star(this.agent,
          () => this.details().then(r => r.star_id));
    }
    return this.star_!;
  }

  /**
   * @returns A MappedStargates instance tied to the stargates referenced in
   *    the details of this solar system
   */
  get stargates(): MappedStargates {
    if (this.gates_ === undefined) {
      this.gates_ = new MappedStargates(this.agent,
          () => this.details().then(r => r.stargates || []));
    }
    return this.gates_!;
  }

  /**
   * @returns A MappedPlanets instance tied to the planets referenced in the
   *    details of this solar system
   */
  get planets(): MappedPlanets {
    if (this.planets_ === undefined) {
      this.planets_ = new MappedPlanets(this.agent,
          () => this.details().then(r => r.planets.map(p => p.planet_id)));
    }
    return this.planets_!;
  }

  /**
   * @esi_route get_route_origin_destination [shortest]
   *
   * @param to Destination solar system id
   * @param avoid Optional list of solar systems to avoid
   * @param connections Optional list of solar systems to pass through
   * @returns Route specified by ordered solar system ids
   */
  shortestRoute(to: number, avoid?: number[],
      connections?: number[]): Promise<Responses['get_route_origin_destination']> {
    return this.getRoute('shortest', to, avoid, connections);
  }

  /**
   * @esi_route get_route_origin_destination [secure]
   *
   * @param to Destination solar system id
   * @param avoid Optional list of solar systems to avoid
   * @param connections Optional list of solar systems to pass through
   * @returns Route specified by ordered solar system ids
   */
  secureRoute(to: number, avoid?: number[],
      connections?: number[]): Promise<Responses['get_route_origin_destination']> {
    return this.getRoute('secure', to, avoid, connections);
  }

  /**
   * @esi_route get_route_origin_destination [insecure]
   * @esi_example esi.solarSystems(fromId).insecureRoute(toId, ...)
   *
   * @param to Destination solar system id
   * @param avoid Optional list of solar systems to avoid
   * @param connections Optional list of solar systems to pass through
   */
  insecureRoute(to: number, avoid?: number[],
      connections?: number[]): Promise<Responses['get_route_origin_destination']> {
    return this.getRoute('insecure', to, avoid, connections);
  }

  private getRoute(type: 'shortest' | 'secure' | 'insecure', to: number,
      avoid?: number[], connections?: number[]) {
    // Build up multi level connections array
    let pairedConnections: number[][] | undefined;
    if (connections !== undefined) {
      pairedConnections = [];
      for (let i = 0; i < connections.length - 1; i++) {
        pairedConnections.push([connections[i], connections[i + 1]]);
      }
    }

    return this.agent.request('get_route_origin_destination', {
      path: { origin: this.id_, destination: to }, query: {
        flag: type, avoid: avoid, connections: pairedConnections
      }
    });
  }

  /**
   * @returns Information about the solar system
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_universe_system_jumps
   *
   * @returns The number of recent jumps through the system
   */
  jumpStats() {
    return getJumpStats(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.system_id))
    .then(stats => stats.ship_jumps);
  }

  /**
   * @esi_route ~get_universe_system_kills
   *
   * @returns The number of recent kills through the system
   */
  killStats() {
    return getKillStats(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.system_id));
  }

  /**
   * @esi_route ~get_sovereignty_map
   *
   * @returns Sovereignty control information for the system
   */
  sovereignty() {
    return getSovereignty(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.system_id));
  }

  /**
   * @esi_route ~get_industry_systems
   *
   * @returns Industry cost indices for the system
   */
  costIndices() {
    return getCostIndices(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, e => e.solar_system_id))
    .then(costs => costs.cost_indices);
  }

  /**
   * @esi_route ~get_universe_systems_system_id
   *
   * @returns The name of the solar system
   */
  names() {
    return this.details().then(result => result.name);
  }
}

/**
 * An api adapter for accessing various details of multiple solar system ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedSolarSystems extends r.impl.SimpleMappedResource implements r.Mapped<SolarSystemAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns SolarSystem details mapped by solar system id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route ~get_universe_system_jumps
   *
   * @returns Jump stats for the specified solar systems
   */
  jumpStats() {
    return this.arrayIDs().then(ids => {
      return getJumpStats(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, e => e.system_id))
      .then(objMap => {
        let numMap = new Map();
        for (let [k, v] of objMap.entries()) {
          numMap.set(k, v.ship_jumps);
        }
        return numMap;
      });
    });
  }

  /**
   * @esi_route ~get_universe_system_kills
   *
   * @returns Kill statistics for the specified solar systems
   */
  killStats() {
    return this.arrayIDs().then(ids => {
      return getKillStats(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, e => e.system_id));
    });
  }

  /**
   * @esi_route ~get_sovereignty_map
   *
   * @returns Sovereignty information for the specified solar systems
   */
  sovereignty() {
    return this.arrayIDs().then(ids => {
      return getSovereignty(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, e => e.system_id));
    });
  }

  /**
   * @esi_route ~get_industry_systems
   *
   * @returns Cost indices for the specified solar systems
   */
  costIndices() {
    return this.arrayIDs().then(ids => {
      return getCostIndices(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, e => e.solar_system_id))
      .then(objMap => {
        let aMap = new Map();
        for (let [k, v] of objMap.entries()) {
          aMap.set(k, v.cost_indices);
        }
        return aMap;
      });
    });
  }

  /**
   * @esi_route post_universe_names [system]
   *
   * @returns The specified solar systems' names
   */
  names() {
    return this.arrayIDs()
    .then(ids => getNames(this.agent, esi.universe.NameCategory.SOLAR_SYSTEM,
        ids));
  }
}

/**
 * An api adapter for accessing various details about every solar system in the
 * universe.
 */
export class IteratedSolarSystems extends r.impl.SimpleIteratedResource<number> implements r.Iterated<SolarSystemAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(
        () => agent.request('get_universe_systems', undefined)), id => id);
  }

  /**
   * @returns The details of every solar system in the universe
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route get_universe_system_jumps
   *
   * @returns Jump statistics for every solar system in the universe, besides
   *    worm hole systems
   */
  async * jumpStats() {
    let stats = await getJumpStats(this.agent);
    for (let s of stats) {
      yield <[number, number]> [s.system_id, s.ship_jumps];
    }
  }

  /**
   * @esi_route get_universe_system_kills
   *
   * @returns Kill statistics for every solar system in the universe, besides
   *    worm hole systems
   */
  async * killStats() {
    let stats = await getKillStats(this.agent);
    for (let s of stats) {
      yield <[number, esi.universe.SystemKills]> [s.system_id, s];
    }
  }

  /**
   * @esi_route get_sovereignty_map
   *
   * @returns Sovereignty information for all solar systems
   */
  async * sovereignty() {
    let sov = await getSovereignty(this.agent);
    for (let s of sov) {
      yield <[number, esi.sovereignty.Map]> [s.system_id, s];
    }
  }

  /**
   * @esi_route get_industry_systems
   *
   * @returns Industry cost indices for all solar systems
   */
  async * costIndices() {
    let costs = await getCostIndices(this.agent);
    for (let c of costs) {
      yield <[number, esi.industry.CostIndex[]]> [
        c.solar_system_id, c.cost_indices
      ];
    }
  }

  /**
   * @esi_route post_universe_names [system]
   *
   * @returns Names of all solar systems in the universe
   */
  names() {
    return getIteratedNames(this.agent, esi.universe.NameCategory.SOLAR_SYSTEM,
        this.ids());
  }
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
export function makeSolarSystems(agent: ESIAgent): SolarSystems {
  const systemSearch = makeDefaultSearch(agent, esi.SearchCategory.SOLARSYSTEM);

  return <SolarSystems> function (ids: number | number[] | Set<number> | string | undefined,
      strict: boolean = false) {
    if (ids === undefined) {
      // No id, so all solar systems
      return new IteratedSolarSystems(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new SolarSystem(agent, ids);
    } else if (typeof ids === 'string') {
      // Search query, so mapped API with dynamic ids
      return new MappedSolarSystems(agent, () => systemSearch(ids, strict));
    } else {
      // Set or array, so mapped API with fixed ids
      return new MappedSolarSystems(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_systems_system_id',
      { path: { system_id: id } });
}

function getJumpStats(agent: ESIAgent) {
  return agent.request('get_universe_system_jumps', undefined);
}

function getKillStats(agent: ESIAgent) {
  return agent.request('get_universe_system_kills', undefined);
}

function getSovereignty(agent: ESIAgent) {
  return agent.request('get_sovereignty_map', undefined);
}

function getCostIndices(agent: ESIAgent) {
  return agent.request('get_industry_systems', undefined);
}
