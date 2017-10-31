import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * stargate or multiple stargates. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all stargates.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple stargates are being accessed at once.
 *
 * This is an API wrapper over the end points handling stargates in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface StargateAPI {
  details: Responses['get_universe_stargates_stargate_id'];
}

/**
 * An api adapter for accessing various details of a single stargate,
 * specified by a provided id when the api is instantiated.
 */
export class Stargate implements r.Async<StargateAPI>, r.SingleResource {
  constructor(private agent: ESIAgent, private id: number | (() => Promise<number>)) { }

  /**
   * @returns Information about the stargate
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
 * An api adapter for accessing various details of multiple stargate ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedStargates extends r.impl.SimpleMappedResource implements r.Mapped<StargateAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Stargate details mapped by stargate id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific stargate or a
 * known set of stargate ids. There is currently no way to iterate over all
 * stargates in the game.
 */
export interface Stargates {
  /**
   * Create a new stargate api targeting the particular stargate by `id`.
   *
   * @param id The stargate id
   * @returns An Stargate API wrapper for the given id
   */
  (id: number): Stargate;

  /**
   * Create a new stargate api targeting the multiple stargate ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The stargate ids
   * @returns A MappedStargates API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedStargates;
}

/**
 * Create a new Stargates instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Stargates instance
 */
export function makeStargates(agent: ESIAgent): Stargates {
  return <Stargates> function (ids: number | number[] | Set<number>) {
    if (typeof ids === 'number') {
      // Single id so single API
      return new Stargate(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedStargates(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_stargates_stargate_id',
      { path: { stargate_id: id } });
}
