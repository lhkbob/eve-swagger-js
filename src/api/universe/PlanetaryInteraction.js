/**
 * An api adapter that provides functions for accessing the non-authenticated
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
   * @esi_route get_universe_schematics_schematic_id
   * @esi_param schematic_id - id
   *
   * @param {Number} id
   * @return {Promise.<Object>}
   */
  schematic(id) {
    return this._api.planetaryInteraction()
    .newRequest('getUniverseSchematicsSchematicId', [id]);
  }
}

module.exports = PlanetaryInteraction;