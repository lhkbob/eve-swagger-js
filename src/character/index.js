/**
 * A container for the [character](https://esi.tech.ccp.is/latest/#/Character)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * This module also folds in smaller character-related end points that are not
 * large enough to warrant their own sub-module. It also exports sub-modules for
 * these larger end points, such as `assets` and `mail`.
 *
 * @see https://esi.tech.ccp.is/latest/#/Character
 * @param api The internal API instance configured by the root module
 * @module character
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var newRequestOpt = api.newRequestOpt;
    var ESI = api.esi;

    var exports = {};

    /**
     * This is an instance of `mail` module configured to use the
     * options provided to the factory. This instance uses a cache shared by the
     * other exposed APIs members.
     *
     * @constant {module:character/mail}
     */
    exports.mail = require('./mail')(api);

    /**
     * Get the names for a list of character ids from the ESI endpoint. 
     * This makes an HTTP GET request to [`characters/names/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_names).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * [
     *   {
     *     "character_id": 95465499,
     *     "character_name": "CCP Bartender"
     *   }
     * ]
     * ```
     *
     * @param {Array.<Integer>} ids The character ids to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Character/get_characters_names
     * @esi_link CharacterApi.getCharactersNames
     */
    exports.getNamesOf = function(ids) {
        return newRequest(ESI.CharacterApi, 'getCharactersNames', [ids]);
    };

    /**
     * Get the public info of the character from the ESI endpoint. 
     * This makes an HTTP GET request to [`characters/{id}/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * {
     *   "ancestry_id": 19,
     *   "birthday": "2015-03-24T11:37:00Z",
     *   "bloodline_id": 3,
     *   "corporation_id": 109299958,
     *   "description": "",
     *   "gender": "male",
     *   "name": "CCP Bartender",
     *   "race_id": 2
     * }
     * ```
     *
     * @param {Integer} id The character id to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Characte/get_characters_character_id
     * @esi_link CharacterApi.getCharactersCharacterId
     */
    exports.get = function(id) {
        return newRequest(ESI.CharacterApi, 'getCharactersCharacterId', [id]);
    };

    /**
     * Get a character's corporation history from the ESI endpoint. This 
     * makes an HTTP GET request to [`characters/{id}/corporationhistory/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id_corporationhistory).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * [
     *   {
     *     "corporation_id": 90000001,
     *     "is_deleted": false,
     *     "record_id": 500,
     *     "start_date": "2016-06-26T20:00:00Z"
     *   },
     *   {
     *     "corporation_id": 90000002,
     *     "is_deleted": false,
     *     "record_id": 501,
     *     "start_date": "2016-07-26T20:00:00Z"
     *   }
     * ]
     * ```
     *
     * @param {Integer} id The character id
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id_corporationhistory
     * @esi_link CorporationApi.getCharactersCharacterIdCorporationHistory
     */
    exports.getCorporationHistory = function(id) {
        return newRequest(ESI.CharacterApi, 
                          'getCharactersCharacterIdCorporationHistory', [id]);
    };

    /**
     * Get a character's portrait URLs from the ESI endpoint. This makes 
     * an HTTP GET request to [`characters/{id}/portraits/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id_portraits).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     *
     * ```
     * {
     *   "px128x128": "https://imageserver.eveonline.com/Character/95465499_128.jpg",
     *   "px256x256": "https://imageserver.eveonline.com/Character/95465499_256.jpg",
     *   "px512x512": "https://imageserver.eveonline.com/Character/95465499_512.jpg",
     *   "px64x64": "https://imageserver.eveonline.com/Character/95465499_64.jpg"
     * }
     * ```
     *
     * @param {Integer} id The character id
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id_portraits
     * @esi_link CorporationApi.getCharactersCharacterIdPortraits
     */
    exports.getPortraits = function(id) {
        return newRequest(ESI.CharacterApi, 
                          'getCharactersCharacterIdPortraits', [id]);
    };

    return exports;
};
