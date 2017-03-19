const ExtendableFunction = require('../internal/ExtendableFunction');

function defaultSearch(api, categories, strict, text) {
  return api.search()
  .newRequest('getSearch', [categories, text], { strict: strict })
  .then(result => {
    if (categories.length == 1) {
      // Return array for that category
      return result[categories[0]];
    } else {
      // Return everything
      return result;
    }
  });
}

function characterSearch(api, categories, strict, character, token, text) {
  return api.search(token)
  .newRequest('getCharacterCharacterIdSearch', [categories, character, text],
      { strict: strict })
  .then(result => {
    if (categories.length == 1) {
      // Return array for that category
      return result[categories[0]];
    } else {
      // Return everything
      return result;
    }
  });
}

/**
 * An api adapter over the end points handling search and character search via
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
   * otherwise it will search over all categories. If `categories` is a single
   * item, the return result of the search is simplified to be the array of ids
   * for that category (instead of an outer object with keys per category).
   *
   * Categories must from the following enumeration:
   *
   * + `agent`
   * + `alliance`
   * + `character`
   * + `constellation`
   * + `corporation`
   * + `faction`
   * + `inventorytype`
   * + `region`
   * + `solarsystem`
   * + `station`
   * + `wormhole`
   *
   * If `characterId` and `accessToken` are provided then the search will use
   * character specific search end point, and the `structure` category can also
   * be used.
   *
   * @param api {ApiProvider} The api provider
   * @param categories {Array.<String>} Optional; the categories search to through
   * @param characterId {Number} Optional; the character id of the search
   * @param accessToken {String} Optional; SSO token for the provided character,
   *    must be provided if `characterId` is given
   */
  constructor(api, categories = [], characterId = 0, accessToken = '') {
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

      if (this._character != 0 && this._token != '') {
        this._categories.push('structure');
      }
    }
  }

  /**
   * @esi_route get_search
   * @esi_param search - text
   * @esi_param !categories
   * @esi_param strict - false
   *
   * However, if the Search instance is configured to search over only a single
   * category then the Promise simply resolves to the array of ids (e.g. the
   * category was fetched from the response dictionary of category to array).
   *
   * @param {String} text The search terms of the query
   * @return {Promise.<Object>} Or a `Promise.<Array.<Number>>` for a
   *    single-category search.
   */
  get(text) {
    return this._doSearch(text, false);
  }

  /**
   * @esi_route get_search
   * @esi_param search - text
   * @esi_param !categories
   * @esi_param strict - true
   *
   * However, if the Search instance is configured to search over only a single
   * category then the Promise simply resolves to the array of ids (e.g. the
   * category was fetched from the response dictionary of category to array).
   *
   * @param {String} text The search terms of the query
   * @return {Promise.<Object>} Or a `Promise.<Array.<Number>>` for a
   *    single-category search.
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
