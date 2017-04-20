const Search = require('../search');

const CallableInstance = require('../../internal/callable-instance');
const _names = require('../../internal/names');

/**
 * An api adapter that provides functions for accessing various details for a
 * constellation specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Constellation {
  /**
   * Create a new Constellation for the given `agent` provider and specific
   * `constellationId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param constellationId {Number} The constellation id that is used for all
   *     requests
   * @constructor
   */
  constructor(agent, constellationId) {
    this._agent = agent;
    this._id = constellationId;
  }

  /**
   * @esi_route get_universe_constellations_constellation_id
   * @esi_example esi.constellations(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get(
        '/v1/universe/constellations/{constellation_id}/',
        { path: { 'constellation_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing constellation
 * information via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Constellations` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Constellations#get get} or {@link
    * Constellations#all all} if no id is provided.
 */
class Constellations extends CallableInstance {
  /**
   * Create a new Constellations instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => (id ? this.get(id) : this.all()));
    this._agent = agent;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'constellation'`
   * type.
   *
   * @esi_example esi.constellations.search('text') category=[constellation] get_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['constellation']);
    }
    return this._search;
  }

  /**
   * Create a new Constellation end point targeting the particular constellation
   * by `id`.
   *
   * @param id {Number} The constellation id
   * @returns {Constellation}
   */
  get(id) {
    return new Constellation(this._agent, id);
  }

  /**
   * @esi_route get_universe_constellations
   * @esi_example esi.constellations()
   *
   * @return {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/universe/constellations/');
  }

  /**
   * @esi_route post_universe_names
   *
   * The results will only include matches with the constellation category.
   * If `ids` is longer than the reported maximum length for ESI, the array
   * will be split into smaller chunks and multiple requests will be made and
   * then concatenated back together.
   *
   * @esi_returns {!category}
   * @esi_example esi.constellations.names() category=[constellation]
   *
   * @param {Array.<Number>} ids If no ids are provided, then all names are
   *     returned.
   * @return {Promise.<Array.<Object>>}
   */
  names(ids = []) {
    if (!ids || ids.length == 0) {
      return this.all().then(allIds => this.names(allIds));
    } else {
      return _names(this._agent, 'constellation', ids);
    }
  }
}

module.exports = Constellations;
