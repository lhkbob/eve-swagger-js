const Search = require('../Search');

const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter that provides functions for accessing various details for a
 * stargate specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Stargate {
  /**
   * Create a new Stargate for the given `api` provider and specific
   * `stargateId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param stargateId {Number} The stargate id that is used for all
   *     requests
   * @constructor
   */
  constructor(api, stargateId) {
    this._api = api;
    this._id = stargateId;
  }

  /**
   * Get information on the stargate from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`universe/stargates/{id}/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Universe/get_universe_stargates_stargate_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "destination": {
   *     "stargate_id": 50000056,
   *     "system_id": 30000001
   *   },
   *   "name": "Stargate (Tanoo)",
   *   "position": {
   *     "x": -101092761600,
   *     "y": 5279539200,
   *     "z": 1550503403520
   *   },
   *   "stargate_id": 50000342,
   *   "system_id": 30000003,
   *   "type_id": 29624
   * }
   * ```
   *
   * @returns {Promise}
   * @esi_link UniverseApi.getUniverseStargatesStargateId
   */
  info() {
    return this._api.universe()
    .newRequest('getUniverseStargatesStargateId', [this._id]);
  }
}

/**
 * An api adapter that provides functions for accessing stargate information via
 * the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Stargates` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Stargates#get get}.
 */
class Stargates extends ExtendableFunction {
  /**
   * Create a new Stargates instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => this.get(id));
    this._api = api;
  }

  /**
   * Create a new Stargate end point targeting the particular stargate
   * by `id`.
   *
   * @param id {Number} The stargate id
   * @returns {Stargate}
   */
  get(id) {
    return new Stargate(this._api, id);
  }
}

module.exports = Stargates;
