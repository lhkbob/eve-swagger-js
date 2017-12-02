import { makeCharacterSearch } from '../internal/search';
import { ESIAgent, SSOAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';
import { Market } from './market';

import * as r from '../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * structure or multiple structures. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all structures.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple structures are being accessed at once.
 */
export interface StructureAPI {
  summary: Responses['get_universe_structures_structure_id'];
  details: esi.corporation.structure.Structure;
  names: string;
}

/**
 * An api adapter for accessing various details of a single structure, specified
 * by a provided id when the api is instantiated. It must be provided with a
 * character id or a corporation id as well. When needed, it will infer the
 * other resource id based on information. For example, if a corp id is needed
 * for an ESI request but only the character id is available, then the
 * corporation of the character is used. If the character id is needed, then the
 * CEO of the corporation will be used.
 */
export class Structure extends r.impl.SimpleResource implements r.Async<StructureAPI> {
  private agent: SSOAgent<number>; // id corresponds to structure id
  private charAndCorp: CharAndCorpAgent;

  private market_?: StructureMarket;
  private details_?: r.impl.ResourceStreamer<esi.corporation.structure.Structure>;

  constructor(agent: ESIAgent, ssoToken: string, id: number,
      charID?: number | r.impl.IDProvider,
      corpID?: number | r.impl.IDProvider) {
    super(id);
    this.agent = { agent, id, ssoToken };
    this.charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
  }

  get market(): Market {
    if (this.market_ === undefined) {
      this.market_ = new StructureMarket(this.agent);
    }
    return this.market_;
  }

  /**
   * @esi_route ~get_corporations_corporation_id_structures
   *
   * @returns More detailed information of the structure, including
   *     vulnerability periods and security
   */
  details() {
    if (this.details_ === undefined) {
      this.details_ = getCorpStructures(this.charAndCorp);
    }
    return r.impl.filterIterated(this.details_(), this.agent.id,
        e => e.structure_id);
  }

  /**
   * @returns The summary and name of the structure
   */
  summary() {
    return getStructure(this.agent);
  }

  /**
   * @esi_route ~get_universe_structures_structure_id
   *
   * @returns The name of the structure
   */
  names() {
    return this.summary().then(result => result.name);
  }

  /**
   * @param newSchedule The schedule specification
   * @returns An empty promise that resolves when the new schedule is saved
   */
  async updateSchedule(newSchedule: esi.corporation.structure.VulnerabilitySchedule[]): Promise<undefined> {
    let corp = await this.charAndCorp.corpID();
    return this.agent.agent.request(
        'put_corporations_corporation_id_structures_structure_id', {
          path: { corporation_id: corp, structure_id: this.agent.id },
          body: newSchedule
        }, this.agent.ssoToken);
  }
}

/**
 * An api adapter for accessing various details of multiple structures,
 * specified by a provided an array, set of ids, or search query.
 */
export class MappedStructures extends r.impl.SimpleMappedResource implements r.Mapped<StructureAPI> {
  private charAndCorp: CharAndCorpAgent;

  private details_: r.impl.ResourceStreamer<esi.corporation.structure.Structure>;

  constructor(agent: ESIAgent, ssoToken: string,
      ids: number[] | Set<number> | r.impl.IDSetProvider,
      charID?: number | r.impl.IDProvider,
      corpID?: number | r.impl.IDProvider) {
    super(ids);
    this.charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
  }

  /**
   * @esi_route ~get_corporations_corporation_id_structures
   *
   * @returns More detailed information of the structures, including
   *     vulnerability periods and security, mapped by their id
   */
  details() {
    if (this.details_ === undefined) {
      this.details_ = getCorpStructures(this.charAndCorp);
    }
    return this.arrayIDs()
    .then(ids => r.impl.filterIteratedToMap(this.details_(), ids,
        e => e.structure_id));
  }

  /**
   * @returns The summary and name of the structures, mapped by id
   */
  summary() {
    return this.getResource(id => getStructure({
      agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
    }));
  }

  /**
   * @esi_route ~get_universe_structures_structure_id
   *
   * @returns The name of the structures, mapped by id
   */
  names() {
    return this.getResource(id => getStructure({
      agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
    }).then(details => details.name));
  }
}

/**
 * An api adapter for accessing various details of all structures owned by
 * a corporation (either specified directly, or the dynamic corporation of
 * a specific character).
 */
export class IteratedStructures extends r.impl.SimpleIteratedResource<esi.corporation.structure.Structure> implements r.Iterated<StructureAPI> {
  private charAndCorp: CharAndCorpAgent;

  constructor(agent: ESIAgent, ssoToken: string,
      charID?: number | r.impl.IDProvider,
      corpID?: number | r.impl.IDProvider) {
    let charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);

    super(getCorpStructures(charAndCorp), e => e.structure_id);
    this.charAndCorp = charAndCorp;
  }

  /**
   * @esi_route get_corporations_corporation_id_structures
   *
   * @returns More detailed information of the corp-owned structures, including
   *     vulnerability periods and security
   */
  details() {
    return this.getPaginatedResource();
  }

  /**
   * @returns The summary and name of each structure owned by the corp
   */
  summary() {
    return this.getResource(id => getStructure({
      agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
    }));
  }

  /**
   * @esi_route ~get_universe_structures_structure_id
   *
   * @returns The name of each structure owned by the corporation
   */
  names() {
    return this.getResource(id => getStructure({
      agent: this.charAndCorp.agent, ssoToken: this.charAndCorp.ssoToken, id
    }).then(details => details.name));
  }
}

