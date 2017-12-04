"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Search} instance that makes request with `agent`,
 * searches within the given category and uses the character-search end point
 * attached to the `character`. It requires an access `token` associated with
 * the character.
 *
 * @param agent The agent to execute HTTP requests with
 * @param category The search category results are limited to
 * @returns A Search instance that can be used to run character search queries
 */
function makeCharacterSearch(agent, category) {
    return function (text, strict = false) {
        return getCharacterSearch(agent, category, text, strict);
    };
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
    return function (text, strict = false) {
        return agent.request('get_search', {
            query: { 'categories': [category], 'search': text, 'strict': strict }
        })
            .then(result => {
            return (result[category]);
        });
    };
}
exports.makeDefaultSearch = makeDefaultSearch;
function getCharacterSearch(agent, category, query, strict) {
    return __awaiter(this, void 0, void 0, function* () {
        let character;
        if (typeof agent.id === 'number') {
            character = agent.id;
        }
        else {
            character = yield agent.id();
        }
        return agent.agent.request('get_characters_character_id_search', {
            path: { 'character_id': character },
            query: { 'categories': [category], 'search': query, 'strict': strict }
        }, agent.ssoToken)
            .then(result => {
            return (result[category]);
        });
    });
}
//# sourceMappingURL=search.js.map