/**
 * A container for the [incursions](https://esi.tech.ccp.is/latest/#/Incursions)
 * ESI endpoints. You should not usually require this module directly, as it
 * technically returns a constructor that requires an internal API. The module
 * exports the {@link module:incursions~Incursions Incursions} constructor.
 *
 * @see https://esi.tech.ccp.is/latest/#/Incursions
 * @param api The internal API instance configured by the root module
 * @module incursions
 */

const ExtendableFunction = require('./internal/ExtendableFunction');

/**
 * An api adaptor over the end points handling incursions. This is a function
 * class so instances of `Incursions` are functions and can be invoked directly,
 * besides accessing its members. Its default function action is equivalent to
 * {@link module:incursions~Incursions#all all}.
 */
class Incursions extends ExtendableFunction {
  /**
   * Create a new Incursions function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(() => this.all());
    this._api = api;
  }

  /**
   * Get all incursions from the ESI endpoint. This makes an HTTP GET request to
   * [`/incursions`](https://esi.tech.ccp.is/latest/#!/Incursions/get_incursions).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "constellation_id": 20000607,
   *     "faction_id": 500019,
   *     "has_boss": true,
   *     "infested_solar_systems": [
   *        30004148,
   *        30004149,
   *        30004150,
   *        30004151,
   *        30004152,
   *        30004153,
   *        30004154
   *     ],
   *     "influence": 1,
   *     "staging_solar_system_id": 30004154,
   *     "state": "mobilizing",
   *     "type": "Incursion"
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Incursions/get_incursions
   * @esi_link IncursionsApi.getIncursions
   */
  all() {
    return this._api.incursions().newRequest('getIncursions', []);
  }
}

module.exports = Incursions;