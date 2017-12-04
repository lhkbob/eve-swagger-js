"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single corporation
 * observer, specified by a provided id when the api is instantiated.
 */
class MiningObserver extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_corporation_corporation_id_mining_observers_observer_id
     *
     * @returns The details about the observer
     */
    details() {
        // Just get the first page so we can filter the last updated from the first
        // entry in the page (presumably that's the most recent updated record)
        return getDetailsFromLedger(this.agent, this.id_);
    }
    /**
     * @esi_route get_corporation_corporation_id_mining_observers_observer_id
     *
     * @returns The ledger entries for the mining observer
     */
    ledger() {
        if (this.ledger_ === undefined) {
            this.ledger_ = r.impl.makePageBasedStreamer(page => getLedgerPage(this.agent, this.id_, page)
                .then(result => ({ result, maxPages: undefined })), 1000);
        }
        return this.ledger_();
    }
}
exports.MiningObserver = MiningObserver;
/**
 * An api adapter for accessing various details of multiple mining observer ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedMiningObservers extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_corporation_corporation_id_mining_observers
     * @esi_route *get_corporation_corporation_id_mining_observers_observer_id
     *
     * @returns The details about the observers mapped by id
     */
    details() {
        // Depending on the number of observers, either make multiple observer id
        // requests and reconstruct the details, or just filter the index resource
        return this.arrayIDs().then(ids => {
            if (ids.length > 10) {
                // Use paginated filter
                if (this.observers_ === undefined) {
                    this.observers_ = getObservers(this.agent);
                }
                return r.impl.filterIteratedToMap(this.observers_(), ids, e => e.observer_id);
            }
            else {
                // Make multiple ledger page requests and convert to a map
                return Promise.all(ids.map(id => getDetailsFromLedger(this.agent, id)))
                    .then(details => {
                    let map = new Map();
                    for (let d of details) {
                        map.set(d.observer_id, d);
                    }
                    return map;
                });
            }
        });
    }
}
exports.MappedMiningObservers = MappedMiningObservers;
/**
 * An api adapter for accessing various details about every mining observer
 * associated with the corporation.
 */
class IteratedMiningObservers extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(getObservers(agent), e => e.observer_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_corporation_corporation_id_mining_observers
     *
     * @returns The details about every observer in the corporation
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedMiningObservers = IteratedMiningObservers;
/**
 * An interface for getting APIs for a specific mining observer, a
 * known set of mining observer ids, or every mining observer for a corporation.
 */
class Mining {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @returns The scheduled mining extractions for the corporation
     */
    extractions() {
        return __awaiter(this, void 0, void 0, function* () {
            let corpID;
            if (typeof this.agent.id === 'number') {
                corpID = this.agent.id;
            }
            else {
                corpID = yield this.agent.id();
            }
            return this.agent.agent.request('get_corporation_corporation_id_mining_extractions', { path: { corporation_id: corpID } }, this.agent.ssoToken);
        });
    }
    observers(ids) {
        if (ids === undefined) {
            // All types since no id
            return new IteratedMiningObservers(this.agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new MiningObserver(this.agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedMiningObservers(this.agent, ids);
        }
    }
}
exports.Mining = Mining;
function getDivisions(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_divisions', { path: { corporation_id: corpID } }, agent.ssoToken);
    });
}
function getObservers(agent) {
    return r.impl.makePageBasedStreamer(page => getObserverPage(agent, page), 1000);
}
function getObserverPage(agent, page) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporation_corporation_id_mining_observers', { path: { corporation_id: corpID }, query: { page: page } }, agent.ssoToken);
    });
}
function getDetailsFromLedger(agent, id) {
    // Just get the first page so we can filter the last updated from the first
    // entry in the page (presumably that's the most recent updated record)
    return getLedgerPage(agent, id, 1).then(page => {
        // Reconstruct MiningObserver instance
        // - good grief TS compiler, infer 'structure' compatibility please...
        return {
            last_updated: page[0].last_updated,
            observer_id: id,
            observer_type: 'structure'
        };
    });
}
function getLedgerPage(agent, id, page) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporation_corporation_id_mining_observers_observer_id', {
            path: { corporation_id: corpID, observer_id: id }, query: { page: page }
        }, agent.ssoToken);
    });
}
//# sourceMappingURL=mining.js.map