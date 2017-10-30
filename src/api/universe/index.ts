import { ESIAgent } from '../../internal/esi-agent';
import { makeRaceAPIFactory, RaceAPIFactory } from './races';
import { BloodlineAPIFactory, makeBloodlineAPIFactory } from './bloodlines';
import { makeStarAPIFactory, StarAPIFactory } from './stars';
import { makePlanetAPIFactory, PlanetAPIFactory } from './planets';
import { makeMoonAPIFactory, MoonAPIFactory } from './moons';
import { makeStargateAPIFactory, StargateAPIFactory } from './stargates';
import { makeRegionAPIFactory, RegionAPIFactory } from './regions';
import {
  ConstellationAPIFactory, makeConstellationAPIFactory
} from './constellations';
import {
  makeStationAPIFactory, StationAPIFactory
} from './stations';
import {
  makeSolarSystemAPIFactory, SolarSystemAPIFactory
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
  private races_?: RaceAPIFactory;
  private bloodlines_?: BloodlineAPIFactory;
  private stars_?: StarAPIFactory;
  private planets_?: PlanetAPIFactory;
  private moons_?: MoonAPIFactory;
  private stargates_?: StargateAPIFactory;
  private regions_?: RegionAPIFactory;
  private constellations_?: ConstellationAPIFactory;
  private stations_?: StationAPIFactory;
  private solarSystems_?: SolarSystemAPIFactory;
  private agents_?: Search;
  private wormholes_?: Search;

  constructor(private agent: ESIAgent) {
  }

  get races(): RaceAPIFactory {
    if (this.races_ === undefined) {
      this.races_ = makeRaceAPIFactory(this.agent);
    }
    return this.races_;
  }

  get bloodlines(): BloodlineAPIFactory {
    if (this.bloodlines_ === undefined) {
      this.bloodlines_ = makeBloodlineAPIFactory(this.agent);
    }
    return this.bloodlines_;
  }

  get stars(): StarAPIFactory {
    if (this.stars_ === undefined) {
      this.stars_ = makeStarAPIFactory(this.agent);
    }
    return this.stars_;
  }

  get planets(): PlanetAPIFactory {
    if (this.planets_ === undefined) {
      this.planets_ = makePlanetAPIFactory(this.agent);
    }
    return this.planets_;
  }

  get moons(): MoonAPIFactory {
    if (this.moons_ === undefined) {
      this.moons_ = makeMoonAPIFactory(this.agent);
    }
    return this.moons_;
  }

  get stargates(): StargateAPIFactory {
    if (this.stargates_ === undefined) {
      this.stargates_ = makeStargateAPIFactory(this.agent);
    }
    return this.stargates_;
  }

  get regions(): RegionAPIFactory {
    if (this.regions_ === undefined) {
      this.regions_ = makeRegionAPIFactory(this.agent);
    }
    return this.regions_;
  }

  get constellations(): ConstellationAPIFactory {
    if (this.constellations_ === undefined) {
      this.constellations_ = makeConstellationAPIFactory(this.agent);
    }
    return this.constellations_;
  }

  get stations(): StationAPIFactory {
    if (this.stations_ === undefined) {
      this.stations_ = makeStationAPIFactory(this.agent);
    }
    return this.stations_;
  }

  get solarSystems(): SolarSystemAPIFactory {
    if (this.solarSystems_ === undefined) {
      this.solarSystems_ = makeSolarSystemAPIFactory(this.agent);
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
