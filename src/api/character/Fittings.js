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
   * @esi_example esi.characters(1, 'token').fittings(2).del()
   *
   * @returns {Promise.<Object>}
   */
  del() {
    return this._fit._agent.auth(this._fit._token)
    .del('/v1/characters/{character_id}/fittings/{fitting_id}/', {
      path: {
        'character_id': this._fit._id,
        'fitting_id': this._id
      }
    });
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
   * Create a new Fittings function using the given `agent`, for the
   * character described by `characterId` with SSO access from `token`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The character id whose fittings are accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(id => (id ? this.get(id) : this.all()));
    this._agent = agent;
    this._id = characterId;
    this._token = token;
  }

  /**
   * @esi_route get_characters_character_id_fittings
   * @esi_example esi.characters(1, 'token').fittings()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/fittings/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route post_characters_character_id_fittings
   * @esi_returns id:fitting_id
   * @esi_example esi.characters(1, 'token').fittings.add({...})
   *
   * @param fitting {Object}
   * @returns {Promise.<Number>}
   */
  add(fitting) {
    return this._agent.auth(this._token)
    .post('/v1/characters/{character_id}/fittings/', {
      path: { 'character_id': this._id },
      body: fitting
    }).then(result => {
      return result.fitting_id;
    });
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
