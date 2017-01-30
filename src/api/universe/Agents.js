const Search = require('../Search');

/**
 * An api adaptor that provides functions for accessing agent information
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

    /**
     * A Search module instance configured to search over the `'agent'`
     * type.
     *
     * @type {Search}
     */
    this.search = new Search(api, ['agent']);
  }
}

module.exports = Agents;
