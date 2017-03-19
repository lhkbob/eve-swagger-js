const ExtendableFunction = require('../../internal/ExtendableFunction');
const Search = require('../Search');

const _names = require('../../internal/names');

/**
 * An api adapter for dealing with a single solar system, currently only
 * supporting fetching simple information.
 */
class SolarSystem {
  /**
   * Create a new SolarSystem for the given `api` provider and specific
   * `solarSystemId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param solarSystemId {Number} The system id that is used for all requests
   * @constructor
   */
  constructor(api, solarSystemId) {
    this._api = api;
    this._id = solarSystemId;
  }

  /**
   * @esi_route get_universe_systems_system_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._api.universe()
    .newRequest('getUniverseSystemsSystemId', [this._id]);
  }
}

/**
 * An api adapter that provides functions for accessing solar system information
 * via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `SolarSystems` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link SolarSystems#get get} or {@link SolarSystems#all all}
 * if no id is provided.
 */
class SolarSystems extends ExtendableFunction {
  /**
   * Create a new SolarSystems instance using the given `api`.
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
   * A Search module instance configured to search over the `'solarsystem'`
   * type.
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['solarsystem']);
    }
    return this._search;
  }

  /**
   * Create a new SolarSystem end point targeting the particular system by `id`.
   *
   * @param id {Number} The solar system id
   * @returns {SolarSystem}
   */
  get(id) {
    return new SolarSystem(this._api, id);
  }

  /**
   * @esi_route get_universe_systems
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._api.universe().newRequest('getUniverseSystems', []);
  }

  /**
   * @esi_route post_universe_names
   *
   * Results will only include matches with the solar system category.
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
      return _names(this._api, 'solar_system', ids);
    }
  }
}

module.exports = SolarSystems;
