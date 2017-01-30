const ExtendableFunction = require('../../internal/ExtendableFunction');
const Search = require('../Search');

/**
 * An api adaptor over the end points handling factions via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
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

    /**
     * A Search module instance configured to search over the `'faction'`
     * type.
     *
     * @type {Search}
     */
    this.search = new Search(api, ['faction']);
  }

  /**
   * Get all factions and their information from the ESI endpoints. This makes
   * an HTTP GET request to [`universe/factions/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_factions)
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "corporation_id": 456,
   *     "description": "blah blah",
   *     "faction_id": 1,
   *     "is_unique": true,
   *     "name": "Faction",
   *     "size_factor": 1,
   *     "solar_system_id": 123,
   *     "station_count": 1000,
   *     "station_system_count": 100
   *   }
   * ]
   * ```
   *
   * @returns {Promise} A Promise that resolves to the response of the request
   * @esi_link UniverseApi.getUniverseFactions
   */
  all() {
    return this._api.universe().newRequest('getUniverseFactions', []);
  }
}

module.exports = Factions;
