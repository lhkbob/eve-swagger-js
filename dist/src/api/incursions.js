"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Incursions} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Incursions API instance
 */
function makeIncursions(agent) {
    return function () {
        return agent.request('get_incursions', undefined);
    };
}
exports.makeIncursions = makeIncursions;
//# sourceMappingURL=incursions.js.map