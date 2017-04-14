/**
 * An api adapter over the end points handling industry  via functions in the
 * [industry](https://esi.tech.ccp.is/latest/#/Industry) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Industry {
  /**
   * Create a new Industry instance using the given `agent`.
   *
   * @param agent {ESIAgent} The agent provider
   * @constructor
   */
  constructor(agent) {
    this._agent = agent;
  }

  /**
   * @esi_route get_industry_facilities
   *
   * @return {Promise.<Array.<Object>>}
   */
  facilities() {
    return this._agent.noAuth.get('/v1/industry/facilities/');
  }

  /**
   * @esi_route get_industry_systems
   *
   * @return {Promise.<Array.<Object>>}
   */
  systemCosts() {
    return this._agent.noAuth.get('/v1/industry/systems/');
  }
}

module.exports = Industry;
