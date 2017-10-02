"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Moons} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Moons API instance
 */
function makeMoons(agent) {
    return function (id) {
        return new MoonImpl(agent, id);
    };
}
exports.makeMoons = makeMoons;
class MoonImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_moons_moon_id', { path: { moon_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=moons.js.map