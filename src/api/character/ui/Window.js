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
   * Open the in-game information window on the specific entity via the ESI
   * endpoint. This makes an  HTTP POST request to
   * [`/ui/openwindow/information/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_information).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Number} id The id of the entity to look up
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiOpenwindowContract
   */
  info(id) {
    return this._api.userInterface(this._token)
    .newRequest('postOpenwindowInformation', [id]);
  }

  /**
   * Open the in-game market window to the specified type via the ESI endpoint.
   * This makes an  HTTP POST request to
   * [`/ui/openwindow/marketdetails/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_marketdetails).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Number} typeId The id of the type on the market to pull up
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiOpenwindowMarketdetails
   */
  market(typeId) {
    return this._api.userInterface(this._token)
    .newRequest('postOpenwindowMarketdetails', [typeId]);
  }

  /**
   * Open the in-game contracts window to the specified contract via the ESI
   * endpoint. This makes an  HTTP POST request to
   * [`/ui/openwindow/contract/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_contract).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Number} contractId The id of the contract
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiOpenwindowContract
   */
  contract(contractId) {
    return this._api.userInterface(this._token)
    .newRequest('postOpenwindowContract', [contractId]);
  }

  /**
   * Open the in-game mail window to send a new mail via the ESI endpoint. This
   * makes an  HTTP POST request to
   * [`/ui/openwindow/contract/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_newmail).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success. The new mail dialog is initialized based on the
   * mail configuration passed in, an example of which looks like:
   *
   * ```
   * {
   *   "body": "string",
   *   "recipients": [
   *     0
   *   ],
   *   "subject": "string",
   *   "to_corp_or_alliance_id": 0,
   *   "to_mailing_list_id": 0
   * }
   * ```
   *
   * @param {Object} settings The initial state of the new mail
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiOpenwindowNewmail
   */
  newMail(settings) {
    return this._api.userInterface(this._token)
    .newRequest('postUiOpenwindowNewmail', [settings]);
  }
}

module.exports = Window;
