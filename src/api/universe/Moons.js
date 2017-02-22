const Search = require('../Search');

const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter that provides functions for accessing various details for a
 * moon specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Moon {
  /**
   * Create a new Moon for the given `api` provider and specific
   * `moonId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param moonId {Number} The moon id that is used for all
   *     requests
   * @constructor
   */
  constructor(api, moonId) {
    this._api = api;
    this._id = moonId;
  }

  /**
   * Get information on the planet from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`universe/moons/{id}/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Universe/get_universe_moons_moon_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "moon_id": 40000042,
   *   "name": "Akpivem I - Moon 1",
   *   "position": {
   *     "x": 58605102008,
   *     "y": -3066616285,
   *     "z": -55193617920
   *   },
   *   "system_id": 30000003
   * }
   * ```
   *
   * @returns {Promise}
   * @esi_link UniverseApi.getUniverseMoonsMoonId
   */
  info() {
    return this._api.universe()
    .newRequest('getUniverseMoonsMoonId', [this._id]);
  }
}

/**
 * An api adapter that provides functions for accessing moon information via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Moons` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Moons#get get}.
 */
class Moons extends ExtendableFunction {
  /**
   * Create a new Moons instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => this.get(id));
    this._api = api;
  }

  /**
   * Create a new Moon end point targeting the particular moon
   * by `id`.
   *
   * @param id {Number} The moon id
   * @returns {Moon}
   */
  get(id) {
    return new Moon(this._api, id);
  }
}

module.exports = Moons;
