import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * corporation's contract or multiple contracts. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all contracts.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's contract, or a collection related
 * to the key's contract if multiple contracts are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [contracts](https://esi.tech.ccp.is/latest/#/Contracts) ESI endpoints.
 */
export interface ContractAPI {
  details: esi.contract.Contract;
  items: Responses['get_corporations_corporation_id_contracts_contract_id_items'];
}

/**
 * An api adapter for accessing various details of a single in-game contract,
 * specified by a provided id when the api is instantiated.
 */
export class Contract extends r.impl.SimpleResource implements r.Async<ContractAPI> {
  private bids_?: r.impl.ResourceStreamer<esi.contract.Bid>;

  constructor(private agent: SSOAgent, id: number) {
    super(id);
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
      this.bids_ = r.impl.makePageBasedStreamer(
          page => getContractBids(this.agent, this.id_, page), 1000);
    }
    return this.bids_();
  }

  /**
   * @esi_route get_corporations_corporation_id_contracts_contract_id_items
   *
   * @returns The items within the contract
   */
  items() {
    return getContractItems(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of multiple contract ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedContracts extends r.impl.SimpleMappedResource implements r.Mapped<ContractAPI> {
  constructor(private agent: SSOAgent, ids: number[] | Set<number>) {
    super(ids);
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
   * @esi_route get_corporations_corporation_id_contracts_contract_id_items
   *
   * @returns The items within the contracts, mapped by contract id
   */
  items() {
    return this.getResource(id => getContractItems(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every contract associated
 * with the corporation.
 */
export class IteratedContracts extends r.impl.SimpleIteratedResource<esi.contract.Contract> implements r.Iterated<ContractAPI> {
  constructor(private agent: SSOAgent) {
    super(r.impl.makeArrayStreamer(() => getContracts(agent)),
        e => e.contract_id);
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
   * @esi_route get_corporations_corporation_id_contracts_items
   *
   * @returns Item content of all cotnracts for the corporation
   */
  items() {
    return this.getResource(id => getContractItems(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific contract, a
 * known set of contract ids, or every contract for a corporation.
 */
export interface Contracts {
  /**
   * Create a new contract api targeting every single contract of the
   * corporation
   *
   * @returns An IteratedContracts API wrapper
   */
  (): IteratedContracts;

  /**
   * Create a new contract api targeting the particular contract by `id`.
   *
   * @param id The contract id
   * @returns An Contract API wrapper for the given id
   */
  (id: number): Contract;

  /**
   * Create a new contract api targeting the multiple contract ids. If an
   * array is provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The contract ids
   * @returns A MappedContracts API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedContracts;
}

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
export function makeContracts(agent: SSOAgent): Contracts {
  return <Contracts> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All types since no id
      return new IteratedContracts(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Contract(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedContracts(agent, ids);
    }
  };
}

function getContracts(agent: SSOAgent) {
  return agent.agent.request('get_corporations_corporation_id_contracts',
      { path: { corporation_id: agent.id } }, agent.ssoToken);
}

function getContractItems(agent: SSOAgent, id: number) {
  return agent.agent.request(
      'get_corporations_corporation_id_contracts_contract_id_items',
      { path: { corporation_id: agent.id, contract_id: id } }, agent.ssoToken);
}

function getContractBids(agent: SSOAgent, id: number, page: number) {
  return agent.agent.request(
      'get_corporations_corporation_id_contracts_contract_id_bids', {
        path: { corporation_id: agent.id, contract_id: id },
        query: { page: page }
      }, agent.ssoToken).then(result => ({ result, maxPages: undefined }));
}
