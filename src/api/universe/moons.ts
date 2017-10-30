import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * planetary interaction moon or multiple moons. This interface will
 * not be used directly, but will be filtered through some mapper, such as
 * {@link Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification for
 * all variants: single, multiple, and all tasks.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple moons are being accessed at once.
 *
 * This is an API wrapper over the end points handling moons in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface MoonAPI {
  details: Responses['get_universe_moons_moon_id'];
}

/**
 * An api adapter for accessing various details of a single moon,
 * specified by a provided id when the api is instantiated.
 */
export class Moon implements r.Async<MoonAPI>, r.SingleResource {
  constructor(private agent: ESIAgent, private id: number | (() => Promise<number>)) { }

  /**
   * @returns Information about the moon
   */
  details() {
    return this.ids().then(id => getDetails(this.agent, id));
  }

  ids() {
    if (typeof this.id === 'number') {
      return Promise.resolve(this.id);
    } else {
      return this.id();
    }
  }
}

/**
 * An api adapter for accessing various details of multiple moon ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedMoons extends r.impl.SimpleMappedResource implements r.Mapped<MoonAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Moon details mapped by moon id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific moon or a
 * known set of moon ids. There is currently no way to iterate over all
 * moons in the game.
 */
export interface MoonAPIFactory {
  /**
   * Create a new moon api targeting the particular moon by `id`.
   *
   * @param id The moon id
   * @returns An Moon API wrapper for the given id
   */
  (id: number): Moon;

  /**
   * Create a new moon api targeting the multiple moon ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The moon ids
   * @returns A MappedMoons API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedMoons;
}

/**
 * Create a new MoonAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A MoonAPIFactory instance
 */
export function makeMoonAPIFactory(agent: ESIAgent): MoonAPIFactory {
  return <MoonAPIFactory> function (ids: number | number[] | Set<number>) {
    if (typeof ids === 'number') {
      // Single id so single API
      return new Moon(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedMoons(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_moons_moon_id',
      { path: { moon_id: id } });
}
