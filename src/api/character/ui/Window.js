/**
 * An api adapter that provides functions for modifying the character's in-game
 * windows via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Window {
  /**
   * Create a new Window for the given `api` provider. Requires an access
   * token for a character currently in game.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param token {String} Access token for the character in game
   * @constructor
   */
  constructor(api, token) {
    this._api = api;
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
    return this._api.userInterface(this._token)
    .newRequest('postUiOpenwindowInformation', [id]);
  }

  /**
   * @esi_route post_ui_openwindow_marketdetails
   *
   * @param typeId {Number}
   * @return {Promise.<Object>}
   */
  market(typeId) {
    return this._api.userInterface(this._token)
    .newRequest('postUiOpenwindowMarketdetails', [typeId]);
  }

  /**
   * @esi_route post_ui_openwindow_contract
   *
   * @param contractId {Number}
   * @return {Promise.<Object>}
   */
  contract(contractId) {
    return this._api.userInterface(this._token)
    .newRequest('postUiOpenwindowContract', [contractId]);
  }

  /**
   * @esi_route post_ui_openwindow_newmail
   * @esi_param new_mail - settings
   *
   * @param settings {Object}
   * @return {Promise.<Object>}
   */
  newMail(settings) {
    return this._api.userInterface(this._token)
    .newRequest('postUiOpenwindowNewmail', [settings]);
  }
}

module.exports = Window;
