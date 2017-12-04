import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * character's contract or multiple contracts. This interface will not be used
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
    items: Responses['get_characters_character_id_contracts_contract_id_items'];
    bids: Responses['get_characters_character_id_contracts_contract_id_bids'];
}
/**
 * An api adapter for accessing various details of a single in-game contract,
 * specified by a provided id when the api is instantiated.
 */
export declare class Contract extends r.impl.SimpleResource implements r.Async<ContractAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, id: number);
    /**
     * @esi_route ~get_characters_character_id_contracts
     *
     * @returns Information about the contract
     */
    details(): Promise<esi.contract.Contract>;
    /**
     * @returns The bidding information on the contract
     */
    bids(): Promise<esi.contract.Bid[]>;
    /**
     * @returns The items within the contract
     */
    items(): Promise<esi.contract.Item[]>;
}
/**
 * An api adapter for accessing various details of multiple contract ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedContracts extends r.impl.SimpleMappedResource implements r.Mapped<ContractAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_characters_character_id_contracts
     *
     * @returns Contract details mapped by contract id
     */
    details(): Promise<Map<number, esi.contract.Contract>>;
    /**
     * @returns The bids for each contract, mapped by contract id
     */
    bids(): Promise<Map<number, esi.contract.Bid[]>>;
    /**
     * @returns The items within the contracts, mapped by contract id
     */
    items(): Promise<Map<number, esi.contract.Item[]>>;
}
/**
 * An api adapter for accessing various details about every contract associated
 * with the character.
 */
export declare class IteratedContracts extends r.impl.SimpleIteratedResource<esi.contract.Contract> implements r.Iterated<ContractAPI> {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * @esi_route get_characters_character_id_contracts
     *
     * @returns Iterator over details of all the character's contracts
     */
    details(): AsyncIterableIterator<[number, esi.contract.Contract]>;
    /**
     * @returns Bids on each contract for the character
     */
    bids(): AsyncIterableIterator<[number, esi.contract.Bid[]]>;
    /**
     * @returns Item content of all contracts for the character
     */
    items(): AsyncIterableIterator<[number, esi.contract.Item[]]>;
}
/**
 * A functional interface for getting APIs for a specific contract, a
 * known set of contract ids, or every contract for a character.
 */
export interface Contracts {
    /**
     * Create a new contract api targeting every single contract of the
     * character
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
 * character id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * character.
 *
 * @param agent The agent making actual requests
 * @returns A Contracts instance
 */
export declare function makeContracts(agent: SSOAgent<number>): Contracts;
