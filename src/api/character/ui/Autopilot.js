/**
 * An api adapter that provides functions for modifying the character's in-game
 * waypoints and destination via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Autopilot {
  /**
   * Create a new Autopilot for the given `api` provider. Requires an access
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

  _waypoint(dest, clearWaypoints, prependWaypoint) {
    return this._api.userInterface(this._token)
    .newRequest('postUiAutopilotWaypoint',
        [dest, clearWaypoints, prependWaypoint]);
  }

  /**
   * Set the in-game autopilot waypoint with the ESI endpoint. This makes an
   * HTTP POST request to
   * [`/ui/autopilot/waypoint/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * This clears all other waypoints.
   *
   * @param {Number} id The id of the destination system or object
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiAutopilotWaypoint
   */
  destination(id) {
    return this._waypoint(id, true, true);
  }

  /**
   * Append a destination to the in-game autopilot with the ESI endpoint. This
   * makes an HTTP POST request to
   * [`/ui/autopilot/waypoint/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * This does not remove other waypoints and the new waypoint is added to the
   * end of the path.
   *
   * @param {Number} id The id of the destination system or object
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiAutopilotWaypoint
   */
  append(id) {
    return this._waypoint(id, false, false);
  }

  /**
   * Prepend a destination to the in-game autopilot with the ESI endpoint. This
   * makes an HTTP POST request to
   * [`/ui/autopilot/waypoint/`](https://esi.tech.ccp.is/latest/#!/User_Interface/post_ui_autopilot_waypoint).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * This does not remove other waypoints and the new waypoint is added to the
   * start of the path.
   *
   * @param {Number} id The id of the destination system or object
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link UserInterfaceApi.postUiAutopilotWaypoint
   */
  prepend(id) {
    return this._waypoint(id, false, true);
  }
}

module.exports = Autopilot;
