import { ESIAgent, Configuration } from './internal/esi-agent';
import { getAllNames } from './internal/names';
import { Responses, esi } from '../gen/esi';

import { Agents, makeAgents } from './api/universe/agents';
import { Bloodlines, makeBloodlines } from './api/universe/bloodlines';
import {
  Constellations, makeConstellations
} from './api/universe/constellations';
import { Dogma, makeDogma } from './api/universe/dogma';
import { Factions, makeFactions } from './api/universe/factions';
import { Freeports, makeFreeports } from './api/universe/freeports';
import { Graphics, makeGraphics } from './api/universe/graphics';
import { Industry, makeIndustry } from './api/universe/industry';
import { Insurance, makeInsurance } from './api/universe/insurance';
import { Moons, makeMoons } from './api/universe/moons';
import { Opportunities, makeOpportunities } from './api/universe/opportunities';
import { Planets, makePlanets } from './api/universe/planets';
import {
  PlanetaryInteraction, makePlanetaryInteraction
} from './api/universe/planetary-interaction';
import { Races, makeRaces } from './api/universe/races';
import { Regions, makeRegions } from './api/universe/regions';
import { SolarSystems, makeSolarSystems } from './api/universe/solar-systems';
import { Stargates, makeStargates } from './api/universe/stargates';
import { Stations, makeStations } from './api/universe/stations';
import { Types, makeTypes } from './api/universe/types';
import { Wormholes, makeWormholes } from './api/universe/wormholes';

import { Alliances, makeAlliances } from './api/alliances';
import { Corporations, makeCorporations } from './api/corporations';
import { Incursions, makeIncursions } from './api/incursions';
import { Killmail, makeKillmail } from './api/killmail';
import { Sovereignty, makeSovereignty } from './api/sovereignty';
import { Wars, makeWars } from './api/wars';

import { Characters, makeCharacters } from './api/character/characters';

export {esi};
export * from './error';

/**
 * API creates a shared, internal ESIAgent and then lazily instantiates all
 * specific modules as needed. The API instance is also a function that can
 * be invoked to create a new API instance with a different configuration.
 *
 * @see https://esi.evetech.net/latest
 */
export interface API {
  /**
   * An instance of Characters using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  characters: Characters;

  /**
   * An instance of Agents using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  agents: Agents;

  /**
   * An instance of Bloodlines using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  bloodlines: Bloodlines;

  /**
   * An instance of Constellations using a shared ESIAgent configured based
   * on the API's initialization options.
   */
  constellations: Constellations;

  /**
   * An instance of Dogma using a shared ESIAgent configured based
   * on the API's initialization options.
   */
  dogma: Dogma;

  /**
   * An instance of Factions using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  factions: Factions;

  /**
   * An instance of Freeports using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  freeports: Freeports;

  /**
   * An instance of Graphics using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  graphics: Graphics;

  /**
   * An instance of Industry using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  industry: Industry;

  /**
   * An instance of Insurance using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  insurance: Insurance;

  /**
   * An instance of Moons using a shared ESIAgent configured based
   * on the API's initialization options.
   */
  moons: Moons;

  /**
   * An instance of Opportunities using a shared ESIAgent configured based
   * on the API's initialization options.
   */
  opportunities: Opportunities;

  /**
   * An instance of Planets using a shared ESIAgent configured based
   * on the API's initialization options.
   */
  planets: Planets;

  /**
   * An instance of PlanetaryInteraction using a shared ESIAgent configured
   * based on the API's initialization options.
   */
  pi: PlanetaryInteraction;

  /**
   * An instance of Races using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  races: Races;

  /**
   * An instance of Regions using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  regions: Regions;

  /**
   * An instance of SolarSystems using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  solarSystems: SolarSystems;

  /**
   * An instance of Stargates using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  stargates: Stargates;

  /**
   * An instance of Stations using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  stations: Stations;

  /**
   * An instance of Types using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  types: Types;

  /**
   * An instance of Wormholes using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  wormholes: Wormholes;

  /**
   * An instance of Alliances using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  alliances: Alliances;

  /**
   * An instance of Corporations using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  corporations: Corporations;

  /**
   * An instance of Incursions using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  incursions: Incursions;

  /**
   * An instance of Killmail using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  killmail: Killmail;

  /**
   * An instance of Sovereignty using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  sovereignty: Sovereignty;

  /**
   * An instance of Wars using a shared ESIAgent configured based on
   * the API's initialization options.
   */
  wars: Wars;

