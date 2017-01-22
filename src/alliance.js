/**
 * A container for the [alliance](https://esi.tech.ccp.is/latest/#/Alliance) ESI
 * endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the {@link module:eve_swagger_interface} is
 * loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Alliance
 * @param api The internal API instance configured by the root module
 * @module alliance
 */
module.exports = function(api) {
  var newRequest = api.newRequest;
  var ESI = api.esi;

  var exports = {};

  /**
   * Get all alliance id's the ESI endpoint. This makes an HTTP GET request to
   * [`alliances/`](https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   99000001,
   *   99000002
   * ]
   * ```
   *
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances
   * @esi_link AllianceApi.getAlliances
   */
  exports.getAll = function() {
    return newRequest(ESI.AllianceApi, 'getAlliances', []);
  };

  /**
   * Get the names for a list of alliance ids from the ESI endpoint. This makes
   * an HTTP GET request to
   * [`alliances/names/`](https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "alliance_id": 1000171,
   *     "alliance_name": "Republic University"
   *   }
   * ]
   * ```
   *
   * @param {Array.<Integer>} ids The alliance ids to look up
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_names
   * @esi_link AllianceApi.getAlliancesNames
   */
  exports.getNamesOf = function(ids) {
    return newRequest(ESI.AllianceApi, 'getAlliancesNames', [ids]);
  };

  /**
   * Get the public info of the alliance from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`alliances/{id}/`](https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_alliance_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "alliance_name": "C C P Alliance",
   *   "date_founded": "2016-06-26T21:00:00Z",
   *   "executor_corp": 98356193,
   *   "ticker": "<C C P>"
   * }
   * ```
   *
   * @param {Integer} id The alliance id to look up
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_alliance_id
   * @esi_link AllianceApi.getAlliancesAllianceId
   */
  exports.get = function(id) {
    return newRequest(ESI.AllianceApi, 'getAlliancesAllianceId', [id]);
  };

  /**
   * Get the corporations of the alliance from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`alliances/{id}/corporations/`](https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_alliance_id_corporations).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   98000001
   * ]
   * ```
   *
   * @param {Integer} id The alliance id to look up
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_alliance_id_corporations
   * @esi_link AllianceApi.getAlliancesAllianceIdCorporations
   */
  exports.getCorporations = function(id) {
    return newRequest(ESI.AllianceApi, 'getAlliancesAllianceIdCorporations',
        [id]);
  };

  /**
   * Get the icon URLs the alliance from the ESI endpoint. This makes an HTTP
   * GET request to
   * [`alliances/{id}/icons/`](https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_alliance_id_icons).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "px128x128":
   * "https://imageserver.eveonline.com/Alliance/503818424_128.png",
   *   "px64x64":
   * "https://imageserver.eveonline.com/Alliance/503818424_64.png"
   * }
   * ```
   *
   * @param {Integer} id The alliance id to look up
   * @return {external:Promise} A Promise that resolves to the response of
   *   the request
   * @see https://esi.tech.ccp.is/latest/#!/Alliance/get_alliances_alliance_id_icons
   * @esi_link AllianceApi.getAlliancesAllianceIdIcons
   */
  exports.getIcons = function(id) {
    return newRequest(ESI.AllianceApi, 'getAlliancesAllianceIdIcons', [id]);
  };

  return exports;
};
