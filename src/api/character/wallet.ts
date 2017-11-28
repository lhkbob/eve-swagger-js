import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';

/**
 * An api adapter that provides functions for accessing an authenticated
 * character's wallet via the
 * [wallet](https://esi.tech.ccp.is/latest/#/Wallets) ESI end points.
 */
export class Wallet {
  private journal_?: r.impl.ResourceStreamer<esi.WalletJournal>;
  private transactions_?: r.impl.ResourceStreamer<esi.character.WalletTransaction>;

  constructor(private agent: SSOAgent<number>) {
  }

  /**
   * @esi_route get_characters_character_id_wallet
   *
   * @returns The character's wallet balance
   */
  balance(): Promise<number> {
    return this.agent.agent.request('get_characters_character_id_wallet',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @esi_route get_characters_character_id_wallet_journal
   *
   * @returns An iterator over the character's wallet journal entries
   */
  journal(): AsyncIterableIterator<esi.WalletJournal> {
    if (this.journal_ === undefined) {
      this.journal_ = r.impl.makeMaxIDStreamer(
          fromID => this.getJournal(fromID), e => e.ref_id, 2500);
    }
    return this.journal_();
  }

  /**
   * @esi_route get_characters_character_id_wallet_transactions
   *
   * @returns An iterator over the character's transactions
   */
  transactions(): AsyncIterableIterator<esi.character.WalletTransaction> {
    if (this.transactions_ === undefined) {
      this.transactions_ = r.impl.makeMaxIDStreamer(
          fromID => this.getTransaction(fromID), e => e.transaction_id, 2500);
    }
    return this.transactions_();
  }

  private getJournal(fromID?: number) {
    return this.agent.agent.request(
        'get_characters_character_id_wallet_journal', {
          path: { character_id: this.agent.id, }, query: { from_id: fromID }
        }, this.agent.ssoToken);
  }

  private getTransaction(fromID?: number) {
    return this.agent.agent.request(
        'get_characters_character_id_wallet_transactions', {
          path: { character_id: this.agent.id }, query: { from_id: fromID }
        }, this.agent.ssoToken);
  }
}