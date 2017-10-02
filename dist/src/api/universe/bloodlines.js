"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Bloodlines} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Bloodlines API instance
 */
function makeBloodlines(agent) {
    return function () {
        return agent.request('get_universe_bloodlines', undefined);
    };
}
exports.makeBloodlines = makeBloodlines;
//# sourceMappingURL=bloodlines.js.map