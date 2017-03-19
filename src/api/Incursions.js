const ExtendableFunction = require('../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling incursions  via functions in the
 * [incursions](https://esi.tech.ccp.is/latest/#/Incursions) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Incursions` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Incursions#all all}.
 */
class Incursions extends ExtendableFunction {
  /**
   * Create a new Incursions instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(() => this.all());
    this._api = api;
  }

  /**
   * @esi_route get_incursions
   *
   * @return {Promise.<Array.<Object>>}
   */
  all() {
    return this._api.incursions().newRequest('getIncursions', []);
  }
}

module.exports = Incursions;