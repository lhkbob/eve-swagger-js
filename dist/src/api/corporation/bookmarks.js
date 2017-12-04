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
const r = require("../../internal/resource-api");
/**
 * An api adapter that provides functions for accessing an authenticated
 * corporation's bookmarks via the
 * [bookmark](https://esi.tech.ccp.is/latest/#/Bookmarks) ESI end points.
 */
class Bookmarks {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @esi_route get_corporations_corporation_id_bookmarks
     *
     * @return All bookmark details for the corporation
     */
    details() {
        if (this.details_ === undefined) {
            this.details_ = r.impl.makePageBasedStreamer(page => this.getDetailsPage(page)
                .then(result => ({ result, maxPages: undefined })));
        }
        return this.details_();
    }
    /**
     * @esi_route get_corporations_corporation_id_bookmarks_folders
     *
     * @returns An iterator over the folders for bookmark management
     */
    folders() {
        if (this.folders_ === undefined) {
            this.folders_ = r.impl.makePageBasedStreamer(page => this.getFoldersPage(page)
                .then(result => ({ result, maxPages: undefined })), 1000);
        }
        return this.folders_();
    }
    getDetailsPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let corpID;
            if (typeof this.agent.id === 'number') {
                corpID = this.agent.id;
            }
            else {
                corpID = yield this.agent.id();
            }
            return this.agent.agent.request('get_corporations_corporation_id_bookmarks', {
                path: { corporation_id: corpID }, query: { page: page }
            }, this.agent.ssoToken);
        });
    }
    getFoldersPage(page) {
        return __awaiter(this, void 0, void 0, function* () {
            let corpID;
            if (typeof this.agent.id === 'number') {
                corpID = this.agent.id;
            }
            else {
                corpID = yield this.agent.id();
            }
            return this.agent.agent.request('get_corporations_corporation_id_bookmarks_folders', {
                path: { corporation_id: corpID }, query: { page: page }
            }, this.agent.ssoToken);
        });
    }
}
exports.Bookmarks = Bookmarks;
//# sourceMappingURL=bookmarks.js.map