const Search = require('../Search');

const ExtendableFunction = require('../../internal/ExtendableFunction');
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
   * Create a new Constellation for the given `api` provider and specific
   * `constellationId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param constellationId {Number} The constellation id that is used for all
   *     requests
   * @constructor
   */
  constructor(api, constellationId) {
    this._api = api;
    this._id = constellationId;
  }

  /**
   * @esi_route get_universe_constellations_constellation_id
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._api.universe()
    .newRequest('getUniverseConstellationsConstellationId', [this._id]);
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
class Constellations extends ExtendableFunction {
  /**
   * Create a new Constellations instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => (id ? this.get(id) : this.all()));
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'constellation'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['constellation']);
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
    return new Constellation(this._api, id);
  }

  /**
   * @esi_route get_universe_constellations
   *
   * @return {Promise.<Array.<Number>>}
   */
  all() {
    return this._api.universe().newRequest('getUniverseConstellations', []);
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
   *
   * @param {Array.<Number>} ids If no ids are provided, then all names are
   *     returned.
   * @return {Promise.<Array.<Object>>}
   */
  names(ids = []) {
    if (!ids || ids.length == 0) {
      return this.all().then(allIds => this.names(allIds));
    } else {
      return _names(this._api, 'constellation', ids);
    }
  }
}

module.exports = Constellations;
