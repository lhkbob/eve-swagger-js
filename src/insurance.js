/**
 * A container for the [insurance](https://esi.tech.ccp.is/latest/#/Insurance)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:eve_swagger_interface} is
 * loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Insurance
 * @param api The internal API instance configured by the root module
 * @module insurance
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var newRequestOpt = api.newRequestOpt;
  var ESI = api.esi;

  var exports = {};

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
   * @param {String} language Optional localization code for the response,
   *   which overrides the default language.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see module:eve_swagger_interface.languages
   * @see https://esi.tech.ccp.is/latest/#!/Incursions/get_insurance_prices
   * @esi_link InsuranceApi.getInsurancePrices
   */
  exports.getPrices = function(language) {
    var opts = {};
    if (language) {
      opts.acceptLanguage = language;
    }
    return newRequestOpt(ESI.InsuranceApi, 'getInsurancePrices', [], opts);
  };

  return exports;
};
