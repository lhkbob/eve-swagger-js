const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling bloodlines via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Bloodlines` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Bloodlines#all all}.
 */
class Bloodlines extends ExtendableFunction {
  /**
   * Create a new Bloodlines function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(() => this.all());
    this._api = api;
  }

  /**
   * Get all bloodlines and their information from the ESI endpoints. This makes
   * an HTTP GET request to
   * [`universe/bloodlines/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_bloodlines)
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "bloodline_id": 1,
   *     "charisma": 6,
   *     "corporation_id": 1000006,
   *     "description": "The Deteis are regarded as ...",
   *     "intelligence": 7,
   *     "memory": 7,
   *     "name": "Deteis",
   *     "perception": 5,
   *     "race_id": 1,
   *     "ship_type_id": 601,
   *     "willpower": 5
   *   }
   * ]
   * ```
   *
   * @returns {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseBloodlines
   */
  all() {
    return this._api.universe().newRequest('getUniverseBloodlines', []);
  }
}

module.exports = Bloodlines;
