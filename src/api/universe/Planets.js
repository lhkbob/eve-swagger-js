const Search = require('../Search');

const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter that provides functions for accessing various details for a
 * planet specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Planet {
  /**
   * Create a new Planet for the given `api` provider and specific
   * `planetId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param planetId {Number} The planet id that is used for all
   *     requests
   * @constructor
   */
  constructor(api, planetId) {
    this._api = api;
    this._id = planetId;
  }

  /**
   * Get information on the planet from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`universe/planets/{id}/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Universe/get_universe_planets_planet_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "name": "Akpivem III",
   *   "planet_id": 40000046,
   *   "position": {
   *     "x": -189226344497,
   *     "y": 9901605317,
   *     "z": -254852632979
   *   },
   *   "system_id": 30000003,
   *   "type_id": 13
   * }
   * ```
   *
   * @returns {Promise}
   * @esi_link UniverseApi.getUniversePlanetsPlanetId
   */
  info() {
    return this._api.universe()
    .newRequest('getUniversePlanetsPlanetId', [this._id]);
  }
}

/**
 * An api adapter that provides functions for accessing planet information via
 * the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Planets` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Planets#get get}.
 */
class Planets extends ExtendableFunction {
  /**
   * Create a new Planets instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => this.get(id));
    this._api = api;
  }

  /**
   * Create a new Planet end point targeting the particular planet
   * by `id`.
   *
   * @param id {Number} The planet id
   * @returns {Planet}
   */
  get(id) {
    return new Planet(this._api, id);
  }
}

module.exports = Planets;
