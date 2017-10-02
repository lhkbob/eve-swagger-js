"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Stargates} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Stargates API instance
 */
function makeStargates(agent) {
    return function (id) {
        return new StargateImpl(agent, id);
    };
}
exports.makeStargates = makeStargates;
class StargateImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_stargates_stargate_id', { path: { stargate_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=stargates.js.map