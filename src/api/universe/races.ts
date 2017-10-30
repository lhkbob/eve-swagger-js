import { ESIAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * in-game race or multiple races. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what races of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all races.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's race, or a collection related to
 * the key's race if multiple races are being accessed at once.
 *
 * This is an API wrapper over the end points handling races in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface RaceAPI {
  details: esi.universe.Race;
}

/**
 * An api adapter for accessing various details of a single in-game race,
 * specified by a provided id when the api is instantiated.
 */
export class Race extends r.impl.SimpleResource implements r.Async<RaceAPI> {
  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @esi_route ~get_universe_races
   *
   * @returns Information about the race
   */
  details() {
    return getRaces(this.agent)
    .then(all => r.impl.filterArray(all, this.id_, r => r.race_id));
  }
}

/**
 * An api adapter for accessing various details of multiple race ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedRaces extends r.impl.SimpleMappedResource implements r.Mapped<RaceAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_universe_races
   *
   * @returns Race details mapped by race id
   */
  details() {
    return this.arrayIDs().then(ids => {
      return getRaces(this.agent)
      .then(all => r.impl.filterArrayToMap(all, ids, r => r.race_id));
    });
  }
}

/**
 * An api adapter for accessing various details about every race in the game.
 */
export class AllRaces extends r.impl.SimpleIteratedResource<esi.universe.Race> implements r.Iterated<RaceAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(
        () => agent.request('get_universe_races', undefined)), r => r.race_id);
  }

  /**
   * @esi_route get_universe_races
   *
   * @returns Iterator over details of all in-game races
   */
  details() {
    return this.getPaginatedResource();
  }
}

/**
 * A functional interface for getting APIs for a specific race, a
 * known set of race ids, or every race in the game.
 */
export interface RaceAPIFactory {
  /**
   * Create a new race api targeting every single race in the game.
   *
   * @esi_route ids get_universe_races
   *
   * @returns An AllRaces API wrapper
   */
  (): AllRaces;

  /**
   * Create a new race api targeting the particular race by `id`.
   *
   * @param id The race id
   * @returns An Race API wrapper for the given id
   */
  (id: number): Race;

  /**
   * Create a new race api targeting the multiple race ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The race ids
   * @returns A MappedRaces API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedRaces;
}

/**
 * Create a new RaceAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A RaceAPIFactory instance
 */
export function makeRaceAPIFactory(agent: ESIAgent): RaceAPIFactory {
  return <RaceAPIFactory> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All races since no id
      return new AllRaces(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Race(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedRaces(agent, ids);
    }
  };
}

function getRaces(agent: ESIAgent) {
  return agent.request('get_universe_races', undefined);
}
