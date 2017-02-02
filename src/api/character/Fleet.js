const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling a specific squad in a character's
 * fleet via functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Squad {
  /**
   * Create a new Squad adaptor owned by the given `fleet` corresponding
   * to the given `squadId`.
   *
   * @param fleet {Fleet} The owning fleet
   * @param squadId {Number} The squad id of this instance
   * @constructor
   */
  constructor(fleet, squadId) {
    this._fleet = fleet;
    this._id = squadId;
  }

  /**
   * Rename a squad in a fleet with the ESI endpoint. This makes an HTTP PUT
   * request to
   * [`/fleets/{fleetId}/squads/{squadId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_squads_squad_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success. The update parameters are stored in an object
   * like:
   *
   * ```
   * {
   *   "name": "string"
   * }
   * ```
   *
   * @param {String} name The new name of the squad
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.putFleetsFleetIdSquadsSquadId
   */
  rename(name) {
    return this._fleet._api.fleets(this._fleet._token)
    .newRequest('putFleetsFleetIdSquadsSquadId',
        [this._fleet._id, this._id, { name: name }]);
  }

  /**
   * Delete a squad from a fleet with the ESI endpoint. This makes an HTTP
   * DELETE request to
   * [`/fleets/{fleetId}/squads/{squadId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_squads_squad_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @return {Promise} A Promise that resolves to the response of  the request
   * @esi_link FleetsApi.deleteFleetsFleetIdSquadsSquadId
   */
  remove() {
    return this._fleet._api.fleets(this._fleet._token)
    .newRequest('deleteFleetsFleetIdSquadsSquadId',
        [this._fleet._id, this._id]);
  }
}

/**
 * An api adapter over the end points handling the squads in a wing in the
 * character's fleet via functions in the
 * [fleets](https://esi.tech.ccp.is/latest/#/Fleets) ESI endpoints. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 *
 * This is a function class so instances of `Squads` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Squads#get get}.
 */
class Squads extends ExtendableFunction {
  /**
   * Create a new Squads function owned by the given `wing`.
   *
   * @param wing {Wing} The owning wing
   * @constructor
   */
  constructor(wing) {
    super(id => this.get(id));
    this._wing = wing;
  }

  /**
   * Add a new squad to a fleet's wing with the ESI endpoint. This makes an
   * HTTP POST request to
   * [`/fleets/{fleetId}/wings/{wingId}/squads`](https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "squad_id": 123
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.postFleetsFleetIdWingsWingIdSquads
   */
  add() {
    return this._wing._fleet._api.fleets(this._wing._fleet._token)
    .newRequest('postFleetsFleetIdWingsWingIdSquads',
        [this._wing._fleet._id, this._wing._id]);
  }

  /**
   * The Squad api adapter for accessing and modifying the specific squad of a
   * wing.
   *
   * @returns {Squad}
   */
  get(id) {
    return new Squad(this._wing._fleet, id);
  }
}

/**
 * An api adapter over the end points handling a specific wing in a character's
 * fleet via functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Wing {
  /**
   * Create a new Wing adaptor owned by the given `fleet` corresponding
   * to the given `wingId`.
   *
   * @param fleet {Fleet} The owning fleet
   * @param wingId {Number} The wing id of this instance
   * @constructor
   */
  constructor(fleet, wingId) {
    this._fleet = fleet;
    this._id = wingId;
    this._squads = new Squads(this);
  }

  /**
   * Get the Squads end point for this particular wing.
   *
   * @returns {Squads}
   */
  get squads() {
    return this._squads;
  }

  /**
   * Rename a wing in a fleet with the ESI endpoint. This makes an HTTP PUT
   * request to
   * [`/fleets/{fleetId}/wings/{wingId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_wings_wing_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {String} name The new name of the wing
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.putFleetsFleetIdWingsWingId
   */
  rename(name) {
    return this._fleet._api.fleets(this._fleet._token)
    .newRequest('putFleetsFleetIdWingsWingId',
        [this._fleet._id, this._id, { name: name }]);
  }

  /**
   * Remove a wing from a fleet with the ESI endpoint. This makes an HTTP
   * DELETE request to
   * [`/fleets/{fleetId}/wings/{wingId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_wings_wing_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.deleteFleetsFleetIdWingsWingId
   */
  remove() {
    return this._fleet._api.fleets(this._fleet._token)
    .newRequest('deleteFleetsFleetIdWingsWingId', [this._fleet._id, this._id]);
  }
}

/**
 * An api adapter over the end points handling the wings in the character's
 * fleet via functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Wings` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Wings#get get} or {@link Wings#all all} if no id is
 * provided.
 */
class Wings extends ExtendableFunction {
  /**
   * Create a new Wings function owned by the given `fleet`.
   *
   * @param fleet {Fleet} The owning fleet
   * @constructor
   */
  constructor(fleet) {
    super(id => (id ? this.get(id) : this.all()));
    this._fleet = fleet;
  }

  /**
   * Get information on all wings in a fleet with the ESI endpoint. This makes
   * an HTTP GET request to
   * [`/fleets/{id}/wings/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_wings).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 2073711261968,
   *     "name": "Wing 1",
   *     "squads": [
   *       {
   *         "id": 3129411261968,
   *        "name": "Squad 1"
   *       }
   *     ]
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link FleetsApi.getFleetsFleetIdWings
   */
  all() {
    return this._fleet._api.fleets(this._fleet._token)
    .newRequest('getFleetsFleetIdWings', [this._fleet._id]);
  }

