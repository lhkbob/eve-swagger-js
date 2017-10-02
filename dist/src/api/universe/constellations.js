"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
/**
 * Create a new {@link Constellations} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Constellations API instance
 */
function makeConstellations(agent) {
    let functor = function (id) {
        if (id === undefined) {
            return agent.request('get_universe_constellations', undefined);
        }
        else {
            return new ConstellationImpl(agent, id);
        }
    };
    functor.search = search_1.makeDefaultSearch(agent, "constellation" /* CONSTELLATION */);
    functor.names = function (ids) {
        if (ids === undefined) {
            return functor().then(ids => {
                return functor.names(ids);
            });
        }
        else {
            return names_1.getNames(agent, "constellation" /* CONSTELLATION */, ids);
        }
    };
    return functor;
}
exports.makeConstellations = makeConstellations;
class ConstellationImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_constellations_constellation_id', { path: { constellation_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=constellations.js.map