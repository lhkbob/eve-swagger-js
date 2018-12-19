import { getNames } from '../internal/names';
import { makeDefaultSearch, Search } from '../internal/search';
import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../../gen/esi';

/**
 * An api adapter that provides functions for accessing various details of an
 * alliance specified by id, via functions in the
 * [alliance](https://esi.evetech.net/latest/#/Alliance) ESI endpoints.
 */
export interface Alliance {
  /**
   * @esi_example esi.alliances(id).info()
   * @returns The public info of the alliance
   */
  info(): Promise<Responses['get_alliances_alliance_id']>;

  /**
   * @esi_example esi.alliances(id).corporations()
   * @returns The ids of the corporation members of the alliance
   */
  corporations(): Promise<Responses['get_alliances_alliance_id_corporations']>;

  /**
   * @esi_example esi.alliances(id).icon()
   * @returns URL lookup information for the alliance icon images
   */
  icon(): Promise<Responses['get_alliances_alliance_id_icons']>;

  /**
   * @returns The id of this alliance
   */
  id(): Promise<number>;
}

/**
 * An api adapter over the end points handling multiple alliances via functions
 * in the [alliance](https://esi.evetech.net/latest/#/Alliance) ESI endpoints.
 */
export interface Alliances {
  /**
   * @esi_example esi.alliances()
   *
   * @returns All alliance ids
   */
  (): Promise<Responses['get_alliances']>;

  /**
   * Create a new Alliance end point targeting the particular alliance by `id`.
   *
   * @param id The alliance id
   * @returns An Alliance API wrapper for the given id
   */
  (id: number): Alliance;

  /**
   * A Search module instance configured to search over the `'alliance'`
   * type.
   *
   * @esi_route get_search [alliance]
   * @esi_example esi.alliances.search('text')
   */
  search: Search;

  /**
   * @esi_route get_alliances_names
   * @esi_route post_universe_names [alliance]
   * @esi_example esi.alliances.names(ids)
   *
   * @param ids If not provided then the names of all alliances will be
   *     returned.
   * @returns Map from queried id to returned alliance name
   */
  names(ids?: number[]): Promise<Map<number, string>>;
}

/**
 * Create a new {@link Alliances} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Alliances API instance
 */
export function makeAlliances(agent: ESIAgent): Alliances {
  let functor = <Alliances> <any> function (id?: number) {
    if (id !== undefined) {
      return new AllianceImpl(agent, id);
    } else {
      return agent.request('get_alliances', undefined);
    }
  };

  functor.search = makeDefaultSearch(agent, esi.SearchCategory.ALLIANCE);
  functor.names = function (ids?: number[]) {
    if (ids === undefined) {
      return functor().then(allIds => functor.names(allIds));
    } else if (ids.length > 100) {
      return getNames(agent, esi.universe.NameCategory.ALLIANCE, ids);
    } else {
      return agent.request('get_alliances_names',
          { query: { 'alliance_ids': ids } })
      .then(result => {
        let map = new Map();
        for (let r of result) {
          map.set(r.alliance_id, r.alliance_name);
        }
        return map;
      });
    }
  };

  return functor;
}

class AllianceImpl implements Alliance {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_alliances_alliance_id',
        { path: { 'alliance_id': this.id_ } });
  }

  corporations() {
    return this.agent.request('get_alliances_alliance_id_corporations',
        { path: { 'alliance_id': this.id_ } });
  }

  icon() {
    return this.agent.request('get_alliances_alliance_id_icons',
        { path: { 'alliance_id': this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}