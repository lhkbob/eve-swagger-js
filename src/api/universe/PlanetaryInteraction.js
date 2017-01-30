/**
 * An api adaptor that provides functions for accessing the non-authenticated
 * [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction) ESI end
 *  points. You should not usually instantiate this directly as its constructor
 * requires an internal api instance.
 */
class PlanetaryInteraction {
  /**
   * Create a new PlanetaryInteraction instance using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    this._api = api;
  }

  /**
   * Get a planetary interaction schematic's public info from the ESI endpoint.
   * This makes an HTTP GET request to
   * [`/universe/schematics/{id}/`](https://esi.tech.ccp.is/latest/#!/Planetary_Interaction/get_universe_schematics_schematic_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "cycle_time": 1800,
   *   "schematic_name": "Bacteria"
   * }
   * ```
   *
   * @param {Number} id The schematic id to look up
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link PlanetaryInteractionApi.getUniverseSchematicsSchematicId
   */
  schematic(id) {
    return this._api.planetaryInteraction()
    .newRequest('getUniverseSchematicsSchematicId', [id]);
  }
}

module.exports = PlanetaryInteraction;