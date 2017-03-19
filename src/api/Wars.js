const Promise = require('bluebird');

const ExtendableFunction = require('../internal/ExtendableFunction');
const [PageHandler,] = require('../internal/PageHandler');
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
   * @esi_route get_wars_war_id
   *
   * @return {Promise.<Object>} A Promise that resolves to the response of
   *   the request
   */
  info() {
    return this._api.wars().newRequest('getWarsWarId', [this._id]);
  }

  /**
   * Get the kill details for the war's {@link War#killmails
   * killmails} and then uses {@link Killmail#get} to map the details.
   * The request resolves to an array, each containing a killmail detail.
   *
   * @param page {Number} Optional; the page of killmails to fetch, starting
   *     with page 1. If not provided then all kills are returned.
   * @returns {Promise.<Array.<Object>>}
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
   * @esi_route get_wars_war_id_killmails
   *
   * @param page {Number} If 0, then all pages are fetched and concatenated
   *     together
   * @return {Promise.<Array.<Object>>}
   * @see Killmail#get
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
   * @esi_route get_wars
   * @esi_param max_war_id - maxId
   *
   * @param maxId {Number} If not provided (or 0), the newest wars are returned
   * @return {Promise.<Array.<Number>>}
   */
  recent(maxId = 0) {
    let opts = {};
    if (maxId) {
      opts.max_war_id = maxId;
    }
    return this._api.wars().newRequest('getWars', [], opts);
  }
}

module.exports = Wars;