  /**
   * @esi_example esi.search('text')
   *
   * @param text The text to search all entities and types for
   * @param strict Whether or not the search should be strict, defaults to false
   * @returns All matches and their corresponding categories
   */
  search(text: string, strict?: boolean): Promise<Responses['get_search']>;

  /**
   * If ids is longer than the reported maximum length for ESI, the array will
   * be split into smaller chunks and multiple requests will be made and then
   * concatenated back together.
   *
   * @esi_example esi.names(ids)
   *
   * @param ids The ids to lookup
   * @returns The resolved names and detected categories
   */
  names(ids: number[]): Promise<Responses['post_universe_names']>;

  /**
   * @esi_example esi.status()
   *
   * @returns The status of the Eve servers
   */
  status(): Promise<Responses['get_status']>;
}

/**
 * The default configuration that specifies values for parameters that aren't
 * explicitly given when {@link makeAPI} is called.
 */
export const DEFAULT_CONFIG: Configuration = {
  url: 'https://esi.evetech.net',
  source: 'tranquility',
  userAgent: 'eve-swagger | https://github.com/lhkbob/eve-swagger-js',
  language: esi.Language.EN_US,
  timeout: 6000,
  maxConcurrentRequests: 0,
  minTimeBetweenRequests: 0,
  maxQueueSize: -1,
  respectErrorLimit: true,
  maxResponseTTL: Number.POSITIVE_INFINITY,
  errorTTL: 5 * 60 * 1000,
  accessTokenTTL: 10 * 60 * 1000,
  userAgentDelivery: 'x-header',
  accessTokenDelivery: 'header'
};

/**
 * Create a new API with the given configuration provided in a single
 * object map. Any parameter that is not provided will use the default value
 * in {@link DEFAULT_CONFIG}.
 *
 * It is strongly recommended that a custom user agent be provided.
 *
 * @param config The configuration for the API
 * @returns The API instance
 */
export function makeAPI(config: Partial<Configuration> = {}): API {
  let fullConfig: Configuration = Object.assign({}, DEFAULT_CONFIG, config);
  return new APIImpl(fullConfig);
}

class APIImpl implements API {
  private agent: ESIAgent;

  private charsAPI?: Characters;

  private allyAPI?: Alliances;
  private corpAPI?: Corporations;
  private incursionAPI?: Incursions;
  private kmAPI?: Killmail;
  private sovAPI?: Sovereignty;
  private warAPI?: Wars;

  private agentsAPI?: Agents;
  private bloodAPI?: Bloodlines;
  private constAPI?: Constellations;
  private dogmaAPI?: Dogma;
  private factionAPI?: Factions;
  private freeportAPI?: Freeports;
  private graphicsAPI?: Graphics;
  private gateAPI?: Stargates;
  private indyAPI?: Industry;
  private insuranceAPI?: Insurance;
  private moonAPI?: Moons;
  private opportunityAPI?: Opportunities;
  private piAPI?: PlanetaryInteraction;
  private planetAPI?: Planets;
  private raceAPI?: Races;
  private regionAPI?: Regions;
  private systemAPI?: SolarSystems;
  private stationAPI?: Stations;
  private typesAPI?: Types;
  private whsAPI?: Wormholes;

  constructor(config: Configuration) {
    this.agent = new ESIAgent(config);
  }

  get characters() {
    if (this.charsAPI === undefined) {
      this.charsAPI = makeCharacters(this.agent);
    }
    return this.charsAPI;
  }

  get agents() {
    if (this.agentsAPI === undefined) {
      this.agentsAPI = makeAgents(this.agent);
    }
    return this.agentsAPI;
  }

  get bloodlines() {
    if (this.bloodAPI === undefined) {
      this.bloodAPI = makeBloodlines(this.agent);
    }
    return this.bloodAPI;
  }

  get constellations() {
    if (this.constAPI === undefined) {
      this.constAPI = makeConstellations(this.agent);
    }
    return this.constAPI;
  }

  get dogma() {
    if (this.dogmaAPI === undefined) {
      this.dogmaAPI = makeDogma(this.agent);
    }
    return this.dogmaAPI;
  }

  get factions() {
    if (this.factionAPI === undefined) {
      this.factionAPI = makeFactions(this.agent);
    }
    return this.factionAPI;
  }

