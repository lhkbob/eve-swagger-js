"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Insurance} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Insurance API instance
 */
function makeInsurance(agent) {
    return new InsuranceImpl(agent);
}
exports.makeInsurance = makeInsurance;
class InsuranceImpl {
    constructor(agent) {
        this.agent = agent;
    }
    prices() {
        return this.agent.request('get_insurance_prices', undefined);
    }
}
//# sourceMappingURL=insurance.js.map