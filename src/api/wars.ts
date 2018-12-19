import { ESIAgent } from '../internal/esi-agent';
import { PaginatedLoader, makePageBasedLoader } from '../internal/page-loader';
import { Responses, esi } from '../../gen/esi';
import { Killmail, makeKillmail } from './killmail';

/**
 * An api adapter that provides functions for accessing various details for an
 * war specified by id, via functions in the
 * [wars](https://esi.evetech.net/latest/#/Wars) ESI endpoints.
 */
export interface War {
  /**
   * @esi_route get_wars_war_id
   * @esi_example esi.wars(1).info()
   *
   * @return {Promise.<Object>} A Promise that resolves to the response of
   *   the request
   */
  info(): Promise<Responses['get_wars_war_id']>;

  /**
   * Get the kill details for the war's {@link War#killmails
   * killmails} and then uses {@link Killmail#get} to map the details.
   * The request resolves to an array, each containing a killmail detail.
   *
   * @esi_route get_wars_war_id_killmails
   * @esi_example esi.wars(id).kills()
   *
   * @param page Optional; the page of killmails to fetch, starting
   *     with page 1. If not provided then all kills are returned.
   * @returns {Promise.<Array.<Object>>}
   */
  kills(page?: number): Promise<esi.killmail.Killmail[]>;

  /**
   * @esi_example esi.wars(id).killmails()
   *
   * @param page If undefined, then all pages are fetched and concatenated
   *     together, otherwise the specific page
   * @returns A page of killmail links from the war
   */
  killmails(page?: number): Promise<Responses['get_wars_war_id_killmails']>;

  /**
   * @returns The war's id
   */
  id(): Promise<number>;
}

/**
 * An api adapter over the end points handling multiple wars via functions in
 * the [wars](https://esi.evetech.net/latest/#/Wars) ESI endpoints.
 */
export interface Wars {
  /**
   * Get the most recent wars. This is equivalent to calling {@link #recent()}
   * without any max ID.
   *
   * @esi_example esi.wars()
   *
   * @return An array of war IDs ordered chronologically from newest to oldest
   */
  (): Promise<Responses['get_wars']>;

  /**
   * Create a new War end point targeting the particular war by `id`.
   *
   * @param id The war id
   * @returns A War API wrapper for the given war
   */
  (id: number): War;

  /**
   * Note that due to the large number of wars in Eve, and its unbounded
   * nature, there is no utility function provided to fetch all war IDs.
   *
   * @esi_example esi.wars.recent()
   *
   * @param maxId If not provided, the newest wars are returned
   * @return An array of war IDs ordered chronologically from newest to oldest
   */
  recent(maxId?: number): Promise<Responses['get_wars']>;
}

/**
 * Create a new {@link Wars} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Wars API instance
 */
export function makeWars(agent: ESIAgent): Wars {
  const killmailApi = makeKillmail(agent);
  let functor = <Wars> <any> function (id?: number) {
    if (id !== undefined) {
      return new WarImpl(agent, id, killmailApi);
    } else {
      return functor.recent();
    }
  };
  functor.recent = function (maxId?: number) {
    return agent.request('get_wars', { query: { max_war_id: maxId } });
  };
  return functor;
}

class WarImpl implements War {
  private allMails: PaginatedLoader<esi.killmail.KillmailLink>;
  private allKills: PaginatedLoader<esi.killmail.Killmail>;

  constructor(private agent: ESIAgent, private id_: number,
      private killmailAPI: Killmail) {
    this.allKills = makePageBasedLoader(page => this.kills(page), 2000);
    this.allMails = makePageBasedLoader(page => this.killmails(page), 2000);
  }

  info() {
    return this.agent.request('get_wars_war_id',
        { path: { war_id: this.id_ } });
  }

  kills(page?: number) {
    if (page === undefined) {
      return this.allKills.getAll();
    } else {
      return this.killmails(page)
      .then(kms => Promise.all(
          kms.map(km => this.killmailAPI(km.killmail_id, km.killmail_hash))));
    }
  }

  killmails(page?: number) {
    if (page === undefined) {
      return this.allMails.getAll();
    } else {
      return this.agent.request('get_wars_war_id_killmails',
          { path: { war_id: this.id_ }, query: { page: page } });
    }
  }

  id() {
    return Promise.resolve(this.id_);
  }
}
