"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
const types_1 = require("./types");
/**
 * An api adapter for accessing various details of a single in-game market
 * group, specified by a provided id when the api is instantiated.
 */
class MarketGroup extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the market group
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
    /**
     * @returns A MappedTypes instance tied to the types defined in the details of
     *    this market group
     */
    get members() {
        if (this.members_ === undefined) {
            this.members_ = new types_1.MappedTypes(this.agent, () => this.details().then(result => result.types));
        }
        return this.members_;
    }
}
exports.MarketGroup = MarketGroup;
/**
 * An api adapter for accessing various details of multiple market group ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedMarketGroups extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns MarketGroup details mapped by marketGroup id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedMarketGroups = MappedMarketGroups;
/**
 * An api adapter for accessing various details about every market group in the
 * game. Even though a route exists to get all group ids at once, due to their
 * quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedMarketGroups extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_markets_groups', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game market groups
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.IteratedMarketGroups = IteratedMarketGroups;
/**
 * Create a new MarketGroups instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A MarketGroups instance
 */
function makeMarketGroups(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All MarketGroups since no id
            return new IteratedMarketGroups(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new MarketGroup(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedMarketGroups(agent, ids);
        }
    };
}
exports.makeMarketGroups = makeMarketGroups;
function getDetails(agent, id) {
    return agent.request('get_markets_groups_market_group_id', { path: { market_group_id: id } });
}
//# sourceMappingURL=market-groups.js.map