  get freeports() {
    if (this.freeportAPI === undefined) {
      this.freeportAPI = makeFreeports(this.agent);
    }
    return this.freeportAPI;
  }

  get graphics() {
    if (this.graphicsAPI === undefined) {
      this.graphicsAPI = makeGraphics(this.agent);
    }
    return this.graphicsAPI;
  }

  get industry() {
    if (this.indyAPI === undefined) {
      this.indyAPI = makeIndustry(this.agent);
    }
    return this.indyAPI;
  }

  get insurance() {
    if (this.insuranceAPI === undefined) {
      this.insuranceAPI = makeInsurance(this.agent);
    }
    return this.insuranceAPI;
  }

  get moons() {
    if (this.moonAPI === undefined) {
      this.moonAPI = makeMoons(this.agent);
    }
    return this.moonAPI;
  }

  get opportunities() {
    if (this.opportunityAPI === undefined) {
      this.opportunityAPI = makeOpportunities(this.agent);
    }
    return this.opportunityAPI;
  }

  get planets() {
    if (this.planetAPI === undefined) {
      this.planetAPI = makePlanets(this.agent);
    }
    return this.planetAPI;
  }

  get pi() {
    if (this.piAPI === undefined) {
      this.piAPI = makePlanetaryInteraction(this.agent);
    }
    return this.piAPI;
  }

  get races() {
    if (this.raceAPI === undefined) {
      this.raceAPI = makeRaces(this.agent);
    }
    return this.raceAPI;
  }

  get regions() {
    if (this.regionAPI === undefined) {
      this.regionAPI = makeRegions(this.agent);
    }
    return this.regionAPI;
  }

  get solarSystems() {
    if (this.systemAPI === undefined) {
      this.systemAPI = makeSolarSystems(this.agent);
    }
    return this.systemAPI;
  }

  get stargates() {
    if (this.gateAPI === undefined) {
      this.gateAPI = makeStargates(this.agent);
    }
    return this.gateAPI;
  }

  get stations() {
    if (this.stationAPI === undefined) {
      this.stationAPI = makeStations(this.agent);
    }
    return this.stationAPI;
  }

  get types() {
    if (this.typesAPI === undefined) {
      this.typesAPI = makeTypes(this.agent);
    }
    return this.typesAPI;
  }

  get wormholes() {
    if (this.whsAPI === undefined) {
      this.whsAPI = makeWormholes(this.agent);
    }
    return this.whsAPI;
  }

  get alliances() {
    if (this.allyAPI === undefined) {
      this.allyAPI = makeAlliances(this.agent);
    }
    return this.allyAPI;
  }

  get corporations() {
    if (this.corpAPI === undefined) {
      this.corpAPI = makeCorporations(this.agent);
    }
    return this.corpAPI;
  }

  get incursions() {
    if (this.incursionAPI === undefined) {
      this.incursionAPI = makeIncursions(this.agent);
    }
    return this.incursionAPI;
  }

  get killmail() {
    if (this.kmAPI === undefined) {
      this.kmAPI = makeKillmail(this.agent);
    }
    return this.kmAPI;
  }

  get sovereignty() {
    if (this.sovAPI === undefined) {
      this.sovAPI = makeSovereignty(this.agent);
    }
    return this.sovAPI;
  }

  get wars() {
    if (this.warAPI === undefined) {
      this.warAPI = makeWars(this.agent);
    }
    return this.warAPI;
  }

  search(text: string, strict?: boolean) {
    const categories: esi.SearchCategory[] = [
      esi.SearchCategory.AGENT,
      esi.SearchCategory.ALLIANCE,
      esi.SearchCategory.CHARACTER,
      esi.SearchCategory.CONSTELLATION,
      esi.SearchCategory.CORPORATION,
      esi.SearchCategory.FACTION,
      esi.SearchCategory.INVENTORYTYPE,
      esi.SearchCategory.REGION,
      esi.SearchCategory.SOLARSYSTEM,
      esi.SearchCategory.STATION,
      esi.SearchCategory.WORMHOLE
    ];
    return this.agent.request('get_search', {
      query: {
        'categories': categories, 'search': text, 'strict': strict || false
      }
    });
  }

  names(ids: number[]) {
    return getAllNames(this.agent, ids);
  }

  status() {
    return this.agent.request('get_status', undefined);
  }
}
