import { ESIAgent } from '../internal/esi-agent';
import { Responses, esi } from '../esi';
import { IteratedKillmails } from './killmails';

import * as r from '../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * war or multiple wars. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all wars.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple wars are being accessed at once.
 *
 * This is an API adapter that provides functions for accessing wars and their
 * kills, via functions in the [wars](https://esi.tech.ccp.is/latest/#/Wars) ESI
 * endpoints.
 */
export interface WarAPI {
  details: Responses['get_wars_war_id'];
}

/**
 * An api adapter for accessing various details of a single war, specified
 * by a provided id when the api is instantiated.
 */
export class War extends r.impl.SimpleResource implements r.Async<WarAPI> {
  private kills_?: IteratedKillmails;

  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @return The details of the specific war
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * Get all of the kills within the war as an iterated API.
   *
   * @esi_route links get_wars_war_id_killmails
   *
   * @returns An AllKillmails API instance associated with this war
   */
  get kills(): IteratedKillmails {
    if (this.kills_ === undefined) {
      this.kills_ = new IteratedKillmails(this.agent,
          r.impl.makePageBasedStreamer(
              page => getKillmails(this.agent, this.id_, page), 2000));
    }
    return this.kills_!;
  }
}

/**
 * An api adapter for accessing various details of multiple wars, specified by a
 * provided an array or set of ids.
 */
export class MappedWars extends r.impl.SimpleMappedResource implements r.Mapped<WarAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns The details for the set of wars
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every war in the game. The
 * functions are exposed as asynchronous iterators. There are potentially many
 * wars, so it is recommended to have a specific termination criteria like
 * amount received, date, or maximum id.
 */
export class IteratedWars extends r.impl.SimpleIteratedResource<number> implements r.Iterated<WarAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeMaxIDStreamer(
        maxID => agent.request('get_wars', { query: { max_war_id: maxID } }),
        id => id, 2000), id => id);
  }

  /**
   * @returns Iterated details of each war, ordered from highest to lowest id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * A functional interface for getting APIs for a specific war, a known set of
 * war ids, or every war in the game.
 */
export interface Wars {
  /**
   * Create a new war api targeting every single war in the game.
   *
   * @esi_route ids get_wars
   *
   * @returns An IteratedWars API wrapper
   */
  (): IteratedWars;

  /**
   * Create a new War end point targeting the particular war by `id`.
   *
   * @param id The war id
   * @returns A War API wrapper for the given war
   */
  (id: number): War;

  /**
   * Create a new MappedWars api targeting the multiple wars ids. If an
   * array is provided, duplicates are removed (although the input array
   * is not modified).
   *
   * @param ids The war ids
   * @returns A MappedWars API wrapper for the given ids
   */
  (ids: number[] | Set<number>): MappedWars;
}

/**
 * Create a new Wars API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Wars
 */
export function makeWars(agent: ESIAgent): Wars {
  return <Wars> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      return new IteratedWars(agent);
    } else if (typeof ids === 'number') {
      return new War(agent, ids);
    } else {
      return new MappedWars(agent, ids);
    }
  };
}

function getKillmails(agent: ESIAgent, warID: number, page: number) {
  return agent.request('get_wars_war_id_killmails',
      { path: { war_id: warID }, query: { page: page } })
  .then(result => ({ result, maxPages: undefined }));
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_wars_war_id', { path: { war_id: id } });
}