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
   * @esi_route get_universe_races
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._api.universe().newRequest('getUniverseRaces', []);
  }
}

module.exports = Races;
