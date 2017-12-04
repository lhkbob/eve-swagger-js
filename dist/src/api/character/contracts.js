"use strict";
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
     * @esi_route ~get_characters_character_id_contracts
     *
     * @returns Information about the contract
     */
    details() {
        return getContracts(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.contract_id));
    }
    /**
     * @returns The bidding information on the contract
     */
    bids() {
        return getContractBids(this.agent, this.id_);
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
     * @esi_route ~get_characters_character_id_contracts
     *
     * @returns Contract details mapped by contract id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getContracts(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.contract_id)));
    }
    /**
     * @returns The bids for each contract, mapped by contract id
     */
    bids() {
        return this.getResource(id => getContractBids(this.agent, id));
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
 * with the character.
 */
class IteratedContracts extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getContracts(agent)), e => e.contract_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_characters_character_id_contracts
     *
     * @returns Iterator over details of all the character's contracts
     */
    details() {
        return this.getPaginatedResource();
    }
    /**
     * @returns Bids on each contract for the character
     */
    bids() {
        return this.getResource(id => getContractBids(this.agent, id));
    }
    /**
     * @returns Item content of all contracts for the character
     */
    items() {
        return this.getResource(id => getContractItems(this.agent, id));
    }
}
exports.IteratedContracts = IteratedContracts;
/**
 * Create a new Contracts instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * character id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * character.
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
    return agent.agent.request('get_characters_character_id_contracts', { path: { character_id: agent.id } }, agent.ssoToken);
}
function getContractItems(agent, id) {
    return agent.agent.request('get_characters_character_id_contracts_contract_id_items', { path: { character_id: agent.id, contract_id: id } }, agent.ssoToken);
}
function getContractBids(agent, id) {
    return agent.agent.request('get_characters_character_id_contracts_contract_id_bids', {
        path: { character_id: agent.id, contract_id: id }
    }, agent.ssoToken);
}
//# sourceMappingURL=contracts.js.map