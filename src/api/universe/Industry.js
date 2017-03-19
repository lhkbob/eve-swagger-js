/**
 * An api adapter over the end points handling industry  via functions in the
 * [industry](https://esi.tech.ccp.is/latest/#/Industry) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Industry {
  /**
   * Create a new Industry instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * @esi_route get_industry_facilities
   *
   * @return {Promise.<Array.<Object>>}
   */
  facilities() {
    return this._api.industry().newRequest('getIndustryFacilities', []);
  }

  /**
   * @esi_route get_industry_systems
   *
   * @return {Promise.<Array.<Object>>}
   */
  systemCosts() {
    return this._api.industry().newRequest('getIndustrySystems', []);
  }
}

module.exports = Industry;
