const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adaptor over the end points handling public structures via functions
 * in the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Freeports` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Freeports#all all}.
 */
class Freeports extends ExtendableFunction {
  /**
   * Create a new Freeports function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(() => this.all());
    this._api = api;
  }

  /**
   * Get all public structure ids (or freeports) from the ESI endpoint. This makes
   * an HTTP GET request to [`universe/structures/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_structures)
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   1000000017013,
   *   1000000025062
   * ]
   * ```
   *
   * @returns {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseStructures
   */
  all() {
    return this._api.universe().newRequest('getUniverseStructures', []);
  }
}

module.exports = Freeports;