const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter that provides functions for removing a particular fitting of a
 * character, specified by id via functions in the
 * [fittings](https://esi.tech.ccp.is/latest/#/Fittings) ESI endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Fitting {
  /**
   * Create a new Fitting represented as `fittingId` from the given `fittings`.
   *
   * @param fittings {Fittings} The fittings owning the fit
   * @param fittingId {Number} The fitting id that is used for all requests
   * @constructor
   */
  constructor(fittings, fittingId) {
    this._fit = fittings;
    this._id = fittingId;
  }

  /**
   * Delete the fitting from the given character's list via the ESI end point.
   * This makes an HTTP DELETE request to
   * [`/characters/{characterId}/fittings/{fittingId}/`](https://esi.tech.ccp.is/latest/#!/Fittings/delete_characters_character_id_fittings_fitting_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * empty object from the response JSON model.
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FittingsApi.deleteCharactersCharacterIdFittingsFittingId
   */
  del() {
    return this._fit._api.fittings(this._fit._token)
    .newRequest('deleteCharactersCharacterIdFittingsFittingId',
        [this._fit._id, this._id]);
  }
}

/**
 * An api adapter over the end points handling a character's fittings via
 * functions in the [fittings](https://esi.tech.ccp.is/latest/#/Fittings) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Fittings` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Fittings#get get} or {@link Fittings#all all} if no
 * id is provided.
 */
class Fittings extends ExtendableFunction {
  /**
   * Create a new Fittings function using the given `api`, for the
   * character described by `characterId` with SSO access from `token`.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The character id whose fittings are accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(id => (id ? this.get(id) : this.all()));
    this._api = api;
    this._id = characterId;
    this._token = token;
  }

  /**
   * Get all fittings for the character via the ESI end point. This makes
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
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FittingsApi.getCharactersCharacterIdFittings
   */
  all() {
    return this._api.fittings(this._token)
    .newRequest('getCharactersCharacterIdFittings', [this._id]);
  }

  /**
   * Create a new fitting for the charactervia the ESI end point. This makes an
   * HTTP POST request to
   * [`/characters/{characterId}/fittings/`](https://esi.tech.ccp.is/latest/#!/Fittings/post_characters_character_id_fittings).
   * The request is returned as an asynchronous Promise that resolves to an
   * object containing the created fit's id. An example return value looks
   * like:
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
   * @param {Object} fitting The fitting specification
   *   access token is used. This will fail if neither is available.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link FittingsApi.postCharactersCharacterIdFittings
   */
  add(fitting) {
    return this._api.fittings(this._token)
    .newRequest('postCharactersCharacterIdFittings', [this._id],
        { fitting: fitting });
  }

  /**
   * Create a new Fitting end point targeting the particular fitting by
   * `id`.
   *
   * @param id {Number} The fitting id
   * @returns {Fitting}
   */
  get(id) {
    return new Fitting(this, id);
  }
}

module.exports = Fittings;
