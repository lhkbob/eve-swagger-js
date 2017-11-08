import { getNames, getIteratedNames } from '../internal/names';
import { makeDefaultSearch } from '../internal/search';
import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';

import * as r from '../internal/resource-api';

/**
 * The API specification for all variants that access information about an
 * alliance or multiple alliances. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all alliances.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple alliances are being accessed at once.
 *
 * This is an API wrapper over the end points handling alliances via functions
 * in the [alliance](https://esi.tech.ccp.is/latest/#/Alliance) ESI endpoints.
 */
export interface AllianceAPI {
  details: Responses['get_alliances_alliance_id'];
  corporations: Responses['get_alliances_alliance_id_corporations'];
  icons: Responses['get_alliances_alliance_id_icons'];
  names: string;
}

/**
 * An api adapter for accessing various details of a single alliance, specified
 * by a provided id when the api is instantiated.
 */
export class Alliance extends r.impl.SimpleResource implements r.Async<AllianceAPI> {
  constructor(private agent: ESIAgent, id_: number) {
    super(id_);
  }

  /**
   * @returns The public info of the alliance
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @returns The ids of the corporation members of the alliance
   */
  corporations() {
    return getCorporations(this.agent, this.id_);
  }

  /**
   * @returns URL lookup information for the alliance icon images
   */
  icons() {
    return getIcons(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_alliances_alliance_id
   *
   * @returns The name of the alliance
   */
  names() {
    return this.details().then(info => info.alliance_name);
  }
}

/**
 * An api adapter for accessing various details of multiple alliance, specified
 * by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
export class MappedAlliances extends r.impl.SimpleMappedResource implements r.Mapped<AllianceAPI> {
  constructor(private agent: ESIAgent,
      ids: number[] | Set<number> | r.impl.IDSetProvider) {
    super(ids);
  }

  /**
   * @returns Map from alliance id to their details
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @returns Map from alliance id to their corporation members
   */
  corporations() {
    return this.getResource(id => getCorporations(this.agent, id));
  }

  /**
   * @returns Map from alliance id to their icon information
   */
  icons() {
    return this.getResource(id => getIcons(this.agent, id));
  }

  /**
   * @esi_route post_universe_names [alliance]
   * @esi_route get_alliances_names
   *
   * @returns Map from alliance id to their name
   */
  names() {
    return this.arrayIDs().then(ids => {
      if (ids.length > 100) {
        return getNames(this.agent, esi.universe.NameCategory.ALLIANCE, ids);
      } else {
        return this.agent.request('get_alliances_names',
            { query: { 'alliance_ids': ids } })
        .then(result => {
          let map = new Map();
          for (let r of result) {
            map.set(r.alliance_id, r.alliance_name);
          }
          return map;
        });
      }
    });
  }
}

/**
 * An api adapter for accessing various details about every alliance in the
 * game. Even though a route exists to get all alliance ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class IteratedAlliances extends r.impl.SimpleIteratedResource<number> implements r.Iterated<AllianceAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(
        () => this.agent.request('get_alliances', undefined)), id => id);
  }

  /**
   * @returns Iterator for details of every alliance
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }

  /**
   * @returns Iterator for the member corporations of every alliance
   */
  corporations() {
    return this.getResource(id => getCorporations(this.agent, id));
  }

  /**
   * @returns Iterator for the icon information of every alliance
   */
  icons() {
    return this.getResource(id => getIcons(this.agent, id));
  }

  /**
   * @esi_route post_universe_names [alliance]
   *
   * @returns Iterator for the names of every alliance
   */
  names() {
    return getIteratedNames(this.agent, esi.universe.NameCategory.ALLIANCE,
        this.ids());
  }
}

/**
 * A functional interface for getting APIs for a specific alliance, a known
 * set of alliance ids, the alliances returned by a search query, or every
 * alliance in the game.
 */
export interface Alliances {
  /**
   * Create a new alliance api targeting every single alliance in the game.
   *
   * @esi_route ids get_alliances
   *
   * @returns An AllAlliances API wrapper
   */
  (): IteratedAlliances;

  /**
   * Create a new alliance api targeting the particular alliance by `id`.
   *
   * @param id The alliance id
   * @returns An Alliance API wrapper for the given id
   */
  (id: number): Alliance;

  /**
   * Create a new alliance api targeting the multiple alliance ids. If an
   * array is provided, duplicates are removed (although the input array
   * is not modified).
   *
   * @param ids The alliance ids
   * @returns A MappedAlliances API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedAlliances;

  /**
   * Create a new alliance api targeting the alliances returned from a
   * search given the `query` text.
   *
   * @esi_route ids get_search [alliance]
   *
   * @param query The search terms
   * @param strict Whether or not the search is strict, defaults to false
   * @returns A MappedAlliances API which accesses alliances based on the
   *    dynamic search results
   */
  (query: string, strict?: boolean): MappedAlliances;
}

/**
 * Create a new alliances API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Alliances
 */
export function makeAlliances(agent: ESIAgent): Alliances {
  // First create a search function for alliances using the agent
  const allianceSearch = makeDefaultSearch(agent, esi.SearchCategory.ALLIANCE);

  return <Alliances> function (ids: number | number[] | Set<number> | string | undefined,
      strict: boolean = false) {
    if (ids === undefined) {
      // No argument
      return new IteratedAlliances(agent);
    } else if (typeof ids === 'number') {
      // Single id variant
      return new Alliance(agent, ids);
    } else if (typeof ids === 'string') {
      // Search variant that uses the IDSetProvider variant
      return new MappedAlliances(agent, () => allianceSearch(ids, strict));
    } else {
      // Either a set or an array
      return new MappedAlliances(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_alliances_alliance_id',
      { path: { 'alliance_id': id } });
}

function getCorporations(agent: ESIAgent, id: number) {
  return agent.request('get_alliances_alliance_id_corporations',
      { path: { 'alliance_id': id } });
}

function getIcons(agent: ESIAgent, id: number) {
  return agent.request('get_alliances_alliance_id_icons',
      { path: { 'alliance_id': id } });
}
