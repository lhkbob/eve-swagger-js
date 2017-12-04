"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's wallet via the
 * [wallet](https://esi.tech.ccp.is/latest/#/Wallets) ESI end points.
 */
class Wallet {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     * @esi_route get_characters_character_id_wallet
     *
     * @returns The character's wallet balance
     */
    balance() {
        return this.agent.agent.request('get_characters_character_id_wallet', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @esi_route get_characters_character_id_wallet_journal
     *
     * @returns An iterator over the character's wallet journal entries
     */
    journal() {
        if (this.journal_ === undefined) {
            this.journal_ = r.impl.makeMaxIDStreamer(fromID => this.getJournal(fromID), e => e.ref_id, 2500);
        }
        return this.journal_();
    }
    /**
     * @esi_route get_characters_character_id_wallet_transactions
     *
     * @returns An iterator over the character's transactions
     */
    transactions() {
        if (this.transactions_ === undefined) {
            this.transactions_ = r.impl.makeMaxIDStreamer(fromID => this.getTransaction(fromID), e => e.transaction_id, 2500);
        }
        return this.transactions_();
    }
    getJournal(fromID) {
        return this.agent.agent.request('get_characters_character_id_wallet_journal', {
            path: { character_id: this.agent.id, }, query: { from_id: fromID }
        }, this.agent.ssoToken);
    }
    getTransaction(fromID) {
        return this.agent.agent.request('get_characters_character_id_wallet_transactions', {
            path: { character_id: this.agent.id }, query: { from_id: fromID }
        }, this.agent.ssoToken);
    }
}
exports.Wallet = Wallet;
//# sourceMappingURL=wallet.js.map