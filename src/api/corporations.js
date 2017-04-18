const CallableInstance = require('../internal/callable-instance');
const Search = require('./search');

const _names = require('../internal/names');

/**
 * An api adapter that provides functions for accessing various details for a
 * corporation specified by id via functions in the
 * [corporation](https://esi.tech.ccp.is/latest/#/Corporation) ESI endpoints.
 * This only includes the non-authenticated corporation end points.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance. This does not include functions that require a
 * character's authorization.
 */
class Corporation {
  /**
   * Create a new Corporation for the given `agent` provider and specific
   * `corporationId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param corporationId {Number} The corporation id that is used for all
   *     requests
   * @constructor
   */
  constructor(agent, corporationId) {
    this._agent = agent;
    this._id = corporationId;
  }

  /**
   * @esi_route get_corporations_corporation_id
   * @esi_example esi.corporations(1).info()
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v2/corporations/{corporation_id}/',
        { path: { 'corporation_id': this._id } });
  }

  /**
   * @esi_route get_corporations_corporation_id_alliancehistory
   * @esi_example esi.corporations(1).history()
   *
   * @return {Promise.<Array.<Object>>}
   */
  history() {
    return this._agent.noAuth.get(
        '/v1/corporations/{corporation_id}/alliancehistory/',
        { path: { 'corporation_id': this._id } });
  }

  /**
   * @esi_route get_corporations_corporation_id_icons
   * @esi_example esi.corporations(1).icon()
   *
   * @return {Promise.<Object>}
   */
  icon() {
    return this._agent.noAuth.get('/v1/corporations/{corporation_id}/icons/',
        { path: { 'corporation_id': this._id } });
  }

  /**
   * @esi_route get_loyalty_stores_corporation_id_offers
   * @esi_example esi.corporations(1).loyaltyOffers()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  loyaltyOffers() {
    return this._agent.noAuth.get('/v1/loyalty/stores/{corporation_id}/offers/',
        { path: { 'corporation_id': this._id } });
  }
}

/**
 * An api adapter over the end points handling multiple corporations  via
 * functions in the [corporation](https://esi.tech.ccp.is/latest/#/Corporation)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Corporations` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Corporations#get get}.
 */
class Corporations extends CallableInstance {
  /**
   * Create a new Corporations function using the given `api`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => this.get(id));
    this._agent = agent;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'corporation'`
   * type.
   *
   * @esi_example esi.corporations.search('text') categories=[corporation] get_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['corporation']);
    }
    return this._search;
  }

  /**
   * Create a new Corporation end point targeting the particular corporation by
   * `id`.
   *
   * @param id {Number} The corporation id
   * @returns {Corporation}
   */
  get(id) {
    return new Corporation(this._agent, id);
  }

  /**
   * @esi_route get_corporations_npccorps
   * @esi_example esi.corporations.npc()
   *
   * @return {Promise.<Array.<Number>>}
   */
  npc() {
    return this._agent.noAuth.get('/v1/corporations/npccorps/');
  }

  /**
   * @esi_route get_corporations_names
   * @esi_param corporation_ids - ids
   * @esi_returns {corporation_id: id, corporation_name: name}
   * @esi_example esi.corporations.names()
   *
   * @param {Array.<Number>} ids
   * @return {Promise.<Array.<Object>>}
   */
  names(ids) {
    if (ids.length > 20) {
      // Use universe/names end point since the /corporations one breaks if
      // the URL gets too long.
      return _names(this._agent, 'corporation', ids);
    } else {
      // Use alliance/names end point and
      return this._agent.noAuth.get('/v1/corporations/names/',
          { query: { 'corporation_ids': ids } })
      .then(result => {
        // Rename corporation_id and corporation_name
        return result.map(r => {
          return {
            id: r.corporation_id,
            name: r.corporation_name
          };
        });
      });
    }
  }
}

module.exports = Corporations;
