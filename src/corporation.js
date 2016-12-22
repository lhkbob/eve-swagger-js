/**
 * A container for the [corporation](https://esi.tech.ccp.is/latest/#/Corporation)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Corporation
 * @param api The internal API instance configured by the root module
 * @module corporation
 */
module.exports = function(api) {
    var newRequest = api.newRequest;
    var ESI = api.esi;

    var exports = {};
    /**
     * Get a corporation's public info from the ESI endpoint. This makes 
     * an HTTP GET request to [`corporations/{id}/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * {
     *   "alliance_id": 434243723,
     *   "ceo_id": 180548812,
     *   "corporation_name": "C C P",
     *   "member_count": 656,
     *   "ticker": "-CCP-"
     * }
     * ```
     *
     * @param {Integer} id The corporation id
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id
     * @esi_link CorporationApi.getCorporationsCorporationId
     */
    exports.get = function(id) {
        return newRequest(ESI.CorporationApi, 
                          'getCorporationsCorporationId', [id]);
    };

    /**
     * Get a corporation's alliance history from the ESI endpoint. This 
     * makes an HTTP GET request to [`corporations/{id}/alliancehistory/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_alliancehistory).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * [
     *   {
     *     "alliance": {
     *       "alliance_id": 99000006,
     *       "is_deleted": false
     *     },
     *     "record_id": 23,
     *     "start_date": "2016-10-25T14:46:00Z"
     *   },
     *   {
     *     "record_id": 1,
     *     "start_date": "2015-07-06T20:56:00Z"
     *   }
     * ]
     * ```
     *
     * @param {Integer} id The corporation id
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_alliancehistory
     * @esi_link CorporationApi.getCorporationsCorporationIdAllianceHistory
     */
    exports.getAllianceHistory = function(id) {
        return newRequest(ESI.CorporationApi, 
                          'getCorporationsCorporationIdAllianceHistory', [id]);
    };

    /**
     * Get a corporation's icon URLs from the ESI endpoint. This makes 
     * an HTTP GET request to [`corporations/{id}/icons/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_icons).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * {
     *   "px128x128": "https://imageserver.eveonline.com/Corporation/1000010_128.png",
     *   "px256x256": "https://imageserver.eveonline.com/Corporation/1000010_256.png",
     *   "px64x64": "https://imageserver.eveonline.com/Corporation/1000010_64.png"
     * }
     * ```
     *
     * @param {Integer} id The corporation id
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_icons
     * @esi_link CorporationApi.getCorporationsCorporationIdIcons
     */
    exports.getIcons = function(id) {
        return newRequest(ESI.CorporationApi, 
                          'getCorporationsCorporationIdIcons', [id]);
    };

    /**
     * Get a corporation's member list from the ESI endpoint. This 
     * makes an HTTP GET request to [`corporations/{id}/members/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_members).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * [
     *   {
     *     "character_id": 90000001
     *   },
     *   {
     *     "character_id": 90000002
     *   }
     * ]
     * ```
     *
     * @param {Integer} id The corporation id
     * @param {String} accessToken Optional; the SSO access token of a member of
     *   the corporation, used to authenticate the request. If not provided, the 
     *   default access token provided to the factory is used; if that was not 
     *   set then this request will fail.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_members
     * @esi_link CorporationApi.getCorporationsCorporationIdMembers
     */
    exports.getMembers = function(id, accessToken) {
        return newRequest(ESI.CorporationApi, 
                          'getCorporationsCorporationIdMembers', 
                          [id], accessToken);
    };

    /**
     * Get a corporation's member list with roles for each character from 
     * the ESI endpoint. This makes an HTTP GET request to 
     * [`corporations/{id}/roles/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_roles).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * [
     *   {
     *     "character_id": 1000171,
     *     "roles": [
     *       "Director",
     *       "Station_Manager"
     *     ]
     *   }
     * ]
     * ```
     *
     * @param {Integer} id The corporation id
     * @param {String} accessToken Optional; the SSO access token of a member of 
     *   the corporation that has the personnel manager or any other grantable
     *   role, used to authenticate the request. If not provided, the default 
     *   access token provided to the factory is used; if that was not set then 
     *   this request will fail.
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_roles
     * @esi_link CorporationApi.getCorporationsCorporationIdRoles
     */
    exports.getRoles = function(id, accessToken) {
        return newRequest(ESI.CorporationApi, 
                          'getCorporationsCorporationIdRoles',
                          [id], accessToken);
    };

    /**
     * Get the names for a list of corporation ids from the ESI endpoint. 
     * This makes an HTTP GET request to [`corporations/names/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_names).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * [
     *   {
     *     "corporation_id": 1000171,
     *     "corporation_name": "Republic University"
     *   }
     * ]
     * ```
     *
     * @param {Array.<Integer>} ids The corporation ids to lookup
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_names
     * @esi_link CorporationApi.getCorporationsNames
     */
    exports.getNamesOf = function(ids) {
        return newRequest(ESI.CorporationApi, 'getCorporationsNames', 
                          [ids]);
    };

    return exports;
};
