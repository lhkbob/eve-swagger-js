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
   * Create a new Bookmarks function using the given `api`, for the character
   * described by `characterId` with SSO access from `token`.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The character id whose calendar is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(() => this.all());
    this._api = api;
    this._id = characterId;
    this._token = token;
  }

  /**
   * Get the character's bookmark folders from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`characters/{id}/bookmarks/folders/`](https://esi.tech.ccp.is/latest/#!/Bookmarks/get_characters_character_id_bookmarks_folders).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "folder_id": 5,
   *     "name": "Icecream",
   *     "owner_id": 90000001
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of  the request
   * @esi_link BookmarksApi.getCharactersCharacterIdBookmarksFolders
   */
  folders() {
    return this._api.bookmarks(this._token)
    .newRequest('getCharactersCharacterIdBookmarksFolders', [this._id]);
  }

  /**
   * Get the character's personal bookmarks from the ESI endpoint. This makes
   * an
   * HTTP GET request to
   * [`characters/{id}/bookmarks/`](https://esi.tech.ccp.is/latest/#!/Bookmarks/get_characters_character_id_bookmarks).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "bookmark_id": 32,
   *     "create_date": "2016-08-09T11:57:47Z",
   *     "creator_id": 90000001,
   *     "folder_id": 5,
   *     "memo": "aoeu ( Citadel )",
   *     "note": "",
   *     "owner_id": 90000001,
   *     "target": {
   *       "item": {
   *         "item_id": 1000000012668,
   *        "type_id": 35832
   *       },
   *       "location_id": 30000005
   *     }
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link BookmarksApi.getCharactersCharacterIdBookmarks
   */
  all() {
    return this._api.bookmarks(this._token)
    .newRequest('getCharactersCharacterIdBookmarks', [this._id]);
  }
}

module.exports = Bookmarks;
