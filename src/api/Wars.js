const Promise = require('bluebird');

const ExtendableFunction = require('../internal/ExtendableFunction');
const [PageHandler, MaxIdHandler] = require('../internal/PageHandler');
const Killmail = require('./Killmail');

/**
 * An api adapter that provides functions for accessing various details for an
 * war specified by id, via functions in the
 * [wars](https://esi.tech.ccp.is/latest/#/Wars) ESI endpoints. You should not
 * usually instantiate this directly as its constructor requires an internal api
 * instance.
 */
class War {
  /**
   * Create a new War for the given `api` provider and specific
   * `warId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param warId {Number} The war id that is used for all requests
   * @constructor
   */
  constructor(api, warId) {
    this._api = api;
    this._id = warId;
    this._kills = null;
    this._allKills = new PageHandler(page => this._fetchKills(page), 2000);
    this._allMails = new PageHandler(page => this._fetchMails(page), 2000);
  }

  /**
   * Get information on a war from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`/wars/{id}/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "aggressor": {
   *     "corporation_id": 986665792,
   *     "isk_destroyed": 0,
   *     "ships_killed": 0
   *   },
   *   "declared": "2004-05-22T05:20:00Z",
   *   "defender": {
   *     "corporation_id": 1001562011,
   *     "isk_destroyed": 0,
   *     "ships_killed": 0
   *   },
   *   "id": 1941,
   *   "mutual": false,
   *   "open_for_allies": false
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id
   * @esi_link WarsApi.getWarsWarId
   */
  info() {
    return this._api.wars().newRequest('getWarsWarId', [this._id]);
  }

  /**
   * Get the kill details for the given `page` of killmails. This fetches the
   * killmails and then uses {@link Killmail.get} to map the details. The
   * request resolves to an array, each containing a killmail detail:
   *
   * ```
   * [
   *   {
   *     "attackers": [
   *       {
   *         "character_id": 95810944,
   *         "corporation_id": 1000179,
   *         "damage_done": 5745,
   *         "faction_id": 500003,
   *         "final_blow": true,
   *         "security_status": -0.3,
   *         "ship_type_id": 17841,
   *         "weapon_type_id": 3074
   *       }
   *     ],
   *     "killmail_id": 56733821,
   *     "killmail_time": "2016-10-22T17:13:36Z",
   *     "solar_system_id": 30002976,
   *     "victim": {
   *       "alliance_id": 621338554,
   *       "character_id": 92796241,
   *       "corporation_id": 841363671,
   *       "damage_taken": 5745,
   *       "items": [
   *         {
   *           "flag": 20,
   *           "item_type_id": 5973,
   *           "quantity_dropped": 1,
   *           "singleton": 0
   *         }
   *       ],
   *       "position": {
   *         "x": 452186600569.4748,
   *         "y": 146704961490.90222,
   *         "z": 109514596532.54477
   *       },
   *       "ship_type_id": 17812
   *     }
   *   }
   * ]
   * ```
   *
   * @param page {Number} Optional; the page of killmails to fetch, starting
   *     with page 1. If not provided then all kills are returned.
   * @returns {Promise}
   */
  kills(page = 0) {
    if (page == 0) {
      return this._allKills.getAll();
    } else {
      return this._fetchKills(page);
    }
  }

  _fetchKills(page) {
    if (this._kills == null) {
      this._kills = new Killmail(this._api);
    }

    return this.killmails(page).then(kms => {
      return Promise.map(kms,
          km => this._kills.get(km.killmail_id, km.killmail_hash));
    });
  }

  /**
   * Get killmail ids and hashes from a war from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`/wars/{id}/killmails/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id_killmails).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "killmail_hash": "8eef5e8fb6b88fe3407c489df33822b2e3b57a5e",
   *     "killmail_id": 2
   *   },
   *   {
   *     "killmail_hash": "b41ccb498ece33d64019f64c0db392aa3aa701fb",
   *     "killmail_id": 1
   *   }
   * ]
   * ```
   *
   * @param page {Number} Optional; the page of killmails to fetch, starting
   *     with page 1. If not provided then all mails are returned.
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Wars/get_wars_war_id_killmails
   * @see module:killmails
   * @esi_link WarsApi.getWarsWarIdKillmails
   */
  killmails(page = 0) {
    if (page == 0) {
      return this._allMails.getAll();
    } else {
      return this._fetchMails(page);
    }
  }

  _fetchMails(page) {
    return this._api.wars()
    .newRequest('getWarsWarIdKillmails', [this._id], { page: page });
  }
}

/**
 * An api adapter over the end points handling multiple wars via functions in
 * the [wars](https://esi.tech.ccp.is/latest/#/Wars) ESI endpoints. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 *
 * This is a function class so instances of `Wars` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Wars#get get} or {@link Wars#recent recent} if no id
 * is provided.
 */
class Wars extends ExtendableFunction {
  /**
   * Create a new Wars function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => (id ? this.get(id) : this.recent()));
    this._api = api;
    this._allWars = new MaxIdHandler(maxId => this.recent(maxId),
        war => war.war_id, 2000);
  }

  /**
   * Create a new War end point targeting the particular war by `id`.
   *
   * @param id {Number} The war id
   * @returns {War}
   */
  get(id) {
    return new War(this._api, id);
  }

  /**
   * Get the latest war ids from the ESI endpoint. This makes an HTTP GET
   * request to [`/wars/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars). The
   * request is returned as an asynchronous Promise that resolves to an array
   * parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   3,
   *   2,
   *   1
   * ]
   * ```
   *
   * Up to 2000 wars are returned per request.
   *
   * @param maxId {Number} Optional; the maximum war id for the request, only
   *     wars smaller than this are returned. If not provided, the newest wars
   *     are returned
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link WarsApi.getWars
   */
  recent(maxId = 0) {
    let opts = {};
    if (maxId) {
      opts.max_war_id = maxId;
    }
    return this._api.wars().newRequest('getWars', [], opts);
  }

  /**
   * Get all war ids, making repeated HTTP GET requests to
   * [`/wars/`](https://esi.tech.ccp.is/latest/#!/Wars/get_wars).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   3,
   *   2,
   *   1
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link WarsApi.getWars
   */
  all() {
    return this._allWars.getAll();
  }
}


module.exports = Wars;
