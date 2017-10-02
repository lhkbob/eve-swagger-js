"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const names_1 = require("../internal/names");
const search_1 = require("../internal/search");
/**
 * Create a new {@link Corporations} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Corporations API instance
 */
function makeCorporations(agent) {
    let functor = function (id) {
        return new CorporationImpl(agent, id);
    };
    functor.search = search_1.makeDefaultSearch(agent, "corporation" /* CORPORATION */);
    functor.npc = function () {
        return agent.request('get_corporations_npccorps', undefined);
    };
    functor.names = function (ids) {
        if (ids.length > 100) {
            return names_1.getNames(agent, "corporation" /* CORPORATION */, ids);
        }
        else {
            // Use corporation/names end point and map manually
            return agent.request('get_corporations_names', { query: { 'corporation_ids': ids } })
                .then(result => {
                let map = new Map();
                for (let name of result) {
                    map.set(name.corporation_id, name.corporation_name);
                }
                return map;
            });
        }
    };
    return functor;
}
exports.makeCorporations = makeCorporations;
/**
 * Create a new {@link Corporation} instance that uses the given `agent` to make
 * its HTTP requests to the ESI interface for the corporation `id`.
 *
 * @param agent The agent making requests
 * @param id The corporation id
 * @returns  A Corporation API instance, when the whole Corporations API is
 *    not needed
 */
function makeCorporation(agent, id) {
    return new CorporationImpl(agent, id);
}
exports.makeCorporation = makeCorporation;
class CorporationImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_corporations_corporation_id', { path: { 'corporation_id': this.id_ } });
    }
    history() {
        return this.agent.request('get_corporations_corporation_id_alliancehistory', { path: { 'corporation_id': this.id_ } });
    }
    icon() {
        return this.agent.request('get_corporations_corporation_id_icons', { path: { 'corporation_id': this.id_ } });
    }
    loyaltyOffers() {
        return this.agent.request('get_loyalty_stores_corporation_id_offers', { path: { 'corporation_id': this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=corporations.js.map