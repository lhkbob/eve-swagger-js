const Promise = require('bluebird');

const CallableInstance = require('../internal/callable-instance');
const [PageHandler,] = require('../internal/page-handler');
const Killmail = require('./killmail');

/**
 * An api adapter that provides functions for accessing various details for an
 * war specified by id, via functions in the
 * [wars](https://esi.tech.ccp.is/latest/#/Wars) ESI endpoints. You should not
 * usually instantiate this directly as its constructor requires an internal api
 * instance.
 */
class War {
  /**
   * Create a new War for the given `agent` provider and specific
   * `warId`.
   *
   * @param agent {ESIAgent} The ESI agent used to generate web requests
   * @param warId {Number} The war id that is used for all requests
   * @constructor
   */
  constructor(agent, warId) {
    this._agent = agent;
    this._id = warId;
    this._kills = null;
    this._allKills = new PageHandler(page => this._fetchKills(page), 2000);
    this._allMails = new PageHandler(page => this._fetchMails(page), 2000);
  }

  /**
   * @esi_route get_wars_war_id
   * @esi_example esi.wars(1).info()
   *
   * @return {Promise.<Object>} A Promise that resolves to the response of
   *   the request
   */
  info() {
    return this._agent.noAuth.get('/v1/wars/{war_id}/',
        { path: { 'war_id': this._id } });
  }

  /**
   * Get the kill details for the war's {@link War#killmails
   * killmails} and then uses {@link Killmail#get} to map the details.
   * The request resolves to an array, each containing a killmail detail.
   *
   * @esi_example esi.wars(1).kills() ~ get_wars_war_id_killmails
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
      this._kills = new Killmail(this._agent);
    }

    return this.killmails(page).then(kms => {
      return Promise.map(kms,
          km => this._kills.get(km.killmail_id, km.killmail_hash));
    });
  }

  /**
   * @esi_route get_wars_war_id_killmails
   * @esi_example esi.wars(1).killmails()
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
    return this._agent.noAuth.get('/v1/wars/{war_id}/killmails/', {
      path: { 'war_id': this._id },
      query: { 'page': page }
    });
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
class Wars extends CallableInstance {
  /**
   * Create a new Wars function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => (id ? this.get(id) : this.recent()));
    this._agent = agent;
  }

  /**
   * Create a new War end point targeting the particular war by `id`.
   *
   * @param id {Number} The war id
   * @returns {War}
   */
  get(id) {
    return new War(this._agent, id);
  }

  /**
   * @esi_route get_wars
   * @esi_param max_war_id - maxId
   * @esi_example esi.wars.recent()
   *
   * @param maxId {Number} If not provided (or 0), the newest wars are returned
   * @return {Promise.<Array.<Number>>}
   */
  recent(maxId = 0) {
    return this._agent.noAuth.get('/v1/wars/',
        { query: { 'max_war_id': maxId == 0 ? null : maxId } });
  }
}

module.exports = Wars;
