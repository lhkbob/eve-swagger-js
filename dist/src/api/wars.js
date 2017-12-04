"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const killmails_1 = require("./killmails");
const r = require("../internal/resource-api");
/**
 * An api adapter for accessing various details of a single war, specified
 * by a provided id when the api is instantiated.
 */
class War extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @return The details of the specific war
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * Get all of the kills within the war as an iterated API.
     *
     * @esi_route links get_wars_war_id_killmails
     *
     * @returns An AllKillmails API instance associated with this war
     */
    get kills() {
        if (this.kills_ === undefined) {
            this.kills_ = new killmails_1.IteratedKillmails(this.agent, r.impl.makePageBasedStreamer(page => getKillmails(this.agent, this.id_, page), 2000));
        }
        return this.kills_;
    }
}
exports.War = War;
/**
 * An api adapter for accessing various details of multiple wars, specified by a
 * provided an array or set of ids.
 */
class MappedWars extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns The details for the set of wars
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedWars = MappedWars;
/**
 * An api adapter for accessing various details about every war in the game. The
 * functions are exposed as asynchronous iterators. There are potentially many
 * wars, so it is recommended to have a specific termination criteria like
 * amount received, date, or maximum id.
 */
class IteratedWars extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeMaxIDStreamer(maxID => agent.request('get_wars', { query: { max_war_id: maxID } }), id => id, 2000), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterated details of each war, ordered from highest to lowest id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.IteratedWars = IteratedWars;
/**
 * Create a new Wars API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Wars
 */
function makeWars(agent) {
    return function (ids) {
        if (ids === undefined) {
            return new IteratedWars(agent);
        }
        else if (typeof ids === 'number') {
            return new War(agent, ids);
        }
        else {
            return new MappedWars(agent, ids);
        }
    };
}
exports.makeWars = makeWars;
function getKillmails(agent, warID, page) {
    return agent.request('get_wars_war_id_killmails', { path: { war_id: warID }, query: { page: page } })
        .then(result => ({ result, maxPages: undefined }));
}
function getDetails(agent, id) {
    return agent.request('get_wars_war_id', { path: { war_id: id } });
}
//# sourceMappingURL=wars.js.map