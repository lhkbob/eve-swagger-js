const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling races via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Races` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Races#all all}.
 */
class Races extends ExtendableFunction {
  /**
   * Create a new Races function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(() => this.all());
    this._api = api;
  }

  /**
   * Get all races and their information from the ESI endpoints. This makes
   * an HTTP GET request to
   * [`universe/races/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_races)
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "alliance_id": 500001,
   *     "description": "Founded on the tenets of patriotism and hard work...",
   *     "name": "Caldari",
   *     "race_id": 1
   *   }
   * ]
   * ```
   *
   * @returns {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseRaces
   */
  all() {
    return this._api.universe().newRequest('getUniverseRaces', []);
  }
}

module.exports = Races;