/**
 * A functional interface for getting APIs for a specific structure, a known
 * set of structure ids, the structures returned by a search query, or every
 * structure of a corporation.
 *
 * All structure queries require an authenticated request, and many are
 * associated with either authenticated character, or that character's
 * corporation. If accessed from the authenticated corporation API where no
 * specific character was provided to the API, the corporation's CEO will be
 * used. Similarly, if no explicit corporation ID was provided then the
 * character's dynamic corporation ID will be used.
 */
export interface Structures {
  /**
   * Create a new structures api targeting every single structure owned by
   * a corporation, or a character's corporation (assuming they have proper
   * roles).
   *
   * @esi_route ids ~get_corporations_corporation_id_structures
   *
   * @returns An IteratedStructures API wrapper
   */
  (): IteratedStructures;

  /**
   * Create a new structure api targeting the particular structure by `id`.
   *
   * @param id The structure id
   * @returns An Structure API wrapper for the given id
   */
  (id: number): Structure;

  /**
   * Create a new structure api targeting the multiple structure ids. If an
   * array is provided, duplicates are removed (although the input array
   * is not modified).
   *
   * @param ids The structure ids
   * @returns A MappedStructures API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedStructures;

  /**
   * Create a new structure api targeting the structures returned from a
   * search given the `query` text. The available structures are determined
   * by the character, or CEO of the corporation.
   *
   * @esi_route ids get_characters_character_id_search [structure]
   *
   * @param query The search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns A MappedStructures API which accesses structures based on the
   *    dynamic search results
   */
  (query: string, strict?: boolean): MappedStructures;
}

/**
 * Create a new {@link Structures} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * At least one of `charID` or `corpID` must be defined.
 *
 * @param agent The agent used to access information
 * @param ssoToken The authenticating token
 * @param charID The optional character ID used with certain requests, if not
 *     provided, the CEO of the corporation is used
 * @param corpID The optional corporation ID used with certain requests, if not
 *    provided, the character's corp is used
 * @returns An Mail API instance
 */
export function makeStructures(agent: ESIAgent, ssoToken: string,
    charID?: number | r.impl.IDProvider,
    corpID?: number | r.impl.IDProvider): Structures {
  const charAndCorp = new CharAndCorpAgent(agent, ssoToken, charID, corpID);
  const structSearch = makeCharacterSearch(charAndCorp.charSSOAgent(),
      esi.character.SearchCategory.STRUCTURE);

  return <Structures> function (ids: number | number[] | Set<number> | string | undefined,
      strict: boolean = false) {
    if (ids === undefined) {
      // No argument
      return new IteratedStructures(agent, ssoToken, charID, corpID);
    } else if (typeof ids === 'number') {
      // Single id variant
      return new Structure(agent, ssoToken, ids, charID, corpID);
    } else if (typeof ids === 'string') {
      // Search variant that uses the IDSetProvider variant
      return new MappedStructures(agent, ssoToken,
          () => structSearch(ids, strict), charID, corpID);
    } else {
      // Either a set or an array
      return new MappedStructures(agent, ssoToken, ids, charID, corpID);
    }
  };
}

