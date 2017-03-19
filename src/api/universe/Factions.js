const ExtendableFunction = require('../../internal/ExtendableFunction');
const Search = require('../Search');

/**
 * An api adapter over the end points handling factions via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Factions` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Factions#all all}.
 */
class Factions extends ExtendableFunction {
  /**
   * Create a new Factions function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(() => this.all());
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'faction'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['faction']);
    }
    return this._search;
  }

  /**
   * @esi_route get_universe_factions
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._api.universe().newRequest('getUniverseFactions', []);
  }
}

module.exports = Factions;
