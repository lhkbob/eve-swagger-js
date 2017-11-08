import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';

import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * corporation's mining observer or multiple observers. This interface
 * will not be used directly, but will be filtered through some mapper, such as
 * {@link Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification for
 * all variants: single, multiple, and all mining observers.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's mining observer, or a collection
 * related to the key's mining observer if multiple mining observers are being
 * accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [industry](https://esi.tech.ccp.is/latest/#/Industry) ESI endpoints.
 */
export interface MiningObserverAPI {
  details: esi.corporation.industry.MiningObserver;
}

/**
 * An api adapter for accessing various details of a single corporation
 * observer, specified by a provided id when the api is instantiated.
 */
export class MiningObserver extends r.impl.SimpleResource implements r.Async<MiningObserverAPI> {
  private ledger_?: r.impl.ResourceStreamer<esi.corporation.industry.MiningRecord>;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>, id: number) {
    super(id);
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
  ledger(): AsyncIterableIterator<esi.corporation.industry.MiningRecord> {
    if (this.ledger_ === undefined) {
      this.ledger_ = r.impl.makePageBasedStreamer(
          page => getLedgerPage(this.agent, this.id_, page)
          .then(result => ({ result, maxPages: undefined })), 1000);
    }
    return this.ledger_();
  }
}

/**
 * An api adapter for accessing various details of multiple mining observer ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedMiningObservers extends r.impl.SimpleMappedResource implements r.Mapped<MiningObserverAPI> {
  private observers_?: r.impl.ResourceStreamer<esi.corporation.industry.MiningObserver>;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>,
      ids: number[] | Set<number>) {
    super(ids);
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
        return r.impl.filterIteratedToMap(this.observers_(), ids,
            e => e.observer_id);
      } else {
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

/**
 * An api adapter for accessing various details about every mining observer
 * associated with the corporation.
 */
export class IteratedMiningObservers extends r.impl.SimpleIteratedResource<esi.corporation.industry.MiningObserver> implements r.Iterated<MiningObserverAPI> {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
    super(getObservers(agent), e => e.observer_id);
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

/**
 * An interface for getting APIs for a specific mining observer, a
 * known set of mining observer ids, or every mining observer for a corporation.
 */
export class Mining {
  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {

  }

  /**
   * @returns The scheduled mining extractions for the corporation
   */
  async extractions(): Promise<Responses['get_corporation_corporation_id_mining_extractions']> {
    let corpID: number;
    if (typeof this.agent.id === 'number') {
      corpID = this.agent.id;
    } else {
      corpID = await this.agent.id();
    }

    return this.agent.agent.request(
        'get_corporation_corporation_id_mining_extractions',
        { path: { corporation_id: corpID } }, this.agent.ssoToken);
  }

  /**
   * Create a new mining observer api targeting every single mining observer of
   * the corporation
   *
   * @returns An IteratedMiningObservers API wrapper
   */
  observers(): IteratedMiningObservers;

  /**
   * Create a new mining observer api targeting the particular mining observer
   * by `id`.
   *
   * @param id The mining observer id
   * @returns An MiningObserver API wrapper for the given id
   */
  observers(id: number): MiningObserver;

  /**
   * Create a new mining observer api targeting the multiple mining observer
   * ids. If an array is provided, duplicates are removed (although the input
   * array is not modified).
   *
   * @param ids The mining observer ids
   * @returns A MappedMiningObservers API wrapper for the given ids
   */
  observers(ids: number[] | Set<number>): MappedMiningObservers;

  observers(ids?: number | number[] | Set<number>) {
    if (ids === undefined) {
      // All types since no id
      return new IteratedMiningObservers(this.agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new MiningObserver(this.agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedMiningObservers(this.agent, ids);
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

function getObservers(agent: SSOAgent<number | r.impl.IDProvider>) {
  return r.impl.makePageBasedStreamer(page => getObserverPage(agent, page),
      1000);
}

async function getObserverPage(agent: SSOAgent<number | r.impl.IDProvider>,
    page: number) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request('get_corporation_corporation_id_mining_observers',
      { path: { corporation_id: corpID }, query: { page: page } },
      agent.ssoToken);
}

function getDetailsFromLedger(agent: SSOAgent<number | r.impl.IDProvider>,
    id: number) {
  // Just get the first page so we can filter the last updated from the first
  // entry in the page (presumably that's the most recent updated record)
  return getLedgerPage(agent, id, 1).then(page => {
    // Reconstruct MiningObserver instance
    // - good grief TS compiler, infer 'structure' compatibility please...
    return {
      last_updated: page[0].last_updated,
      observer_id: id,
      observer_type: <'structure'> 'structure'
    };
  });
}

async function getLedgerPage(agent: SSOAgent<number | r.impl.IDProvider>,
    id: number, page: number) {
  let corpID: number;
  if (typeof agent.id === 'number') {
    corpID = agent.id;
  } else {
    corpID = await agent.id();
  }

  return agent.agent.request(
      'get_corporation_corporation_id_mining_observers_observer_id', {
        path: { corporation_id: corpID, observer_id: id }, query: { page: page }
      }, agent.ssoToken);
}
