const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling public structures via functions
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
   * @esi_route get_universe_structures
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._api.universe().newRequest('getUniverseStructures', []);
  }
}

module.exports = Freeports;
