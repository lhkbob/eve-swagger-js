"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
/**
 * Create a new {@link Agents} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Agents API instance
 */
function makeAgents(agent) {
    let search = search_1.makeDefaultSearch(agent, "agent" /* AGENT */);
    return { search };
}
exports.makeAgents = makeAgents;
//# sourceMappingURL=agents.js.map