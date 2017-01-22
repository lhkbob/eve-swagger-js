/**
 * A container for the [industry](https://esi.tech.ccp.is/latest/#/Industry) ESI
 * endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:eve_swagger_interface} is
 * loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Industry
 * @param api The internal API instance configured by the root module
 * @module industry
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var ESI = api.esi;

  var exports = {};

  /**
   * Get all industry facilities from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`/industry/facilities`](https://esi.tech.ccp.is/latest/#!/Industry/get_industry_facilities).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "facility_id": 60012544,
   *     "owner_id": 1000126,
   *     "region_id": 10000001,
   *     "solar_system_id": 30000032,
   *     "tax": 0.1,
   *     "type_id": 2502
   *   }
   * ]
   * ```
   *
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Industry/get_industry_facilities
   * @esi_link IndustryApi.getIndustryFacilities
   */
  exports.getFacilities = function() {
    return newRequest(ESI.IndustryApi, 'getIndustryFacilities', []);
  };

  /**
   * Get cost indices for each solar system from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`/industry/systems`](https://esi.tech.ccp.is/latest/#!/Industry/get_industry_systems).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "cost_indices": [
   *       {
   *         "activity": "invention",
   *         "cost_index": 0.00480411064973412
   *       }
   *     ],
   *     "solar_system_id": 30011392
   *   }
   * ]
   * ```
   *
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Industry/get_industry_facilities
   * @esi_link IndustryApi.getIndustryFacilities
   */
  exports.getSystemCostIndices = function() {
    return newRequest(ESI.IndustryApi, 'getIndustrySystems', []);
  };

  return exports;
};
