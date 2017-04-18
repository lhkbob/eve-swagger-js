/**
 * An api adapter that provides functions for accessing the
 * [insurance](https://esi.tech.ccp.is/latest/#/Insurance) ESI end points.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Insurance {
  /**
   * Create a new Insurance instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    this._agent = agent;
  }

  /**
   * @esi_route get_insurance_prices
   * @esi_example esi.insurance.prices()
   *
   * @return {Promise.<Array.<Object>>}
   */
  prices() {
    return this._agent.noAuth.get('/v1/insurance/prices/');
  }
}

module.exports = Insurance;