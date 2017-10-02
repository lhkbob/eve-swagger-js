"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
/**
 * Create a new {@link Wormholes} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Wormholes API instance
 */
function makeWormholes(agent) {
    const search = search_1.makeDefaultSearch(agent, "wormhole" /* WORMHOLE */);
    return { search };
}
exports.makeWormholes = makeWormholes;
//# sourceMappingURL=wormholes.js.map