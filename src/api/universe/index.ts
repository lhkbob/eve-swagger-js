import { ESIAgent } from '../../internal/esi-agent';
import { makeRaces, Races } from './races';
import { Bloodlines, makeBloodlines } from './bloodlines';
import { makeStars, Stars } from './stars';
import { makePlanets, Planets } from './planets';
import { makeMoons, Moons } from './moons';
import { makeStargates, Stargates } from './stargates';
import { makeRegions, Regions } from './regions';
import {
  Constellations, makeConstellations
} from './constellations';
import {
  makeStations, Stations
} from './stations';
import {
  makeSolarSystems, SolarSystems
} from './solar-systems';
import { esi, Responses } from '../../esi';
import { makeDefaultSearch, Search } from '../../internal/search';

/**
 * A simple wrapper around functional interfaces for getting APIs for regions,
 * solar systems, constellations, races, bloodlines, etc.
 *
 * - [universe](https://esi.tech.ccp.is/latest/#/Universe)
 * - [industry](https://esi.tech.ccp.is/latest/#/Industry)
 * - [incursions](https://esi.tech.ccp.is/latest/#/Incursions)
 * - [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty)
 * - [market](https://esi.tech.ccp.is/latest/#/Market)
 */
export class Universe {
  private races_?: Races;
  private bloodlines_?: Bloodlines;
  private stars_?: Stars;
  private planets_?: Planets;
  private moons_?: Moons;
  private stargates_?: Stargates;
  private regions_?: Regions;
  private constellations_?: Constellations;
  private stations_?: Stations;
  private solarSystems_?: SolarSystems;
  private agents_?: Search;
  private wormholes_?: Search;

  constructor(private agent: ESIAgent) {
  }

  get races(): Races {
    if (this.races_ === undefined) {
      this.races_ = makeRaces(this.agent);
    }
    return this.races_;
  }

  get bloodlines(): Bloodlines {
    if (this.bloodlines_ === undefined) {
      this.bloodlines_ = makeBloodlines(this.agent);
    }
    return this.bloodlines_;
  }

  get stars(): Stars {
    if (this.stars_ === undefined) {
      this.stars_ = makeStars(this.agent);
    }
    return this.stars_;
  }

  get planets(): Planets {
    if (this.planets_ === undefined) {
      this.planets_ = makePlanets(this.agent);
    }
    return this.planets_;
  }

  get moons(): Moons {
    if (this.moons_ === undefined) {
      this.moons_ = makeMoons(this.agent);
    }
    return this.moons_;
  }

  get stargates(): Stargates {
    if (this.stargates_ === undefined) {
      this.stargates_ = makeStargates(this.agent);
    }
    return this.stargates_;
  }

  get regions(): Regions {
    if (this.regions_ === undefined) {
      this.regions_ = makeRegions(this.agent);
    }
    return this.regions_;
  }

  get constellations(): Constellations {
    if (this.constellations_ === undefined) {
      this.constellations_ = makeConstellations(this.agent);
    }
    return this.constellations_;
  }

  get stations(): Stations {
    if (this.stations_ === undefined) {
      this.stations_ = makeStations(this.agent);
    }
    return this.stations_;
  }

  get solarSystems(): SolarSystems {
    if (this.solarSystems_ === undefined) {
      this.solarSystems_ = makeSolarSystems(this.agent);
    }
    return this.solarSystems_;
  }

  /**
   * @returns All player-created freeport citadels
   */
  freeports(): Promise<Responses['get_universe_structures']> {
    return this.agent.request('get_universe_structures', undefined);
  }

  /**
   * @esi_route get_search [agent]
   *
   * @param query Search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns Agent ids matching the search terms
   */
  agents(query: string, strict: boolean = false): Promise<number[]> {
    if (this.agents_ === undefined) {
      this.agents_ = makeDefaultSearch(this.agent, esi.SearchCategory.AGENT);
    }
    return this.agents_(query, strict);
  }

  /**
   * @esi_route get_search [wormhole]
   *
   * @param query Search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns Wormhole ids matching the search terms
   */
  wormholes(query: string, strict: boolean = false): Promise<number[]> {
    if (this.wormholes_ === undefined) {
      this.wormholes_ = makeDefaultSearch(this.agent,
          esi.SearchCategory.WORMHOLE);
    }
    return this.wormholes_(query, strict);
  }

  /**
   * @returns Details on all active incursions in the universe
   */
  incursions(): Promise<Responses['get_incursions']> {
    return this.agent.request('get_incursions', undefined);
  }
}
