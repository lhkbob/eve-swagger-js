import { getNames } from '../../internal/names';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * corporation or multiple corporations. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all corporations.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple corporations are being accessed at once.
 *
 * This is an API wrapper over the end points handling corporations via
 * functions in the [corporation](https://esi.tech.ccp.is/latest/#/Corporations)
 * ESI endpoints.
 */
export interface CorporationAPI {
  details: Responses['get_corporations_corporation_id'];
  history: Responses['get_corporations_corporation_id_alliancehistory'];
  icons: Responses['get_corporations_corporation_id_icons'];
  loyaltyOffers: Responses['get_loyalty_stores_corporation_id_offers'];
  names: string;
}

/**
 * An api adapter for accessing various details of a single corporation,
 * specified by a provided id when the api is instantiated.
 */
export class Corporation extends r.impl.SimpleResource implements r.Async<CorporationAPI> {
  constructor(private agent: ESIAgent, id_: number) {
    super(id_);
  }

  /**
   * @esi_example esi.corporations(id).details()
   *
   * @returns The public info of the corporation
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @esi_example esi.corporations(id).history()
   *
   * @returns The alliance history of the corporation
   */
  history() {
    return getHistory(this.agent, this.id_);
  }

  /**
   * @esi_example esi.corporations(id).icons()
   *
   * @returns URL lookup information for the corporation icon images
   */
  icons() {
    return getIcons(this.agent, this.id_);
  }

  /**
   * @esi_example esi.corporations(id).loyaltyOffers()
   *
   * @returns Loyalty offers available for the NPC corporation
   */
  loyaltyOffers() {
    return getLoyaltyOffers(this.agent, this.id_);
  }

  /**
   * @esi_example esi.corporations(id).names()
   * @esi_route ~get_corporations_corporation_id
   *
   * @returns The name of the corporation
   */
  names() {
    return this.details().then(result => result.corporation_name);
  }
}

/**
 * An api adapter for accessing various details of multiple corporations,
 * specified by a provided an array, set of ids, search query, or NPC
 * corporations when the api is instantiated.
 *
 * @esi_route ids get_search [corporation]
 * @esi_route ids get_corporations_npccorps
 */
export class MappedCorporations extends r.impl.SimpleMappedResource implements r.Mapped<CorporationAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @esi_example esi.corporations([ids]|'search').details()
   *
   * @returns The public details of the corporations, mapped by their id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @esi_example esi.corporations([ids]|'search').history()
   *
   * @returns The alliance history of the corporations, mapped by their id
   */
  history() {
    return this.getResource(id => getHistory(this.agent, id));
  }

  /**
   * @esi_example esi.corporations([ids]|'search').icons()
   *
   * @returns The icons of the corporations, mapped by their id
   */
  icons() {
    return this.getResource(id => getIcons(this.agent, id));
  }

  /**
   * @esi_example esi.corporations.npcs().loyaltyOffers()
   *
   * @returns The loyalty offers for the corporations, mapped by their id
   */
  loyaltyOffers() {
    return this.getResource(id => getLoyaltyOffers(this.agent, id));
  }

  /**
   * @esi_example esi.corporations([ids]|'search').names()
   * @esi_route post_universe_names [corporation]
   * @esi_route get_corporations_names
   *
   * @returns Map from corporation id to their name
   */
  names() {
    return this.arrayIDs().then(ids => {
      if (ids.length > 100) {
        return getNames(this.agent, esi.universe.NameCategory.CORPORATION, ids);
      } else {
        return this.agent.request('get_corporations_names',
            { query: { 'corporation_ids': ids } })
        .then(results => {
          let map = new Map();
          for (let r of results) {
            map.set(r.corporation_id, r.corporation_name);
          }
          return map;
        });
      }
    });
  }
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_corporations_corporation_id',
      { path: { corporation_id: id } });
}

function getHistory(agent: ESIAgent, id: number) {
  return agent.request('get_corporations_corporation_id_alliancehistory',
      { path: { corporation_id: id } });
}

function getIcons(agent: ESIAgent, id: number) {
  return agent.request('get_corporations_corporation_id_icons',
      { path: { corporation_id: id } });
}

function getLoyaltyOffers(agent: ESIAgent, id: number) {
  return agent.request('get_loyalty_stores_corporation_id_offers',
      { path: { corporation_id: id } });
}
