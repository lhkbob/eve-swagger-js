/**
 * A container for the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 * You should not require this module directly, as it technically returns a
 * factory function that requires an internal API. Instead an instance is
 * automatically exposed when the {@link module:eve_swagger_interface} is loaded
 * and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/User_Interface
 * @param api The internal API instance configured by the root module
 * @module ui
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var ESI = api.esi;

  var exports = {};

  /**
   * Set the in-game autopilot waypoint with the ESI endpoint. This makes an
   * HTTP POST request to
   * [`/ui/autopilot/waypoint/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * This clears all other waypoints.
   *
   * @param {Integer} destinationId The id of the destination system or object
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint
   * @esi_link UserInterfaceApi.postUiAutopilotWaypoint
   */
  exports.setWaypoint = function(destinationId, accessToken) {
    var opts = {
      clearOtherWaypoints: true,
      addToBeginning: true
    };
    return newRequestOpt(ESI.UserInterfaceApi, 'postUiAutopilotWaypoint',
        [destinationId], opts, accessToken);
  };

  /**
   * Add a waypoint to the in-game autopilot with the ESI endpoint. This makes
   * an  HTTP POST request to
   * [`/ui/autopilot/waypoint/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * This does not remove other waypoints and the new waypoint is added to the
   * end of the path.
   *
   * @param {Integer} destinationId The id of the destination system or object
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint
   * @esi_link UserInterfaceApi.postUiAutopilotWaypoint
   */
  exports.appendWaypoint = function(destinationId, accessToken) {
    var opts = {
      clearOtherWaypoints: false,
      addToBeginning: false
    };
    return newRequestOpt(ESI.UserInterfaceApi, 'postUiAutopilotWaypoint',
        [destinationId], opts, accessToken);
  };

  /**
   * Insert a waypoint to the in-game autopilot with the ESI endpoint. This
   * makes an  HTTP POST request to
   * [`/ui/autopilot/waypoint/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * This does not remove other waypoints and the new waypoint is added to the
   * start of the path.
   *
   * @param {Integer} destinationId The id of the destination system or object
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint
   * @esi_link UserInterfaceApi.postUiAutopilotWaypoint
   */
  exports.prependWaypoint = function(destinationId, accessToken) {
    var opts = {
      clearOtherWaypoints: false,
      addToBeginning: true
    };
    return newRequestOpt(ESI.UserInterfaceApi, 'postUiAutopilotWaypoint',
        [destinationId], opts, accessToken);
  };

  /**
   * Open the in-game contracts window to the specified contract via the ESI
   * endpoint. This makes an  HTTP POST request to
   * [`/ui/openwindow/contract/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_contract).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Integer} contractId The id of the contract
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_contract
   * @esi_link UserInterfaceApi.postUiOpenwindowContract
   */
  exports.openContract = function(contractId, accessToken) {
    return newRequest(ESI.UserInterfaceApi, 'postOpenwindowContract',
        [contractId], accessToken);
  };

  /**
   * Open the in-game information window on the specific entity via the ESI
   * endpoint. This makes an  HTTP POST request to
   * [`/ui/openwindow/information/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_information).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Integer} id The id of the entity to look up
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_information
   * @esi_link UserInterfaceApi.postUiOpenwindowContract
   */
  exports.openInfo = function(id, accessToken) {
    return newRequest(ESI.UserInterfaceApi, 'postOpenwindowInformation', [id],
        accessToken);
  };

  /**
   * Open the in-game market window to the specified type via the ESI endpoint.
   * This makes an  HTTP POST request to
   * [`/ui/openwindow/marketdetails/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_marketdetails).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Integer} typeId The id of the type on the market to pull up
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_marketdetails
   * @esi_link UserInterfaceApi.postUiOpenwindowMarketdetails
   */
  exports.openMarket = function(typeId, accessToken) {
    return newRequest(ESI.UserInterfaceApi, 'postOpenwindowMarketdetails',
        [typeId], accessToken);
  };

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
   * @param {Object} mail The initial state of the new mail
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_openwindow_newmail
   * @esi_link UserInterfaceApi.postUiOpenwindowNewmail
   */
  exports.openNewMail = function(mail, accessToken) {
    return newRequest(ESI.UserInterfaceApi, 'postUiOpenwindowNewmail', [mail],
        accessToken);
  };

  return exports;
};
