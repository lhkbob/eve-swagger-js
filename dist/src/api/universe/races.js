"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Race} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Races API instance
 */
function makeRaces(agent) {
    return function () {
        return agent.request('get_universe_races', undefined);
    };
}
exports.makeRaces = makeRaces;
//# sourceMappingURL=races.js.map