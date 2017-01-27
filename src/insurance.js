/**
 * A container for the [insurance](https://esi.tech.ccp.is/latest/#/Insurance)
 * ESI endpoints. You should not usually require this module directly, as it
 * technically returns a constructor that requires an internal API. The module
 * exports the {@link module:insurance~Insurance Insurance} constructor.
 *
 * @see https://esi.tech.ccp.is/latest/#/Insurance
 * @param api The internal API instance configured by the root module
 * @module insurance
 */

class Insurance {
  /**
   * Create a new Insurance instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * Get insurance prices for all ship types from the ESI endpoint. This makes
   * an HTTP GET request to
   * [`/insurance/prices/`](https://esi.tech.ccp.is/latest/#!/Insurance/get_insurance_prices).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "levels": [
   *       {
   *         "cost": 10,
   *         "name": "Basic",
   *         "payout": 20
   *       }
   *     ],
   *     "type_id": 1
   *   }
   * ]
   * ```
   *

   * @return {Promise} A Promise that resolves to the response of the request
   * @see module:eve_swagger_interface.languages
   * @see https://esi.tech.ccp.is/latest/#!/Incursions/get_insurance_prices
   * @esi_link InsuranceApi.getInsurancePrices
   */
  prices() {
    return this._api.insurance().newRequest('getInsurancePrices', []);
  }
}

module.exports = Insurance;