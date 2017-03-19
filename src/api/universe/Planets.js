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
   * @esi_route get_universe_planets_planet_id
   *
   * @returns {Promise.<Object>}
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
