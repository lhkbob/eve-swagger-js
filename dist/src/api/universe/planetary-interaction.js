"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link PlanetaryInteraction} instance that uses the given
 * `agent` to make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An PlanetaryInteraction API instance
 */
function makePlanetaryInteraction(agent) {
    return function (id) {
        return agent.request('get_universe_schematics_schematic_id', { path: { schematic_id: id } });
    };
}
exports.makePlanetaryInteraction = makePlanetaryInteraction;
//# sourceMappingURL=planetary-interaction.js.map