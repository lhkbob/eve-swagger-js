"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Freeports} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Freeports API instance
 */
function makeFreeports(agent) {
    return function () {
        return agent.request('get_universe_structures', undefined);
    };
}
exports.makeFreeports = makeFreeports;
//# sourceMappingURL=freeports.js.map