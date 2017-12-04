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
 * An api adapter for accessing various details of a single in-game contract,
 * specified by a provided id when the api is instantiated.
 */
class Contract extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_corporations_corporation_id_contracts
     *
     * @returns Information about the contract
     */
    details() {
        return getContracts(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.contract_id));
    }
    /**
     * @esi_route get_corporations_corporation_id_contracts_contract_id_bids
     *
     * @returns The bidding information on the contract
     */
    bids() {
        if (this.bids_ === undefined) {
            this.bids_ = r.impl.makePageBasedStreamer(page => getContractBids(this.agent, this.id_, page), 1000);
        }
        return this.bids_();
    }
    /**
     * @returns The items within the contract
     */
    items() {
        return getContractItems(this.agent, this.id_);
    }
}
exports.Contract = Contract;
/**
 * An api adapter for accessing various details of multiple contract ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedContracts extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_corporations_corporation_id_contracts
     *
     * @returns Contract details mapped by contract id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getContracts(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.contract_id)));
    }
    /**
     * @returns The items within the contracts, mapped by contract id
     */
    items() {
        return this.getResource(id => getContractItems(this.agent, id));
    }
}
exports.MappedContracts = MappedContracts;
/**
 * An api adapter for accessing various details about every contract associated
 * with the corporation.
 */
class IteratedContracts extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getContracts(agent)), e => e.contract_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_corporations_corporation_id_contracts
     *
     * @returns Iterator over details of all the corporation's contracts
     */
    details() {
        return this.getPaginatedResource();
    }
    /**
     * @returns Item content of all contracts for the corporation
     */
    items() {
        return this.getResource(id => getContractItems(this.agent, id));
    }
}
exports.IteratedContracts = IteratedContracts;
/**
 * Create a new Contracts instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Contracts instance
 */
function makeContracts(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All types since no id
            return new IteratedContracts(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Contract(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedContracts(agent, ids);
        }
    };
}
exports.makeContracts = makeContracts;
function getContracts(agent) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_contracts', { path: { corporation_id: corpID } }, agent.ssoToken);
    });
}
function getContractItems(agent, id) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_contracts_contract_id_items', { path: { corporation_id: corpID, contract_id: id } }, agent.ssoToken);
    });
}
function getContractBids(agent, id, page) {
    return __awaiter(this, void 0, void 0, function* () {
        let corpID;
        if (typeof agent.id === 'number') {
            corpID = agent.id;
        }
        else {
            corpID = yield agent.id();
        }
        return agent.agent.request('get_corporations_corporation_id_contracts_contract_id_bids', {
            path: { corporation_id: corpID, contract_id: id }, query: { page: page }
        }, agent.ssoToken).then(result => ({ result, maxPages: undefined }));
    });
}
//# sourceMappingURL=contracts.js.map