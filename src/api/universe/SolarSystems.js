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
   * Get solar system public info from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`/universe/systems/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_systems_system_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "constellation_id": 20000001,
   *   "name": "Akpivem",
   *   "planets": [
   *     {
   *       "moons": [
   *         40000042
   *       ],
   *       "planet_id": 40000041
   *     },
   *     {
   *      "planet_id": 40000043
   *     }
   *   ],
   *   "position": {
   *     "x": -91174141133075340,
   *     "y": 43938227486247170,
   *     "z": -56482824383339900
   *   },
   *   "security_class": "B",
   *   "security_status": 0.8462923765182495,
   *   "stargates": [
   *     50000342
   *   ],
   *   "system_id": 30000003
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseSystemsSystemId
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
   * @returns {Search}
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
   * Get all solar system ids from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`universe/systems/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Universe/get_universe_systems).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   30000001,
   *   30000002
   * ]
   * ```
   *
   * @returns {Promise}
   * @esi_link UniverseApi.getUniverseSystems
   */
  all() {
    return this._api.universe().newRequest('getUniverseSystems', []);
  }

  /**
   * Get the names for a list of solar system ids from the ESI endpoint. This
   * makes an HTTP POST request to
   * [`universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 30000003,
   *     "name": "Akpivem"
   *   }
   * ]
   * ```
   *
   * Note that this has the category field stripped from the response and will
   * only include matches with the solar system category.
   *
   * @param {Array.<Number>} ids  Optional; the solar system ids to look up. If
   *     not provided then the names of all systems will be returned.
   * @return {Promise} A Promise that resolves to the response of
   *     the request
   * @esi_link UniverseApi.postUniverseNames
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
