/**
 * An api adapter that provides functions for modifying the character's in-game
 * windows via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Window {
  /**
   * Create a new Window for the given `agent` provider. Requires an access
   * token for a character currently in game.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param token {String} Access token for the character in game
   * @constructor
   */
  constructor(agent, token) {
    this._agent = agent;
    this._token = token;
  }

  /**
   * @esi_route post_ui_openwindow_information
   * @esi_param target_id - id
   *
   * @param id {Number}
   * @return {Promise.<Object>}
   */
  info(id) {
    return this._agent.auth(this._token)
    .post('/v1/ui/openwindow/information/', { query: { 'target_id': id } });
  }

  /**
   * @esi_route post_ui_openwindow_marketdetails
   *
   * @param typeId {Number}
   * @return {Promise.<Object>}
   */
  market(typeId) {
    return this._agent.auth(this._token)
    .post('/v1/ui/openwindow/marketdetails/', { query: { 'type_id': typeId } });
  }

  /**
   * @esi_route post_ui_openwindow_contract
   *
   * @param contractId {Number}
   * @return {Promise.<Object>}
   */
  contract(contractId) {
    return this._agent.auth(this._token).post('/v1/ui/openwindow/contract/',
        { query: { 'contract_id': contractId } });
  }

  /**
   * @esi_route post_ui_openwindow_newmail
   * @esi_param new_mail - settings
   *
   * @param settings {Object}
   * @return {Promise.<Object>}
   */
  newMail(settings) {
    return this._agent.auth(this._token)
    .post('/v1/ui/openwindow/newmail/', { body: settings });
  }
}

module.exports = Window;
