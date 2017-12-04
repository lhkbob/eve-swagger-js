"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const characters_1 = require("./characters");
const authenticated_character_1 = require("./authenticated-character");
/**
 * Create a new {@link Characters} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Characters API instance
 */
function makeCharacters(agent) {
    const charSearch = search_1.makeDefaultSearch(agent, "character" /* CHARACTER */);
    return function (ids, strictOrToken = false) {
        if (typeof ids === 'number') {
            // Single id variant but check for SSO token to possibly authenticate
            if (typeof strictOrToken === 'string') {
                return new authenticated_character_1.AuthenticatedCharacter({ agent, ssoToken: strictOrToken, id: ids });
            }
            else {
                return new characters_1.Character(agent, ids);
            }
        }
        else if (typeof ids === 'string') {
            // Search variant (which only permits the second argument to be a boolean)
            return new characters_1.MappedCharacters(agent, () => charSearch(ids, strictOrToken));
        }
        else {
            // ids is a set or array so just a plain mapped corp
            return new characters_1.MappedCharacters(agent, ids);
        }
    };
}
exports.makeCharacters = makeCharacters;
//# sourceMappingURL=index.js.map