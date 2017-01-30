const ExtendableFunction = require('../internal/ExtendableFunction');

function defaultSearch(api, categories, strict, text) {
  return api.search()
  .newRequest('getSearch', [text, categories], { strict: strict });
}

function characterSearch(api, categories, strict, character, token, text) {
  return api.search(token)
  .newRequest('getCharacterCharacterIdSearch', [character, text, categories],
      { strict: strict });
}

/**
 * An api adaptor over the end points handling search and character search via
 * functions in the [search](https://esi.tech.ccp.is/latest/#/Search) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Search` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Search#get get}.
 */
class Search extends ExtendableFunction {
  /**
   * Create a new Search api wrapper with the given configuration. If
   * `categories` is provided then the search is restricted to those categories,
   * otherwise it will search over all categories.
   *
   * If `characterId` and `accessToken` are provided then the search will use
   * character specific search end point.
   *
   * @param api {ApiProvider} The api provider
   * @param categories {Array.<String>} Optional; the categories search through
   * @param characterId {String} Optional; the character id of the search
   * @param accessToken {String} Optional; SSO token for the provided character,
   *    must be provided if `characterId` is given
   */
  constructor(api, categories = [], characterId = '', accessToken = '') {
    super(text => this.search(text));

    this._api = api;
    this._categories = categories;
    this._character = characterId;
    this._token = accessToken;

    if (!categories || categories.length == 0) {
      // Make default full list based on character search (which includes
      // structure)
      this._categories = [
        'agent',
        'alliance',
        'character',
        'constellation',
        'corporation',
        'faction',
        'inventoryType',
        'region',
        'solarsystem',
        'station',
        'wormhole'
      ];

      if (this._character != '' && this._token != '') {
        this._categories.push('structure');
      }
    }
  }

  /**
   * Get the search results from the ESI endpoint that match the given query
   * `text`, restricted to the categories selected for this Search instance.
   * This search is not strict.
   *
   * This makes an HTTP GET request to
   * [`/search/`](https://esi.tech.ccp.is/latest/#!/Search/get_search) or
   * [`/character/{id}/search/`](https://esi.tech.ccp.is/latest/#!/Search/get_characters_character_id_search)
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "solarsystem": [
   *     30002510
   *   ],
   *   "station": [
   *     60004588,
   *     60004594,
   *     60005725,
   *     60009106,
   *     60012721,
   *     60012724,
   *     60012727
   *   ]
   * }
   * ```
   *
   * @param {String} text The search terms of the query
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link SearchApi.getSearch
   */
  get(text) {
    return this._doSearch(text, false);
  }

  /**
   * Perform a strict search for `text`, but is otherwise identical to
   * {@link Search.get get}.
   *
   * @param text
   * @returns {Promise}
   * @esi_link SearchApi.getSearch
   */
  strict(text) {
    return this._doSearch(text, true);
  }

  _doSearch(text, strict) {
    if (this._character == '' && this._token == '') {
      // Do a default search
      return defaultSearch(this._api, this._categories, strict, text);
    } else {
      // Do a character search
      return characterSearch(this._api, this._categories, strict,
          this._character, this._token, text);
    }
  }
}

module.exports = Search;