class CharAndCorpAgent {
  constructor(readonly agent: ESIAgent, readonly ssoToken: string,
      private charID_?: number | r.impl.IDProvider,
      private corpID_?: number | r.impl.IDProvider) {

  }

  charSSOAgent(): SSOAgent<number | r.impl.IDProvider> {
    if (typeof this.charID_ === 'number') {
      return { agent: this.agent, ssoToken: this.ssoToken, id: this.charID_ };
    } else {
      return {
        agent: this.agent, ssoToken: this.ssoToken, id: () => this.charID()
      };
    }
  }

  corpSSOAgent(): SSOAgent<number | r.impl.IDProvider> {
    if (typeof this.corpID_ === 'number') {
      return { agent: this.agent, ssoToken: this.ssoToken, id: this.corpID_ };
    } else {
      return {
        agent: this.agent, ssoToken: this.ssoToken, id: () => this.corpID()
      };
    }
  }

  async charID(): Promise<number> {
    if (this.charID_ === undefined) {
      // Must get it from corporation
      let corp = await this.corpID();
      return this.agent.request('get_corporations_corporation_id',
          { path: { corporation_id: corp } }).then(details => details.ceo_id);
    } else if (typeof this.charID_ === 'number') {
      return Promise.resolve(this.charID_);
    } else {
      return this.charID_();
    }
  }

  async corpID(): Promise<number> {
    if (this.corpID_ === undefined) {
      // Must get it from the character
      let char = await this.charID();
      return this.agent.request('get_characters_character_id',
          { path: { character_id: char } })
      .then(details => details.corporation_id);
    } else if (typeof this.corpID_ === 'number') {
      return Promise.resolve(this.corpID_);
    } else {
      return this.corpID_();
    }
  }
}

class StructureMarket implements Market {
  private orders_?: r.impl.ResourceStreamer<esi.market.Order>;

  // Agent's ID corresponds to structure id, not a character or corporation
  constructor(private agent: SSOAgent<number>) {

  }

  orders() {
    if (this.orders_ === undefined) {
      this.orders_ = r.impl.makePageBasedStreamer(
          page => this.getOrdersPage(page), 5000);
    }
    return this.orders_();
  }

  private getOrdersPage(page: number) {
    return this.agent.agent.request('get_markets_structures_structure_id',
        { path: { structure_id: this.agent.id }, query: { page: page } },
        this.agent.ssoToken).then(result => ({ result, maxPages: undefined }));
  }

  buyOrdersFor(typeID: number) {
    return this.getOrdersFor(typeID, 'buy');
  }

  sellOrdersFor(typeID: number) {
    return this.getOrdersFor(typeID, 'sell');
  }

  ordersFor(typeID: number) {
    return this.getOrdersFor(typeID, 'all');
  }

  private async getOrdersFor(typeID: number,
      orderType: 'buy' | 'sell' | 'all') {
    let orders = [];
    for await (let o of this.orders()) {
      if (typeID === o.type_id && (orderType === 'all' || (orderType === 'buy'
              && o.is_buy_order) || (orderType === 'sell'
              && !o.is_buy_order))) {
        // Order passes type id and order type filters
        orders.push(o);
      }
    }

    return orders;
  }

  async * types() {
    let seen = new Set();
    for await (let o of this.orders()) {
      let typeID = o.type_id;
      if (!seen.has(typeID)) {
        seen.add(typeID);
        yield typeID;
      } // otherwise skip it
    }
  }
}

function getStructure(agent: SSOAgent<number>) {
  return agent.agent.request('get_universe_structures_structure_id',
      { path: { structure_id: agent.id } }, agent.ssoToken);
}

function getCorpStructures(agent: CharAndCorpAgent): r.impl.ResourceStreamer<esi.corporation.structure.Structure> {
  return r.impl.makePageBasedStreamer(
      page => getCorpStructuresPage(agent, page), 250);
}

async function getCorpStructuresPage(agent: CharAndCorpAgent, page: number) {
  let corpID = await agent.corpID();
  return agent.agent.request('get_corporations_corporation_id_structures',
      { path: { corporation_id: corpID }, query: { page: page } },
      agent.ssoToken).then(result => ({ result, maxPages: undefined }));
}
