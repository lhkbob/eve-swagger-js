"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const alliances_1 = require("./alliances");
const authenticated_alliance_1 = require("./authenticated-alliance");
/**
 * Create a new alliances API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Alliances
 */
function makeAlliances(agent) {
    // First create a search function for alliances using the agent
    const allianceSearch = search_1.makeDefaultSearch(agent, "alliance" /* ALLIANCE */);
    return function (ids, strictOrToken = false) {
        if (ids === undefined) {
            // No argument
            return new alliances_1.IteratedAlliances(agent);
        }
        else if (typeof ids === 'number') {
            // Single id variant but check for SSO token to possibly authenticate
            if (typeof strictOrToken === 'string') {
                return new authenticated_alliance_1.AuthenticatedAlliance(agent, strictOrToken, ids);
            }
            else {
                return new alliances_1.Alliance(agent, ids);
            }
        }
        else if (typeof ids === 'string') {
            // Search variant that uses the IDSetProvider variant
            return new alliances_1.MappedAlliances(agent, () => allianceSearch(ids, strictOrToken));
        }
        else {
            // Either a set or an array
            return new alliances_1.MappedAlliances(agent, ids);
        }
    };
}
exports.makeAlliances = makeAlliances;
//# sourceMappingURL=index.js.map