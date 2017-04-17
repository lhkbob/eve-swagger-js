/**
 * An api adapter that provides functions for modifying the character's in-game
 * waypoints and destination via functions in the [user
 * interface](https://esi.tech.ccp.is/latest/#/User_Interface) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Autopilot {
  /**
   * Create a new Autopilot for the given `agent` provider. Requires an access
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

  _waypoint(dest, clearWaypoints, prependWaypoint) {
    return this._agent.auth(this._token).post('/v2/ui/autopilot/waypoint/', {
      query: {
        'destination_id': dest,
        'clear_other_waypoints': clearWaypoints,
        'add_to_beginning': prependWaypoint
      }
    });
  }

  /**
   * @esi_route post_ui_autopilot_waypoint
   * @esi_param destination_id - id
   * @esi_param clear_other_waypoints - true
   * @esi_param add_to_beginning - true
   *
   * @param {Number} id
   * @return {Promise.<Object>}
   */
  destination(id) {
    return this._waypoint(id, true, true);
  }

  /**
   * @esi_route post_ui_autopilot_waypoint
   * @esi_param destination_id - id
   * @esi_param clear_other_waypoints - false
   * @esi_param add_to_beginning - false
   *
   * @param {Number} id
   * @return {Promise.<Object>}
   */
  append(id) {
    return this._waypoint(id, false, false);
  }

  /**
   * @esi_route post_ui_autopilot_waypoint
   * @esi_param destination_id - id
   * @esi_param clear_other_waypoints - false
   * @esi_param add_to_beginning - true
   *
   * @param {Number} id
   * @return {Promise.<Object>}
   */
  prepend(id) {
    return this._waypoint(id, false, true);
  }
}

module.exports = Autopilot;
