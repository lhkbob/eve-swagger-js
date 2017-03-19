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
   * @esi_route delete_characters_character_id_fittings_fitting_id
   *
   * @returns {Promise.<Object>}
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
   * @esi_route get_characters_character_id_fittings
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._api.fittings(this._token)
    .newRequest('getCharactersCharacterIdFittings', [this._id]);
  }

  /**
   * @esi_route post_characters_character_id_fittings
   * @esi_returns id:fitting_id
   *
   * @param fitting {Object}
   * @returns {Promise.<Number>}
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
