import { ESIAgent, Configuration } from './internal/esi-agent';
import { getAllNames } from './internal/names';
import { Responses, esi } from './esi';

import { Factions, makeFactions } from './api/factions';
import { Alliances, makeAlliances } from './api/alliance';
import { Characters, makeCharacters } from './api/character';
import { Corporations, makeCorporations } from './api/corporation';
import { Killmails, makeKillmails } from './api/killmails';
import { Sovereignty } from './api/sovereignty';
import { Wars, makeWars } from './api/wars';

import { Schema } from './api/schema';
import { Universe } from './api/universe';
import { Fleet, makeFleet } from './api/fleet';

export { esi, Configuration };
export * from './error';

/**
 * ESI creates a shared, internal agent and then lazily instantiates all
 * specific modules as needed. The internal agent maintains a single cache for
 * all of the requests to the network interface.
 *
 * The ESI instance also provides a function to create new API instances
 * with an updated configuration.
 *
 * @see https://esi.tech.ccp.is/latest
 */
export class ESI {
  private agent: ESIAgent;

  private alliances_?: Alliances;
  private chars_?: Characters;
  private corps_?: Corporations;
  private factions_?: Factions;
  private kms_?: Killmails;
  private schema_?: Schema;
  private sov_?: Sovereignty;
  private universe_?: Universe;
  private wars_?: Wars;

  constructor(config: Partial<Configuration> = {}) {
    let fullConfig = Object.assign({}, DEFAULT_CONFIG, config);
    this.agent = new ESIAgent(fullConfig);
  }

  get configuration(): Configuration {
    return this.agent.configuration;
  }

  get alliances(): Alliances {
    if (this.alliances_ === undefined) {
      this.alliances_ = makeAlliances(this.agent);
    }
    return this.alliances_;
  }

  get characters(): Characters {
    if (this.chars_ === undefined) {
      this.chars_ = makeCharacters(this.agent);
    }
    return this.chars_;
  }

  get corporations(): Corporations {
    if (this.corps_ === undefined) {
      this.corps_ = makeCorporations(this.agent);
    }
    return this.corps_;
  }

  get wars(): Wars {
    if (this.wars_ === undefined) {
      this.wars_ = makeWars(this.agent);
    }
    return this.wars_;
  }

  get factions(): Factions {
    if (this.factions_ === undefined) {
      this.factions_ = makeFactions(this.agent);
    }
    return this.factions_;
  }

  get schema(): Schema {
    if (this.schema_ === undefined) {
      this.schema_ = new Schema(this.agent);
    }
    return this.schema_;
  }

  get universe(): Universe {
    if (this.universe_ === undefined) {
      this.universe_ = new Universe(this.agent);
    }
    return this.universe_;
  }

  get sovereignty(): Sovereignty {
    if (this.sov_ === undefined) {
      this.sov_ = new Sovereignty(this.agent);
    }
    return this.sov_;
  }

  get killmails(): Killmails {
    if (this.kms_ === undefined) {
      this.kms_ = makeKillmails(this.agent);
    }
    return this.kms_;
  }

  /**
   * Create a new ESI interface that uses the updated `config`. The provided
   * configuration is merged with this ESI's configuration, overriding this
   * instance's configuration with any keys specified in `config`.
   *
   * The newly created ESI instance uses its own internal agent with a separate
   * cache from this instance.
   *
   * If `config` is an empty object or not provided at all, the created ESI is a
   * new instance with the exact same configuration. Because the new instance
   * has its own cache, this can be a useful way to create multiple instances
   * that behave the same but are independent.
   *
   * @param config New configuration settings to override
   * @returns A new ESI instance
   */
  clone(config: Partial<Configuration> = {}): ESI {
    let newConfig = Object.assign({}, this.configuration, config);
    return new ESI(newConfig);
  }

  /**
   * Create a new Fleet API associated with the specific `fleetID`. The `token`
   * must be an SSO authentication token for a character in the fleet. Depending
   * on the character's role within the fleet, certain features may be
   * inaccessible.
   *
   * @param fleetID The ID of the fleet
   * @param token The SSO token for a character in the fleet
   * @returns A Fleet API
   */
  fleet(fleetID: number, token: string): Fleet {
    return makeFleet({ agent: this.agent, ssoToken: token, id: fleetID },
        'fleet');
  }

  /**
   * @param text The text to search all entities and types for
   * @param strict Whether or not the search should be strict, defaults to false
   * @returns All matches and their corresponding categories
   */
  search(text: string, strict?: boolean): Promise<Responses['get_search']> {
    return this.agent.request('get_search', {
      query: {
        'categories': searchCategories,
        'search': text,
        'strict': strict || false
      }
    });
  }

  /**
   * If ids is longer than the reported maximum length for ESI, the array will
   * be split into smaller chunks and multiple requests will be made and then
   * concatenated back together.
   *
   * @param ids The ids to lookup
   * @returns The resolved names and detected categories
   */
  names(ids: number[]): Promise<Responses['post_universe_names']> {
    return getAllNames(this.agent, ids);
  }

  /**
   * @returns The status of the Eve servers
   */
  status(): Promise<Responses['get_status']> {
    return this.agent.request('get_status', undefined);
  }
}

/**
 * The default configuration that specifies values for parameters that aren't
 * explicitly given.
 */
export const DEFAULT_CONFIG: Configuration = {
  url: 'https://esi.tech.ccp.is',
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

const searchCategories: esi.SearchCategory[] = [
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
