const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter over the end points handling the planetary interaction
 * colonies for a character via functions in the [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Colonies` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Colonies#layout layout} or {@link Colonies#all all}
 * if no id is given.
 */
class Colonies extends CallableInstance {
  /**
   * Create a new Colonies function for the character, including its SSO token.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The id of the character whose PI is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(id => (id ? this.layout(id) : this.all()));
    this._agent = agent;
    this._id = characterId;
    this._token = token;
  }

  /**
   * @esi_route get_characters_character_id_planets_planet_id
   * @esi_example esi.characters(1, 'token').colonies.layout(2)
   *
   * @param planetId {Number}
   * @returns {Promise.<Object>}
   */
  layout(planetId) {
    return this._agent.auth(this._token)
    .get('/v2/characters/{character_id}/planets/{planet_id}/', {
      path: {
        'character_id': this._id,
        'planet_id': planetId
      }
    });
  }

  /**
   * @esi_route get_characters_character_id_planets
   * @esi_example esi.characters(1, 'token').colonies()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/planets/',
        { path: { 'character_id': this._id } });
  }
}

module.exports = Colonies;
