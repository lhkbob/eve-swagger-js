"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's bookmarks via the
 * [bookmark](https://esi.tech.ccp.is/latest/#/Bookmarks) ESI end points.
 */
class Bookmarks {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @esi_route get_characters_character_id_bookmarks
     *
     * @return All bookmark details for the character
     */
    details() {
        if (this.details_ === undefined) {
            this.details_ = r.impl.makeArrayStreamer(() => this.getDetails());
        }
        return this.details_();
    }
    /**
     * @esi_route get_characters_character_id_bookmarks_folders
     *
     * @returns An iterator over the folders for bookmark management
     */
    folders() {
        if (this.folders_ === undefined) {
            this.folders_ = r.impl.makeArrayStreamer(() => this.getFolders());
        }
        return this.folders_();
    }
    getDetails() {
        return this.agent.agent.request('get_characters_character_id_bookmarks', {
            path: { character_id: this.agent.id },
        }, this.agent.ssoToken);
    }
    getFolders() {
        return this.agent.agent.request('get_characters_character_id_bookmarks_folders', {
            path: { character_id: this.agent.id },
        }, this.agent.ssoToken);
    }
}
exports.Bookmarks = Bookmarks;
//# sourceMappingURL=bookmarks.js.map