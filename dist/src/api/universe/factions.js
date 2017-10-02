"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
/**
 * Create a new {@link Factions} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Factions API instance
 */
function makeFactions(agent) {
    let functor = function () {
        return agent.request('get_universe_factions', undefined);
    };
    functor.search = search_1.makeDefaultSearch(agent, "faction" /* FACTION */);
    return functor;
}
exports.makeFactions = makeFactions;
//# sourceMappingURL=factions.js.map