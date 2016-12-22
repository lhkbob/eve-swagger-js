/**
 * A container for the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Fleets
 * @param api The internal API instance configured by the root module
 * @module fleets
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var newRequestOpt = api.newRequestOpt;
    var ESI = api.esi;

    var exports = {};

    /**
     * Get fleet details from the ESI endpoint. This makes
     * an HTTP GET request to [`/fleets/{id}/`](https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * {
     *   "is_free_move": false,
     *   "is_registered": false,
     *   "is_voice_enabled": false,
     *   "motd": "This is an <b>awesome</b> fleet!"
     * }
     * ```
     * @param {Integer} id The fleet id to look up
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id
     * @esi_link FleetsApi.getFleetsFleetId
     */
    exports.get = function(id, accessToken) {
        return newRequest(ESI.FleetsApi, 'getFleetsFleetId', [id], accessToken);
    };

    /**
     * Update fleet details with the ESI endpoint. This makes
     * an HTTP PUT request to [`/fleets/{id}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success. An example `newSettings` value looks 
     * like:
     * ```
     * {
     *   "is_free_move": true,
     *   "motd": "string"
     * }
     * ```
     * @param {Integer} id The fleet id to modify
     * @param {Object} newSettings Simple object of properties to modify
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id
     * @esi_link FleetsApi.putFleetsFleetId
     */
    exports.update = function(id, newSettings, accessToken) {
        return newRequest(ESI.FleetsApi, 'putFleetsFleetId', [id, newSettings],
                          accessToken);
    };

    /**
     * Get fleet members from the ESI endpoint. This makes
     * an HTTP GET request to [`/fleets/{id}/members/`](https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id_members).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
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
     * @param {Integer} id The fleet id to look up
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id_members
     * @esi_link FleetsApi.getFleetsFleetIdMembers
     */
    exports.getMembers = function(id, accessToken) {
        return newRequest(ESI.FleetsApi, 'getFleetsFleetIdMembers', [id],
                          accessToken);
    };

    /**
     * Send a fleet invite to a character with the ESI endpoint. This makes
     * an HTTP POST request to [`/fleets/{id}/members/`](https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_members).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success. An example `invitation` value looks 
     * like:
     * ```
     * {
     *   "character_id": 0,
     *   "role": "fleet_commander",
     *   "squad_id": 0,
     *   "wing_id": 0
     * }
     * ```
     * @param {Integer} id The fleet id the character is invited to
     * @param {Object} invitation Simple object specifying character to invite,
     *   and their fleet position on accept
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_members
     * @esi_link FleetsApi.postFleetsFleetIdMembers
     */
    exports.inviteMember = function(id, invitation, accessToken) {
        return newRequest(ESI.FleetsApi, 'postFleetsFleetIdMembers', 
                          [id, invitation], accessToken);
    };

    /**
     * Remove a member from a fleet with the ESI endpoint. This makes
     * an HTTP DELETE request to [`/fleets/{fleetId}/members/{memberId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_members_member_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success.
     *
     * @param {Integer} fleetId The fleet id the member is removed from
     * @param {Integer} memberId The member character id to kick
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_members_member_id
     * @esi_link FleetsApi.deleteFleetsFleetIdMembersMemberId
     */
    exports.kickMember = function(fleetId, memberId, accessToken) {
        return newRequest(ESI.FleetsApi, 'deleteFleetsFleetIdMembersMemberId', 
                          [fleetId, memberId], accessToken);
    };

    /**
     * Move or update a member in a fleet with the ESI endpoint. This makes
     * an HTTP PUT request to [`/fleets/{fleetId}/members/{memberId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_members_member_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success. An example move order looks like:
     * ```
     * {
     *   "role": "fleet_commander",
     *   "squad_id": 0,
     *   "wing_id": 0
     * }
     * ```
     *
     * @param {Integer} fleetId The fleet id the member is in
     * @param {Integer} memberId The member character id to update
     * @param {Object} moveOrder A simple object describing the move or update
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_members_member_id
     * @esi_link FleetsApi.putFleetsFleetIdMembersMemberId
     */
    exports.updateMember = function(fleetId, memberId, moveOrder, accessToken) {
        return newRequest(ESI.FleetsApi, 'putFleetsFleetIdMembersMemberId', 
                          [fleetId, memberId, moveOrder], accessToken);
    };

    /**
     * Delete a squad from a fleet with the ESI endpoint. This makes
     * an HTTP DELETE request to [`/fleets/{fleetId}/squads/{squadId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_squads_squad_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success.
     *
     * @param {Integer} fleetId The fleet id the squad is removed from
     * @param {Integer} squadId The squad to remove
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_squads_squad_id
     * @esi_link FleetsApi.deleteFleetsFleetIdSquadsSquadId
     */
    exports.removeSquad = function(fleetId, squadId, accessToken) {
        return newRequest(ESI.FleetsApi, 'deleteFleetsFleetIdSquadsSquadId', 
                          [fleetId, squadId], accessToken);
    };

    /**
     * Rename a squad in a fleet with the ESI endpoint. This makes
     * an HTTP PUT request to [`/fleets/{fleetId}/squads/{squadId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_squads_squad_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success. The update parameters are stored in an 
     * object like:
     *
     * ```
     * {
     *   "name": "string"
     * }
     * ```
     *
     * @param {Integer} fleetId The fleet id the squad is in
     * @param {Integer} squadId The squad to update
     * @param {Object} updates The update options for the squad
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_squads_squad_id
     * @esi_link FleetsApi.putFleetsFleetIdSquadsSquadId
     */
    exports.updateSquad = function(fleetId, squadId, updates, accessToken) {
        return newRequest(ESI.FleetsApi, 'putFleetsFleetIdSquadsSquadId', 
                          [fleetId, squadId, updates], accessToken);
    };

    /**
     * Get information on all wings in a fleet with the ESI endpoint. This makes
     * an HTTP GET request to [`/fleets/{id}/wings/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_wings).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
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
     * @param {Integer} id The fleet id to query
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @param {String} language Localization code for the response, which will
     *   override the default configured localization
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see module:eve_swagger_interface.languages
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/get_fleets_fleet_id_wings
     * @esi_link FleetsApi.getFleetsFleetIdWings
     */
    exports.getWings = function(id, accessToken, language) {
        var opts = {};
        if (language) {
            opts.acceptLanguage = language;
        }
        return newRequestOpt(ESI.FleetsApi, 'getFleetsFleetIdWings', 
                             [id], opts, accessToken);
    };

    /**
     * Add a new wing to a fleet with the ESI endpoint. This makes
     * an HTTP POST request to [`/fleets/{id}/wings/`](https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_wings).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * {
     *   "wing_id": 123
     * }
     * ```
     *
     * @param {Integer} fleetId The fleet id to modify
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_wings
     * @esi_link FleetsApi.postFleetsFleetIdWings
     */
    exports.addWing = function(id, accessToken) {
        return newRequest(ESI.FleetsApi, 'postFleetsFleetIdWings', 
                          [id], accessToken);
    };

    /**
     * Remove a wing from a fleet with the ESI endpoint. This makes
     * an HTTP DELETE request to [`/fleets/{fleetId}/wings/{wingId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_wings_wing_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success.
     *
     * @param {Integer} fleetId The fleet id to modify
     * @param {Integer} wingId The wing id to remove from the fleet
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/delete_fleets_fleet_id_wings_wing_id
     * @esi_link FleetsApi.deleteFleetsFleetIdWingsWingId
     */
    exports.removeWing = function(fleetId, wingId, accessToken) {
        return newRequest(ESI.FleetsApi, 'deleteFleetsFleetIdWingsWingId', 
                          [fleetId, wingId], accessToken);
    };

    /**
     * Rename a wing in a fleet with the ESI endpoint. This makes
     * an HTTP PUT request to [`/fleets/{fleetId}/wings/{wingId}/`](https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_wings_wing_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an empty object on success. The update parameters are stored in an 
     * object like:
     *
     * ```
     * {
     *   "name": "string"
     * }
     * ```
     *
     * @param {Integer} fleetId The fleet id the wing is in
     * @param {Integer} swingId The wing to update
     * @param {Object} updates The update options for the wing
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/put_fleets_fleet_id_wings_wing_id
     * @esi_link FleetsApi.putFleetsFleetIdWingsWingId
     */
    exports.updateWing = function(fleetId, wingId, updates, accessToken) {
        return newRequest(ESI.FleetsApi, 'putFleetsFleetIdWingsWingId', 
                          [fleetId, wingId, updates], accessToken);
    };

    /**
     * Add a new sequad to a fleet's wing with the ESI endpoint. This makes
     * an HTTP POST request to [`/fleets/{fleetId}/wings/{wingId}/squads`](https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * {
     *   "squad_id": 123
     * }
     * ```
     *
     * @param {Integer} fleetId The fleet id to modify
     * @param {Integer} wingId The wing id the squad is added to
     * @param {String} accessToken Optional; the access token to authenticate 
     *   the request. If not provided, the default access token provided to the 
     *   factory is used; if that was not set then this request will fail.     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Fleets/post_fleets_fleet_id_wings_wing_id_squads
     * @esi_link FleetsApi.postFleetsFleetIdWingsWingIdSquads
     */
    exports.addSquad = function(fleetId, wingId, accessToken) {
        return newRequest(ESI.FleetsApi, 'postFleetsFleetIdWingsWingIdSquads', 
                          [fleetId, wingId], accessToken);
    };

    return exports;
};
