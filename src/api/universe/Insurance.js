/**
 * An api adapter that provides functions for accessing the
 * [insurance](https://esi.tech.ccp.is/latest/#/Insurance) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
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
   * @esi_route get_insurance_prices
   *
   * @return {Promise.<Array.<Object>>}
   */
  prices() {
    return this._api.insurance().newRequest('getInsurancePrices', []);
  }
}

module.exports = Insurance;