"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Sovereignty} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Sovereignty API instance
 */
function makeSovereignty(agent) {
    return new SovereigntyImpl(agent);
}
exports.makeSovereignty = makeSovereignty;
class SovereigntyImpl {
    constructor(agent) {
        this.agent = agent;
    }
    campaigns() {
        return this.agent.request('get_sovereignty_campaigns', undefined);
    }
    structures() {
        return this.agent.request('get_sovereignty_structures', undefined);
    }
    map() {
        return this.agent.request('get_sovereignty_map', undefined);
    }
}
//# sourceMappingURL=sovereignty.js.map