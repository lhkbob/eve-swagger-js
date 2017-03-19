/**
 * An api adapter that provides functions for accessing the
 * [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Sovereignty {
  /**
   * Create a new Sovereignty instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * @esi_route get_sovereignty_campaigns
   *
   * @return {Promise.<Array.<Object>>}
   */
  campaigns() {
    return this._api.sovereignty().newRequest('getSovereigntyCampaigns', []);
  }

  /**
   * @esi_route get_sovereignty_structures
   *
   * @return {Promise.<Array.<Object>>}
   */
  structures() {
    return this._api.sovereignty().newRequest('getSovereigntyStructures', []);
  }
}


module.exports = Sovereignty;
