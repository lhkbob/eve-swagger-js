"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Bookmarks} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Bookmarks API instance
 */
function makeBookmarks(char) {
    let bookmarks = function () {
        return char.agent.request('get_characters_character_id_bookmarks', { path: { character_id: char.id } }, char.ssoToken);
    };
    bookmarks.folders = function () {
        return char.agent.request('get_characters_character_id_bookmarks_folders', { path: { character_id: char.id } }, char.ssoToken);
    };
    return bookmarks;
}
exports.makeBookmarks = makeBookmarks;
//# sourceMappingURL=bookmarks.js.map