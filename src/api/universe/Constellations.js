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
   * Get information on the constellation from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`universe/constellations/{id}/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Universe/get_universe_constellations_constellation_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "constellation_id": 20000009,
   *   "name": "Mekashtad",
   *   "position": {
   *     "x": 67796138757472320,
   *     "y": -70591121348560960,
   *     "z": -59587016159270070
   *   },
   *   "region_id": 10000001,
   *   "systems": [
   *     20000302,
   *     20000303
   *   ]
   * }
   * ```
   *
   * @returns {Promise}
   * @esi_link UniverseApi.getUniverseConstellationsConstellationId
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
   * Get all constellation ids from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`universe/constellations/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Universe/get_universe_constellations).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   20000001,
   *   20000002
   * ]
   * ```
   *
   * @returns {Promise}
   * @esi_link UniverseApi.getUniverseConstellations
   */
  all() {
    return this._api.universe().newRequest('getUniverseConstellations', []);
  }

  /**
   * Get the names for a list of constellation ids from the ESI endpoint. This
   * makes an HTTP POST request to
   * [`universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 1000171,
   *     "name": "Republic University"
   *   }
   * ]
   * ```
   *
   * Note that this has the category field stripped from the response and will
   * only include matches with the constellation category.
   *
   * @param {Array.<Number>} ids Optional; the constellation ids to look up. If
   *     not provided then the names of all constellations will be returned.
   * @return {Promise} A Promise that resolves to the response of
   *     the request
   * @esi_link UniverseApi.postUniverseNames
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
