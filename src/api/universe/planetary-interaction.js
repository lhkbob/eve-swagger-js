/**
 * An api adapter that provides functions for accessing the non-authenticated
 * [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction) ESI end
 *  points. You should not usually instantiate this directly as its constructor
 * requires an internal api instance.
 */
class PlanetaryInteraction {
  /**
   * Create a new PlanetaryInteraction instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    this._agent = agent;
  }

  /**
   * @esi_route get_universe_schematics_schematic_id
   * @esi_param schematic_id - id
   * @esi_example esi.pi.schematic(1)
   *
   * @param {Number} id
   * @return {Promise.<Object>}
   */
  schematic(id) {
    return this._agent.noAuth.get('/v1/universe/schematics/{schematic_id}/',
        { path: { 'schematic_id': id } });
  }
}

module.exports = PlanetaryInteraction;