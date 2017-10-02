"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_loader_1 = require("../internal/page-loader");
const killmail_1 = require("./killmail");
/**
 * Create a new {@link Wars} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Wars API instance
 */
function makeWars(agent) {
    const killmailApi = killmail_1.makeKillmail(agent);
    let functor = function (id) {
        if (id !== undefined) {
            return new WarImpl(agent, id, killmailApi);
        }
        else {
            return functor.recent();
        }
    };
    functor.recent = function (maxId) {
        return agent.request('get_wars', { query: { max_war_id: maxId } });
    };
    return functor;
}
exports.makeWars = makeWars;
class WarImpl {
    constructor(agent, id_, killmailAPI) {
        this.agent = agent;
        this.id_ = id_;
        this.killmailAPI = killmailAPI;
        this.allKills = page_loader_1.makePageBasedLoader(page => this.kills(page), 2000);
        this.allMails = page_loader_1.makePageBasedLoader(page => this.killmails(page), 2000);
    }
    info() {
        return this.agent.request('get_wars_war_id', { path: { war_id: this.id_ } });
    }
    kills(page) {
        if (page === undefined) {
            return this.allKills.getAll();
        }
        else {
            return this.killmails(page)
                .then(kms => Promise.all(kms.map(km => this.killmailAPI(km.killmail_id, km.killmail_hash))));
        }
    }
    killmails(page) {
        if (page === undefined) {
            return this.allMails.getAll();
        }
        else {
            return this.agent.request('get_wars_war_id_killmails', { path: { war_id: this.id_ }, query: { page: page } });
        }
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=wars.js.map