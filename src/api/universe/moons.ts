import { getNames } from '../..//internal/names';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';

/**
 * An api adapter that provides functions for accessing various details for a
 * moon specified by id, via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Moon {
  /**
   * @esi_example esi.moons(id).info()
   *
   * @returns Information on the specific moon
   */
  info() :Promise<Responses['get_universe_moons_moon_id']>;

  /**
   * @returns The moon's id
   */
  id() :Promise<number>;
}

/**
 * An api adapter that provides functions for accessing moon information via the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI end points.
 */
export interface Moons {
  /**
   * Create a new Moon end point targeting the particular moon
   * by `id`.
   *
   * @param id The moon id
   * @returns A Moon API wrapper for the given id
   */
  (id:number) :Moon;
}

/**
 * Create a new {@link Moons} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Moons API instance
 */
export function makeMoons(agent:ESIAgent) :Moons {
  return <Moons> <any> function(id:number) {
    return new MoonImpl(agent, id);
  }
}

class MoonImpl implements Moon {
  constructor(private agent:ESIAgent, private id_:number) { }

  info() {
    return this.agent.request('get_universe_moons_moon_id', {path: {moon_id: this.id_}});
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
