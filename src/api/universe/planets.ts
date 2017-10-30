import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';
import { MappedMoons, Moon } from './moons';

/**
 * The API specification for all variants that access information about an
 * planetary interaction planet or multiple planets. This interface will
 * not be used directly, but will be filtered through some mapper, such as
 * {@link Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification for
 * all variants: single, multiple, and all tasks.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple planets are being accessed at once.
 *
 * This is an API wrapper over the end points handling planets in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface PlanetAPI {
  details: Responses['get_universe_planets_planet_id'];
}

/**
 * An api adapter for accessing various details of a single planet,
 * specified by a provided id when the api is instantiated.
 */
export class Planet implements r.Async<PlanetAPI>, r.SingleResource {
  private moons_: MappedMoons | undefined;

  constructor(private agent: ESIAgent,
      private id: number | (() => Promise<number>)) {
  }

  /**
   * @returns Information about the planet
   */
  details() {
    return this.ids().then(id => getDetails(this.agent, id));
  }

  /**
   * @esi_route ~get_universe_systems_system_id
   *
   * @param index The moon's index in the planet, NOT its ID, e.g. 0 represents
   *    the planet's first moon.
   * @returns A Moon instance representing the `index`th moon of the planet
   */
  moon(index: number) :Moon {
    return new Moon(this.agent, () => this.ids()
    .then(id => getMoonsForPlanet(this.agent, id))
    .then(moons => moons[index]));
  }

  /**
   * @esi_route ~get_universe_systems_system_id
   *
   * @returns A MappedMoons instance for all the moons of the planet
   */
  get moons() :MappedMoons {
    if (this.moons_ === undefined) {
      this.moons_ = new MappedMoons(this.agent,
          () => this.ids().then(id => getMoonsForPlanet(this.agent, id)));
    }
    return this.moons_;
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
 * An api adapter for accessing various details of multiple planet ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedPlanets extends r.impl.SimpleMappedResource implements r.Mapped<PlanetAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Planet details mapped by planet id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific planet or a
 * known set of planet ids. There is currently no way to iterate over all
 * planets in the game.
 */
export interface PlanetAPIFactory {
  /**
   * Create a new planet api targeting the particular planet by `id`.
   *
   * @param id The planet id
   * @returns An Planet API wrapper for the given id
   */
  (id: number): Planet;

  /**
   * Create a new planet api targeting the multiple planet ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The planet ids
   * @returns A MappedPlanets API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedPlanets;
}

/**
 * Create a new PlanetAPIFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A PlanetAPIFactory instance
 */
export function makePlanetAPIFactory(agent: ESIAgent): PlanetAPIFactory {
  return <PlanetAPIFactory> function (ids: number | number[] | Set<number>) {
    if (typeof ids === 'number') {
      // Single id so single API
      return new Planet(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedPlanets(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_planets_planet_id',
      { path: { planet_id: id } });
}

function getMoonsForPlanet(agent: ESIAgent, id: number) {
  return getDetails(agent, id)
  .then(details => agent.request('get_universe_systems_system_id',
      { path: { system_id: details.system_id } }))
  .then(system => {
    for (let p of system.planets) {
      if (p.planet_id === id) {
        return p.moons || [];
      }
    }
    return [];
  });
}
