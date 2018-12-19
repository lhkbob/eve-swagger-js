import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';

/**
 * An api adapter that provides functions for accessing various details for a
 * planet specified by id, via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Planet {
  /**
   * @esi_example esi.planets(id).info()
   *
   * @returns Information on all planets
   */
  info(): Promise<Responses['get_universe_planets_planet_id']>;

  /**
   * @returns The planet's id
   */
  id(): Promise<number>;
}

/**
 * An api adapter that provides functions for accessing planet information via
 * the [universe](https://esi.evetech.net/latest/#/Universe) ESI end points.
 */
export interface Planets {
  /**
   * Create a new Planet end point targeting the particular planet
   * by `id`.
   *
   * @param id The planet id
   * @returns A Planet API wrapper for the given id
   */
  (id: number): Planet;
}

export function makePlanets(agent: ESIAgent): Planets {
  return <Planets> <any> function (id: number) {
    return new PlanetImpl(agent, id);
  };
}

class PlanetImpl {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_universe_planets_planet_id',
        { path: { planet_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
