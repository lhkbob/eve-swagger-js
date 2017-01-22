/**
 * A container for the [search](https://esi.tech.ccp.is/latest/#/Search) ESI
 * endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:eve_swagger_interface} is
 * loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Search
 * @param api The internal API instance configured by the root module
 * @module search
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var newRequestOpt = api.newRequestOpt;
  var ESI = api.esi;

  /**
   * Search constructor that configures the 'strict' policy for all query
   * requests it makes via ESI.
   *
   * @param {boolean} strict True if the search terms are strict
   * @param {Integer} characterId Optional id to switch to character search
   * @param {String} accessToken Optional access token for use with the id
   * @return A new Search instance
   * @private
   */
  var Search = function(strict, characterId, accessToken) {
    this.strict = strict;
    this.characterId = characterId;
    this.accessToken = accessToken;

    /**
     * The enumeration of categories that can be searched through. Valid
     * categories are:
     *
     * 1. `'agent'`
     * 2. `'allliance'`
     * 3. `'character'`
     * 4. `'constellation'`
     * 5. `'corporation'`
     * 6. `'faction'`
     * 7. `'inventoryType'`
     * 8. `'region'`
     * 9. `'solarsystem'`
     * 10. `'faction'`
     * 11. `'wormhole'`
     *
     * @constant {Array.<String>}
     * @alias categories
     * @memberof module:search
     */
    this.categories = [
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
  };

  /**
   * Return a search module configured to search within the context of the given
   * character (requiring an access token). The returned module provides the
   * same methods and functionality as the base {@link module:search} instance.
   * If this was called on {@link module:search.strict search.strict} then the
   * returned instance will also make strict queries.
   *
   * All search queries will be routed through
   * [`/character/{id}/search/`](https://esi.tech.ccp.is/latest/#!/Search/get_characters_character_id_search)
   * instead of the regular `/search/` URL that the non-character enabled search
   * queries are directed to.
   *
   * @param {Integer} id The character id that will be searched with
   * @param {String} accessToken Optional; The access token used to
   *   authenticate the search requests. If not provided, the default access
   *   token will be used. If that is undefined search requests will fail with
   *   the returned instance.
   * @return {module:search} A character enabled search instance
   * @alias forCharacter
   * @memberof module:search
   */
  Search.prototype.forCharacter = function(id, accessToken) {
    return new Search(this.strict, id, accessToken);
  };

  /**
   * Get the search results from the ESI endpoint that match the given query
   * `text`, restricted to the `categories` set (stored as an array). The
   * optional `language` parameter can be used to define the language and locale
   * of the query's text. If `categories` is `null`, `undefined`, or empty then
   * all categories are queried.
   *
   * This makes an HTTP GET request to
   * [`/search/`](https://esi.tech.ccp.is/latest/#!/Search/get_search). The
   * request is returned as an asynchronous Promise that resolves to an object
   * parsed from the response JSON model. An example value looks like:
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
   * @param {Array.<String>} categories Optional array of categories to search
   *   over. If not provided, or empty, all categories will be queried.
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see module:search.categories
   * @see https://esi.tech.ccp.is/latest/#!/Search/get_search
   * @esi_link SearchApi.getSearch
   * @alias get
   * @memberof module:search
   */
  Search.prototype.get = function(text, categories, language) {
    var opt = { strict: this.strict };
    if (!language) {
      // Take language from default acceptLanguage setting
      if (api.opts.language) {
        language = api.opts.language;
      } else {
        language = 'en-us';
      }
    }
    if (language == 'en') {
      // Rewrite 'en' to 'en-us' since the search enum is a little
      // different in the codes it supports.
      language = 'en-us';
    }

    categories = categories || [];
    if (categories.length == 0) {
      this.categories;
    }

    // The search ESI call looks at language property, not acceptLanguage
    // like which is used in other localized calls.
    var opts = {
      strict: this.strict,
      language: language
    };
    if (this.characterId) {
      return newRequestOpt(ESI.SearchApi, 'getCharactersCharacterIdSearch',
          [this.characterId, text], opts, this.accessToken);
    } else {
      return newRequestOpt(ESI.SearchApi, 'getSearch', [text, categories],
          opts);
    }
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * agents in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['agent']`. Note that the resolved response
   * object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getAgents
   * @memberof module:search
   */
  Search.prototype.getAgents = function(text, language) {
    return this.get(text, ['agent'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * alliances in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['alliance']`. Note that the resolved
   * response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getAlliances
   * @memberof module:search
   */
  Search.prototype.getAlliances = function(text, language) {
    return this.get(text, ['alliance'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * characters in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['character']`. Note that the resolved
   * response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getCharacters
   * @memberof module:search
   */
  Search.prototype.getCharacters = function(text, language) {
    return this.get(text, ['character'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * constellations in EVE. This is equivalent to a call to {@link
   * module:search.get get} with the category set to `['constellation']`. Note
   * that the resolved response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getConstellations
   * @memberof module:search
   */
  Search.prototype.getConstellations = function(text, language) {
    return this.get(text, ['constellation'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * corporations in EVE. This is equivalent to a call to {@link
   * module:search.get get} with the category set to `['corporation']`. Note
   * that the resolved response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getCorporations
   * @memberof module:search
   */
  Search.prototype.getCorporations = function(text, language) {
    return this.get(text, ['corporation'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * factions in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['faction']`. Note that the resolved
   * response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getFactions
   * @memberof module:search
   */
  Search.prototype.getFactions = function(text, language) {
    return this.get(text, ['faction'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * item types in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['inventoryType']`. Note that the resolved
   * response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getInventoryTypes
   * @memberof module:search
   */
  Search.prototype.getInventoryTypes = function(text, language) {
    return this.get(text, ['inventoryType'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * regions in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['region']`. Note that the resolved response
   * object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getRegions
   * @memberof module:search
   */
  Search.prototype.getRegions = function(text, language) {
    return this.get(text, ['region'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * solar systems in EVE. This is equivalent to a call to {@link
   * module:search.get get} with the category set to `['solarsystem']`. Note
   * that the resolved response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getSolarSystems
   * @memberof module:search
   */
  Search.prototype.getSolarSystems = function(text, language) {
    return this.get(text, ['solarsystem'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * stations in EVE. This is equivalent to a call to {@link module:search.get
   * get} with the category set to `['station']`. Note that the resolved
   * response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getStations
   * @memberof module:search
   */
  Search.prototype.getStations = function(text, language) {
    return this.get(text, ['station'], language);
  };

  /**
   * Get the search results from the ESI endpoint for the query `text` over all
   * wormhole categories in EVE. This is equivalent to a call to {@link
   * module:search.get get} with the category set to `['wormhole']`. Note that
   * the resolved response object still includes the type specifier.
   *
   * @param {String} text The search terms of the query
   * @param {String} language Optional language code of the query. If not
   *   provided it defaults to the language specified in the factory or
   *   `'en-us'`.
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @alias getWormholes
   * @memberof module:search
   */
  Search.prototype.getWormholes = function(text, language) {
    return this.get(text, ['wormhole'], language);
  };

  var exports = new Search(false);

  /**
   * Search API variant that makes strict queries, where the default uses
   * non-strict queries.
   *
   * @constant {module:search}
   */
  exports.strict = new Search(true);

  return exports;
};
