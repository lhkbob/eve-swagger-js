"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * An api adapter that provides functions for accessing the
 * [insurance](https://esi.tech.ccp.is/latest/#/Insurance) ESI end points.
 */
class Insurance {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @return Insurance price levels
     */
    prices() {
        return this.agent.request('get_insurance_prices', undefined);
    }
}
exports.Insurance = Insurance;
//# sourceMappingURL=insurance.js.map