const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling a character's bookmarks via
 * functions in the [bookmarks](https://esi.tech.ccp.is/latest/#/Bookmarks)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Bookmarks` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Bookmarks#all all}.
 */
class Bookmarks extends ExtendableFunction {
  /**
   * Create a new Bookmarks function using the given `agent`, for the character
   * described by `characterId` with SSO access from `token`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The character id whose calendar is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(() => this.all());
    this._agent = agent;
    this._id = characterId;
    this._token = token;
  }

  /**
   * @esi_route get_characters_character_id_bookmarks_folders
   *
   * @returns {Promise.<Array.<Object>>}
   */
  folders() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/bookmarks/folders/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_bookmarks
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/bookmarks/',
        { path: { 'character_id': this._id } });
  }
}

module.exports = Bookmarks;
