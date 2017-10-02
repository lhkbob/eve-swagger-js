"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Search} instance that makes request with `agent`,
 * searches within the given category and uses the character-search end point
 * attached to the `character`. It requires an access `token` associated with
 * the character.
 *
 * @param agent The agent to execute HTTP requests with
 * @param category The search category results are limited to
 * @param character The character ID defining the search space
 * @param token The SSO access token for the character
 * @returns A Search instance that can be used to run character search queries
 */
function makeCharacterSearch(agent, category, character, token) {
    let search = function (text, strict = false) {
        return agent.request('get_characters_character_id_search', {
            path: { 'character_id': character },
            query: { 'categories': [category], 'search': text, 'strict': strict }
        }, token)
            .then(result => {
            return (result[category]);
        });
    };
    let searchFunc = search;
    searchFunc.strict = function (text) {
        return search(text, true);
    };
    return searchFunc;
}
exports.makeCharacterSearch = makeCharacterSearch;
/**
 * Create a new {@link Search} instance that makes request with `agent`,
 * searches within the given category and uses the default search space.
 *
 * @param agent The agent to execute HTTP requests with
 * @param category The search category results are limited to
 * @returns A Search instance that can be used to run search queries
 */
function makeDefaultSearch(agent, category) {
    let search = function (text, strict = false) {
        return agent.request('get_search', {
            query: { 'categories': [category], 'search': text, 'strict': strict }
        })
            .then(result => {
            return (result[category]);
        });
    };
    let searchFunc = search;
    searchFunc.strict = function (text) {
        return search(text, true);
    };
    return searchFunc;
}
exports.makeDefaultSearch = makeDefaultSearch;
//# sourceMappingURL=search.js.map