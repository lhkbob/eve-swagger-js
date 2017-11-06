import { ESIAgent, SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';
import * as r from '../../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * corporation's starbases or multiple starbases. This interface will not be
 * used directly, but will be filtered through some mapper, such as {@link
    * Async} or {@link Mapped} depending on what types of ids are being
 * accessed. However, this allows for a concise and consistent specification
 * for all variants: single, multiple, and all starbases.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's starbase, or a collection related
 * to the key's starbase if multiple bases are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [corporation](https://esi.tech.ccp.is/latest/#/Corporation) ESI endpoints.
 */
export interface StarbaseAPI {
  details: Responses['get_corporations_corporation_id_starbases_starbase_id'];
  summaries: esi.corporation.structure.StarbaseSummary;
}

/**
 * An api adapter for accessing various details of a single corporation
 * starbase, specified by a provided id when the api is instantiated.
 */
export class Starbase extends r.impl.SimpleResource implements r.Async<StarbaseAPI> {
  private starbases_?: r.impl.ResourceStreamer<esi.corporation.structure.StarbaseSummary>;

  constructor(private agent: SSOAgent, id: number, private systemID?: number) {
    super(id);
  }

  /**
   * @returns The details of the specific starbase
   */
  details() {
    if (this.systemID !== undefined) {
      return getDetails(this.agent, this.id_, this.systemID);
    } else {
      // Must depend on summaries to get the system id as well
      return this.summaries()
      .then(summary => getDetails(this.agent, this.id_, summary.system_id));
    }
  }

  /**
   * @esi_route ~get_corporations_corporation_id_starbases
   *
   * @returns Summary and status of the specific starbase
   */
  summaries() {
    if (this.starbases_ === undefined) {
      this.starbases_ = getSummaries(this.agent);
    }
    return r.impl.filterIterated(this.starbases_(), this.id_,
        e => e.starbase_id);
  }
}

/**
 * An api adapter for accessing various details of multiple starbase ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedStarbases extends r.impl.SimpleMappedResource implements r.Mapped<StarbaseAPI> {
  private starbases_?: r.impl.ResourceStreamer<esi.corporation.structure.StarbaseSummary>;

  constructor(private agent: SSOAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Details of the starbases mapped by their id
   */
  details() {
    // First grab summaries and then load details
    return this.summaries().then(summaries => {
      let details = [];
      let ids: number[] = [];
      for (let s of summaries.values()) {
        ids.push(s.starbase_id);
        details.push(getDetails(this.agent, s.starbase_id, s.system_id));
      }
      return Promise.all(details).then(result => {
        let map = new Map();
        for (let i = 0; i < ids.length; i++) {
          map.set(ids[i], result[i]);
        }
        return map;
      });
    });
  }

  /**
   * @esi_route ~get_corporations_corporation_id_starbases
   *
   * @returns Summary and status information for the set of starbases, mapped
   *     by their id
   */
  summaries() {
    if (this.starbases_ === undefined) {
      this.starbases_ = getSummaries(this.agent);
    }

    return this.arrayIDs()
    .then(ids => r.impl.filterIteratedToMap(this.starbases_!(), ids,
        e => e.starbase_id));
  }
}

/**
 * An api adapter for accessing various details about every starbase of the
 * corporation.
 */
export class IteratedStarbases extends r.impl.SimpleIteratedResource<esi.corporation.structure.StarbaseSummary> implements r.Iterated<StarbaseAPI> {
  constructor(private agent: SSOAgent) {
    super(getSummaries(agent), e => e.starbase_id);
  }

  /**
   * @returns Details for all of the corporation's starbases
   */
  async * details() {
    // Iterate over the paginated resource directly since it provides the
    // mandatory system id as well
    for await (let [id, base] of this.getPaginatedResource()) {
      yield getDetails(this.agent, id, base.system_id)
      .then(details => <[number, esi.corporation.structure.Starbase]> [
        id, details
      ]);
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_starbases
   *
   * @returns Summary and state information for the corporation's starbases
   */
  summaries() {
    return this.getPaginatedResource();
  }
}

/**
 * A functional interface for getting APIs for a specific starbase, a
 * known set of starbase ids, or every starbase for a corporation.
 */
export interface Starbases {
  /**
   * Create a new starbase api targeting every single starbase of the
   * corporation.
   *
   * @returns An IteratedStarbases API wrapper
   */
  (): IteratedStarbases;

  /**
   * Create a new starbase api targeting the particular base by `id`.
   *
   * If `systemID` is provided, the details lookup can avoid a potentially
   * costly search through the paginated summaries to determine the POS's
   * system.
   *
   * @param id The starbase id
   * @param systemID Optional; the system id of the starbase
   * @returns A Starbase API wrapper for the given id
   */
  (id: number, systemID?: number): Starbase;

  /**
   * Create a new asset api targeting the multiple starbase ids. If an array is
   * provided, duplicates are removed (although the input array is not
   * modified).
   *
   * @param ids The starbase ids
   * @returns A MappedStarbases API wrapper
   */
  (ids: number[] | Set<number>): MappedStarbases;
}

/**
 * Create a new Starbases instance that uses the given `agent` to make its HTTP
 * requests to the ESI interface. The id of the `agent` refers to the
 * corporation id. The token of the `agent` must refer to a character that has
 * authorized the expected scopes and has the appropriate in-game roles for the
 * corporation.
 *
 * @param agent The agent making actual requests
 * @returns A Starbases instance
 */
export function makeStarbases(agent: SSOAgent): Starbases {
  return <Starbases> function (ids: number | number[] | Set<number> | undefined,
      systemID?: number) {
    if (ids === undefined) {
      // No ID so return an iterated variant
      return new IteratedStarbases(agent);
    } else if (typeof ids === 'number') {
      // Single variant, with optional system ID
      return new Starbase(agent, ids, systemID);
    } else {
      // Multiple ids, so return a mapped variant
      return new MappedStarbases(agent, ids);
    }
  };
}

function getSummaries(agent: SSOAgent): r.impl.ResourceStreamer<esi.corporation.structure.StarbaseSummary> {
  return r.impl.makePageBasedStreamer(page => getSummaryPage(agent, page),
      1000);
}

function getSummaryPage(agent: SSOAgent,
    page: number): Promise<{ result: esi.corporation.structure.StarbaseSummary[], maxPages?: number }> {
  return agent.agent.request('get_corporations_corporation_id_starbases',
      { path: { corporation_id: agent.id }, query: { page: page } },
      agent.ssoToken).then(result => ({ result, maxPages: undefined }));
}

function getDetails(agent: SSOAgent, id: number, systemID: number) {
  // NOTE: The swagger spec includes the page query parameter and has some
  // language talking about a list of POSes. However, the actual return type is
  // not an array so I think it's an error in the specification. Since page is
  // optional, we ignore it and don't expose it in the API.
  return agent.agent.request(
      'get_corporations_corporation_id_starbases_starbase_id', {
        path: { corporation_id: agent.id, starbase_id: id },
        query: { system_id: systemID }
      }, agent.ssoToken);
}