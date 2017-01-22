/**
 * A container for the [fittings](https://esi.tech.ccp.is/latest/#/Fittings) ESI
 * endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:character} is loaded and
 * configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Fittings
 * @param api The internal API instance configured by the root module
 * @module character/fittings
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var newRequestOpt = api.newRequestOpt;
  var ESI = api.esi;

  var exports = {};

  /**
   * Get all fittings for the given character via the ESI end point. This makes
   * an HTTP GET request to
   * [`/characters/{id}/fittings/`](https://esi.tech.ccp.is/latest/#!/Fittings/get_characters_character_id_fittings).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "description": "Awesome Vindi fitting",
   *     "fitting_id": 1,
   *     "items": [
   *       {
   *         "flag": 12,
   *         "quantity": 1,
   *         "type_id": 1234
   *       }
   *     ],
   *     "name": "Best Vindicator",
   *     "ship_type_id": 123
   *   }
   * ]
   * ```
   *
   * @param {Integer} id The character id
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Fittings/get_characters_character_id_fittings
   * @esi_link FittingsApi.getCharactersCharacterIdFittings
   */
  exports.getAll = function(id, accessToken) {
    return newRequest(ESI.FittingsApi, 'getCharactersCharacterIdFittings', [id],
        accessToken);
  };

  /**
   * Remove the fitting by its id from the given character's list via the ESI
   * end point. This makes an HTTP DELETE request to
   * [`/characters/{characterId}/fittings/{fittingId}/`](https://esi.tech.ccp.is/latest/#!/Fittings/delete_characters_character_id_fittings_fitting_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object from the response JSON model.
   *
   * @param {Integer} characterId The character id
   * @param {Integer} fittingId The fitting id
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Contacts/delete_characters_character_id_fittings_fitting_id
   * @esi_link FittingsApi.deleteCharactersCharacterIdFittingsFittingId
   */
  exports.remove = function(characterId, fittingId, accessToken) {
    return newRequest(ESI.FittingsApi,
        'deleteCharactersCharacterIdFittingsFittingId',
        [characterId, fittingId], accessToken);
  };

  /**
   * Create a new fitting for the charactervia the ESI end point. This makes an
   * HTTP POST request to
   * [`/characters/{characterId}/fittings/`](https://esi.tech.ccp.is/latest/#!/Fittings/post_characters_character_id_fittings).
   * The request is returned as an asynchronous Promise that resolves to an
   * object containing the created fit's id. An example return value looks like:
   *
   * ```
   * {
   *   "fitting_id": 2
   * }
   * ```
   *
   * The fitting is described by an object containing all items, an example
   * being:
   *
   * ```
   * {
   *   "description": "string",
   *   "items": [
   *     {
   *       "flag": 0,
   *       "quantity": 0,
   *       "type_id": 0
   *     }
   *   ],
   *   "name": "string",
   *   "ship_type_id": 0
   * }
   * ```
   *
   * @param {Integer} characterId The character id
   * @param {Object} fitting The fitting specification
   * @param {String} accessToken Optional; the access token to authenticate
   *   contact access of the sending character. If not provided, the default
   *   access token is used. This will fail if neither is available.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Fittings/post_characters_character_id_fittings
   * @esi_link FittingsApi.postCharactersCharacterIdFittings
   */
  exports.add = function(characterId, fitting, accessToken) {
    return newRequestOpt(ESI.FittingsApi, 'postCharactersCharacterIdFittings',
        [characterId], {fitting: fitting}, accessToken);
  };

  return exports;
};
