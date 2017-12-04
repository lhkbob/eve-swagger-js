import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * corporation's wallet division or multiple wallet divisions. This interface
 * will not be used directly, but will be filtered through some mapper, such as
 * {@link Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification for
 * all variants: single, multiple, and all wallet divisions.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's wallet division, or a collection
 * related to the key's wallet division if multiple wallet divisions are being
 * accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [wallet](https://esi.tech.ccp.is/latest/#/Wallet) ESI endpoints.
 */
export interface WalletDivisionAPI {
    names: string;
    balance: number;
}
/**
 * An api adapter for accessing various details of a single corporation wallet
 * division, specified by a provided id when the api is instantiated.
 */
export declare class WalletDivision extends r.impl.SimpleResource implements r.Async<WalletDivisionAPI> {
    private agent;
    private journal_?;
    private transactions_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, id: number);
    /**
     * @esi_route ~get_corporations_corporation_id_divisions
     *
     * @returns The name of the division
     */
    names(): Promise<string>;
    /**
     * @esi_route ~get_corporations_corporation_id_wallets
     *
     * @returns The balance of the division
     */
    balance(): Promise<number>;
    /**
     * @esi_route get_corporations_corporation_id_wallets_division_journal
     *
     * @returns The journal entries for the wallet division
     */
    journal(): AsyncIterableIterator<esi.WalletJournal>;
    /**
     * @esi_route get_corporations_corporation_id_wallets_division_transaction
     *
     * @returns The transactions for the wallet division
     */
    transactions(): AsyncIterableIterator<esi.corporation.WalletTransaction>;
    private getJournal(fromID?);
    private getTransaction(fromID?);
}
/**
 * An api adapter for accessing various details of multiple wallet division ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedWalletDivisions extends r.impl.SimpleMappedResource implements r.Mapped<WalletDivisionAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_corporations_corporation_id_divisions
     *
     * @returns The names of the division mapped by their id
     */
    names(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_corporations_corporation_id_wallets
     *
     * @returns The balances mapped by division id
     */
    balance(): Promise<Map<any, any>>;
}
/**
 * An api adapter for accessing various details about every wallet division
 * associated with the corporation.
 */
export declare class IteratedWalletDivisions extends r.impl.SimpleIteratedResource<esi.corporation.DivisionName> implements r.Iterated<WalletDivisionAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @esi_route get_corporations_corporation_id_divisions
     *
     * @returns The names of all wallet divisions of the corporation
     */
    names(): AsyncIterableIterator<[number, string]>;
    /**
     * @esi_route get_corporations_corporation_id_wallets
     *
     * @returns The balances in all of the wallet divisions of the corporation
     */
    balance(): AsyncIterableIterator<[number, number]>;
}
/**
 * An interface for getting APIs for a specific wallet division, a
 * known set of wallet division ids, or every wallet division for a corporation.
 */
export declare class Wallets {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @esi_route get_corporations_corporation_id_wallet
     *
     * @returns The sum of all wallet divisions' ballances
     */
    netBalance(): Promise<number>;
    /**
     * Create a new wallet division api targeting every single wallet division of
     * the corporation
     *
     * @returns An IteratedWalletDivisions API wrapper
     */
    divisions(): IteratedWalletDivisions;
    /**
     * Create a new wallet division api targeting the particular wallet division
     * by `id`.
     *
     * @param id The wallet division id
     * @returns An WalletDivision API wrapper for the given id
     */
    divisions(id: number): WalletDivision;
    /**
     * Create a new wallet division api targeting the multiple wallet division
     * ids. If an array is provided, duplicates are removed (although the input
     * array is not modified).
     *
     * @param ids The wallet division ids
     * @returns A MappedWalletDivisions API wrapper for the given ids
     */
    divisions(ids: number[] | Set<number>): MappedWalletDivisions;
}
