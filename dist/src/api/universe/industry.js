"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Industry} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Industry API instance
 */
function makeIndustry(agent) {
    return new IndustryImpl(agent);
}
exports.makeIndustry = makeIndustry;
class IndustryImpl {
    constructor(agent) {
        this.agent = agent;
    }
    facilities() {
        return this.agent.request('get_industry_facilities', undefined);
    }
    systemCosts() {
        return this.agent.request('get_industry_systems', undefined);
    }
}
//# sourceMappingURL=industry.js.map