  /**
   * Add a new wing to a fleet with the ESI endpoint. This makes an HTTP POST
   * request to
   * [`/fleets/{id}/wings/`](https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_wings).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "wing_id": 123
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of  the request
   * @esi_link FleetsApi.postFleetsFleetIdWings
   */
  add() {
    return this._fleet._api.fleets(this._fleet._token)
    .newRequest('postFleetsFleetIdWings', [this._fleet._id]);
  }

  /**
   * The Wing api adapter for accessing and modifying the specific wing of a
   * fleet.
   *
   * @returns {Wing}
   */
  get(id) {
    return new Wing(this._fleet, id);
  }
}

/**
 * An api adapter over the end points handling a character's fleet via
 * functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Fleet {
  /**
   * Create a new Fleet function using the given `api` with SSO access from
   * `token`. The `fleetId` must also be provided.
   *
   * @param api {ApiProvider} The api provider
   * @param token {String} The SSO access token for the character
   * @param fleetId {Number} The fleet id of the fleet the character belongs to
   * @constructor
   */
  constructor(api, token, fleetId) {
    this._api = api;
    this._token = token;
    this._id = fleetId;

    this._wings = new Wings(this);
  }

  /**
   * The Wings api adapter for accessing and modifying the wing state of the
   * fleet.
   *
   * @returns {Wings}
   */
  get wings() {
    return this._wings;
  }

  /**
   * Get fleet details from the ESI endpoint. This makes an HTTP GET request to
   * [`/fleets/{id}/`](https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "is_free_move": false,
   *   "is_registered": false,
   *   "is_voice_enabled": false,
   *   "motd": "This is an <b>awesome</b> fleet!"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.getFleetsFleetId
   */
  info() {
    return this._api.fleets(this._token)
    .newRequest('getFleetsFleetId', [this._id]);
  }

  /**
   * Get fleet members from the ESI endpoint. This makes an HTTP GET request to
   * [`/fleets/{id}/members/`](https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id_members).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "character_id": 93265215,
   *     "join_time": "2016-04-29T12:34:56Z",
   *     "role": "squad_commander",
   *     "role_name": "Squad Commander (Boss)",
   *     "ship_type_id": 33328,
   *     "solar_system_id": 30003729,
   *     "squad_id": 3129411261968,
   *     "station_id": 61000180,
   *     "takes_fleet_warp": true,
   *     "wing_id": 2073711261968
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.getFleetsFleetIdMembers
   */
  members() {
    return this._api.fleets(this._token)
    .newRequest('getFleetsFleetIdMembers', [this._id]);
  }

  /**
   * Send a fleet invite to a character with the ESI endpoint. This makes
   * an HTTP POST request to
   * [`/fleets/{id}/members/`](https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_members).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success. An example `invitation` value looks like:
   *
   * ```
   * {
   *   "character_id": 0,
   *   "role": "fleet_commander",
   *   "squad_id": 0,
   *   "wing_id": 0
   * }
   * ```
   *
   * @param {Object} invitation Simple object specifying character to invite,
   *   and their fleet position on accept
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.postFleetsFleetIdMembers
   */
  invite(invitation) {
    return this._api.fleets(this._token)
    .newRequest('postFleetsFleetIdMembers', [this._id, invitation]);
  }

  /**
   * Remove a member from a fleet with the ESI endpoint. This makes an HTTP
   * DELETE request to
   * [`/fleets/{fleetId}/members/{memberId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_members_member_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success.
   *
   * @param {Number} memberId The member character id to kick
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.deleteFleetsFleetIdMembersMemberId
   */
  kick(memberId) {
    return this._api.fleets(this._token)
    .newRequest('deleteFleetsFleetIdMembersMemberId', [this._id, memberId]);
  }

  /**
   * Move or update a member in a fleet with the ESI endpoint. This makes an
   * HTTP PUT request to
   * [`/fleets/{fleetId}/members/{memberId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_members_member_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success. An example move order looks like:
   *
   * ```
   * {
   *   "role": "fleet_commander",
   *   "squad_id": 0,
   *   "wing_id": 0
   * }
   * ```
   *
   * @param {Number} memberId The character id of the fleet member being moved
   * @param {Object} moveOrder A simple object describing the move or update
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.putFleetsFleetIdMembersMemberId
   */
  move(memberId, moveOrder) {
    return this._api.fleets(this._token)
    .newRequest('putFleetsFleetIdMembersMemberId',
        [this._id, memberId, moveOrder]);
  }

  /**
   * Update fleet details with the ESI endpoint. This makes an HTTP PUT request
   * to
   * [`/fleets/{id}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object on success. An example `newSettings` value looks like:
   *
   * ```
   * {
   *   "is_free_move": true,
   *   "motd": "string"
   * }
   * ```
   *
   * @param {Object} newSettings Simple object of properties to modify
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FleetsApi.putFleetsFleetId
   */
  update(newSettings) {
    return this._api.fleets(this._token)
    .newRequest('putFleetsFleetId', [this._id, newSettings]);
  }
}

module.exports = Fleet;
