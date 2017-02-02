const Search = require('../Search');

/**
 * An api adapter that provides functions for accessing agent information
 * via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Agents {
  /**
   * Create a new Agents instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'agent'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['agent']);
    }
    return this._search;
  }
}

module.exports = Agents;
