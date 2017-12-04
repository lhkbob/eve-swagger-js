"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const corporations_1 = require("./corporations");
const search_1 = require("../../internal/search");
const authenticated_corporation_1 = require("./authenticated-corporation");
/**
 * Create a new corporations API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Corporations
 */
function makeCorporations(agent) {
    const corpSearch = search_1.makeDefaultSearch(agent, "corporation" /* CORPORATION */);
    let factory = function (ids, strictOrToken = false) {
        if (typeof ids === 'number') {
            // Single id variant but check for SSO token to possibly authenticate
            if (typeof strictOrToken === 'string') {
                return new authenticated_corporation_1.AuthenticatedCorporation(agent, strictOrToken, ids);
            }
            else {
                return new corporations_1.Corporation(agent, ids);
            }
        }
        else if (typeof ids === 'string') {
            // Search variant (which only permits the second argument to be a boolean)
            return new corporations_1.MappedCorporations(agent, () => corpSearch(ids, strictOrToken));
        }
        else {
            // ids is a set or array so just a plain mapped corp
            return new corporations_1.MappedCorporations(agent, ids);
        }
    };
    // Add npcs() function
    factory.npcs = function () {
        return new corporations_1.MappedCorporations(agent, () => agent.request('get_corporations_npccorps', undefined));
    };
    return factory;
}
exports.makeCorporations = makeCorporations;
//# sourceMappingURL=index.js.map