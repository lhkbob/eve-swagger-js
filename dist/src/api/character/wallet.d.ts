import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's wallet via the
 * [wallet](https://esi.tech.ccp.is/latest/#/Wallets) ESI end points.
 */
export declare class Wallet {
    private agent;
    private journal_?;
    private transactions_?;
    constructor(agent: SSOAgent<number>);
    /**
     * @esi_route get_characters_character_id_wallet
     *
     * @returns The character's wallet balance
     */
    balance(): Promise<number>;
    /**
     * @esi_route get_characters_character_id_wallet_journal
     *
     * @returns An iterator over the character's wallet journal entries
     */
    journal(): AsyncIterableIterator<esi.WalletJournal>;
    /**
     * @esi_route get_characters_character_id_wallet_transactions
     *
     * @returns An iterator over the character's transactions
     */
    transactions(): AsyncIterableIterator<esi.character.WalletTransaction>;
    private getJournal(fromID?);
    private getTransaction(fromID?);
}
