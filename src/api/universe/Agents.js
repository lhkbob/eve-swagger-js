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
   * Create a new Agents instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    this._agent = agent;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'agent'` type.
   *
   * @esi_example esi.agents.search('text') categories=[agent] get_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['agent']);
    }
    return this._search;
  }
}

module.exports = Agents;
