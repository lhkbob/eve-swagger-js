const Search = require('../Search');

const _names = require('../../internal/names');

/**
 * An api adapter that provides functions for accessing constellation information
 * via the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) and
 * [search](https://esi.tech.ccp.is/latest/#/Search) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Constellations {
  /**
   * Create a new Constellations instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;

    /**
     * A Search module instance configured to search over the `'constellation'`
     * type.
     *
     * @type {Search}
     */
    this.search = new Search(api, ['constellation']);
  }

  /**
   * Get the names for a list of constellation ids from the ESI endpoint. This
   * makes an HTTP POST request to
   * [`universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 1000171,
   *     "name": "Republic University"
   *   }
   * ]
   * ```
   *
   * Note that this has the category field stripped from the response and will
   * only include matches with the constellation category.
   *
   * @param {Array.<Number>} ids The constellation ids to look up.
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link UniverseApi.postUniverseNames
   */
  names(ids) {
    return _names(this._api, 'constellation', ids);
  }
}

module.exports = Constellations;
