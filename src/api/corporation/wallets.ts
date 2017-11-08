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
export class WalletDivision extends r.impl.SimpleResource implements r.Async<WalletDivisionAPI> {
  private journal_?: r.impl.ResourceStreamer<esi.WalletJournal>;
  private transactions_?: r.impl.ResourceStreamer<esi.corporation.WalletTransaction>;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>, id: number) {
    super(id);
  }

  /**
   * @esi_route ~get_corporations_corporation_id_divisions
   *
   * @returns The name of the division
   */
  names() {
    return getDivisions(this.agent)
    .then(divs => r.impl.filterArray(divs.wallet || [], this.id_,
        e => e.division || 0).name || '');
  }

  /**
   * @esi_route ~get_corporations_corporation_id_wallets
   *
   * @returns The balance of the division
   */
  balance() {
    return getWallets(this.agent)
    .then(divs => r.impl.filterArray(divs, this.id_, e => e.division).balance);
  }

  /**
   * @esi_route get_corporations_corporation_id_wallets_division_journal
   *
   * @returns The journal entries for the wallet division
   */
  journal(): AsyncIterableIterator<esi.WalletJournal> {
    if (this.journal_ === undefined) {
      this.journal_ = r.impl.makeMaxIDStreamer(
          fromID => this.getJournal(fromID), e => e.ref_id, 2500);
    }
    return this.journal_();
  }

  /**
   * @esi_route get_corporations_corporation_id_wallets_division_transaction
   *
   * @returns The transactions for the wallet division
   */
  transactions(): AsyncIterableIterator<esi.corporation.WalletTransaction> {
    if (this.transactions_ === undefined) {
      this.transactions_ = r.impl.makeMaxIDStreamer(
          fromID => this.getTransaction(fromID), e => e.transaction_id, 2500);
    }
    return this.transactions_();
  }

  private async getJournal(fromID?: number) {
    let corpID: number;
    if (typeof this.agent.id === 'number') {
      corpID = this.agent.id;
    } else {
      corpID = await this.agent.id();
    }

    return this.agent.agent.request(
        'get_corporations_corporation_id_wallets_division_journal', {
          path: { corporation_id: corpID, division: this.id_ },
          query: { from_id: fromID }
        }, this.agent.ssoToken);
  }

  private async getTransaction(fromID?: number) {
    let corpID: number;
    if (typeof this.agent.id === 'number') {
      corpID = this.agent.id;
    } else {
      corpID = await this.agent.id();
    }

    return this.agent.agent.request(
        'get_corporations_corporation_id_wallets_division_transactions', {
          path: { corporation_id: corpID, division: this.id_ },
          query: { from_id: fromID }
        }, this.agent.ssoToken);
  }
}

/**
 * An api adapter for accessing various details of multiple wallet division ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedWalletDivisions extends r.impl.SimpleMappedResource implements r.Mapped<WalletDivisionAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @esi_route ~get_corporations_corporation_id_divisions
   *
   * @returns The names of the division mapped by their id
   */
  names() {
    return this.arrayIDs().then(ids => getDivisions(this.agent)
    .then(divs => r.impl.filterArrayToMap(divs.wallet || [], ids,
        e => e.division || 0)).then(map => {
      let remap = new Map();
      for (let id of ids) {
        remap.set(id, map.get(id)!.name || '');
      }
      return remap;
    }));
  }

  /**
   * @esi_route ~get_corporations_corporation_id_wallets
   *
   * @returns The balances mapped by division id
   */
  balance() {
    return this.arrayIDs().then(ids => getWallets(this.agent)
    .then(divs => r.impl.filterArrayToMap(divs, ids, e => e.division))
    .then(map => {
      let remap = new Map();
      for (let id of ids) {
        remap.set(id, map.get(id)!.balance);
      }
      return remap;
    }));
  }
}

/**
 * An api adapter for accessing various details about every wallet division
 * associated with the corporation.
 */
export class IteratedWalletDivisions extends r.impl.SimpleIteratedResource<esi.corporation.DivisionName> implements r.Iterated <WalletDivisionAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
    super(r.impl.makeArrayStreamer(
        () => getDivisions(agent).then(divs => divs.wallet || [])),
        e => e.division || 0);
  }

  /**
   * @esi_route get_corporations_corporation_id_divisions
   *
   * @returns The names of all wallet divisions of the corporation
   */
  async * names() {
    for await (let [id, name] of this.getPaginatedResource()) {
      // Restructure the actual name object to be a tuple
      yield <[number, string]> [id, name.name || ''];
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_wallets
   *
   * @returns The balances in all of the wallet divisions of the corporation
   */
  async * balance() {
    let wallet = await getWallets(this.agent);
    for (let div of wallet) {
      yield <[number, number]> [div.division, div.balance];
    }
  }
}

/**
 * An interface for getting APIs for a specific wallet division, a
 * known set of wallet division ids, or every wallet division for a corporation.
 */
export class Wallets {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {

  }

  /**
   * @esi_route get_corporations_corporation_id_wallet
   *
   * @returns The sum of all wallet divisions' ballances
   */
  netBalance(): Promise<number> {
    return getWallets(this.agent).then(wallet => {
      let sum = 0;
      for (let d of wallet) {
        sum += d.balance;
      }
      return sum;
    });
  }

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

  divisions(ids?: number | number[] | Set<number>) {
    if (ids === undefined) {
      // All types since no id
      return new IteratedWalletDivisions(this.agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new WalletDivision(this.agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedWalletDivisions(this.agent, ids);
    }
  }
}

async function getDivisions(agent: SSOAgent<number | r.impl.IDProvider>) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporations_corporation_id_divisions',
      { path: { corporation_id: corpID } }, agent.ssoToken);
}

async function getWallets(agent: SSOAgent<number | r.impl.IDProvider>) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporations_corporation_id_wallets',
      { path: { corporation_id: corpID } }, agent.ssoToken);
}
