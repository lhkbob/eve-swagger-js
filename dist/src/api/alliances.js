"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const names_1 = require("../internal/names");
const search_1 = require("../internal/search");
/**
 * Create a new {@link Alliances} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Alliances API instance
 */
function makeAlliances(agent) {
    let functor = function (id) {
        if (id !== undefined) {
            return new AllianceImpl(agent, id);
        }
        else {
            return agent.request('get_alliances', undefined);
        }
    };
    functor.search = search_1.makeDefaultSearch(agent, "alliance" /* ALLIANCE */);
    functor.names = function (ids) {
        if (ids === undefined) {
            return functor().then(allIds => functor.names(allIds));
        }
        else if (ids.length > 100) {
            return names_1.getNames(agent, "alliance" /* ALLIANCE */, ids);
        }
        else {
            return agent.request('get_alliances_names', { query: { 'alliance_ids': ids } })
                .then(result => {
                let map = new Map();
                for (let r of result) {
                    map.set(r.alliance_id, r.alliance_name);
                }
                return map;
            });
        }
    };
    return functor;
}
exports.makeAlliances = makeAlliances;
class AllianceImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_alliances_alliance_id', { path: { 'alliance_id': this.id_ } });
    }
    corporations() {
        return this.agent.request('get_alliances_alliance_id_corporations', { path: { 'alliance_id': this.id_ } });
    }
    icon() {
        return this.agent.request('get_alliances_alliance_id_icons', { path: { 'alliance_id': this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=alliances.js.map