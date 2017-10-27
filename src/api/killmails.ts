import { ESIAgent } from '../internal/esi-agent';
import { esi, Responses } from '../esi';
import * as r from '../internal/resource-api';

/**
 * The API specification for all variants that access information about a
 * killmail or multiple killmails. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all killmails.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple alliances are being accessed at once.
 *
 * This is an API adapter over the end points handling killmail details via
 * functions in the [killmails](https://esi.tech.ccp.is/latest/#/Killmails) ESI
 * endpoints.
 */
export interface KillmailAPI {
  details: Responses['get_killmails_killmail_id_killmail_hash'];
  links: esi.killmail.KillmailLink;
}

/**
 * An api adapter for accessing various details of a single killmail, specified
 * by a provided id and hash when the api is instantiated.
 */
export class Killmail extends r.impl.SimpleResource implements r.Async<KillmailAPI> {
  constructor(private agent: ESIAgent, id: number, private hash: string) {
    super(id);
  }

  /**
   * @returns Details about this killmail
   */
  details() {
    return getDetails(this.agent, this.id_, this.hash);
  }

  /**
   * @returns The ID and hash link for this killmail
   */
  links() {
    return Promise.resolve({ killmail_id: this.id_, killmail_hash: this.hash });
  }
}

/**
 * An api adapter for accessing various details of multiple killmails, specified
 * by a provided an mapping of ids and hashes.
 */
export class MappedKillmails extends r.impl.SimpleMappedResource implements r.Mapped<KillmailAPI> {
  constructor(private agent: ESIAgent, private idHashes: Map<number, string>) {
    super(Array.from(idHashes.keys()));
  }

  /**
   * @returns Details about all of the specified killmails
   */
  details() {
    let all = [];
    for (let pair of this.idHashes.entries()) {
      all.push(getDetails(this.agent, pair[0], pair[1]));
    }

    return Promise.all(all)
    .then(kills => {
      let map = new Map();
      for (let mail of kills) {
        map.set(mail.killmail_id, mail);
      }
      return map;
    });
  }

  /**
   * @returns ID and hash links for all specified killmails
   */
  links() {
    let map = new Map();
    for (let pair of this.idHashes) {
      map.set(pair[0], { killmail_id: pair[0], killmail_hash: pair[1] });
    }
    return Promise.resolve(map);
  }
}

/**
 * An api adapter for accessing various details about every killmail restricted
 * to some dynamic scope. This scope currently is either a character's,
 * corporation's or war's killmails from losses and final blows.
 *
 * The KillmailAPIFactory does not provide a way to create these instances
 * because it is instead the responsibility of each scope to provide an
 * AllKillmails instance accessing the appropriate mails.
 */
export class AllKillmails extends r.impl.SimpleIteratedResource<esi.killmail.KillmailLink> implements r.Iterated<KillmailAPI> {
  constructor(private agent: ESIAgent,
      links: r.impl.ResourceStreamer<esi.killmail.KillmailLink>) {
    super(links, link => link.killmail_id);
  }

  /**
   * @returns An asynchronous iterator over all killmails in the scope of this
   *    particular API instance
   */
  async * details() {
    // Must stream over the links themselves and not just the ids since
    // the hash is required to get the details
    for await (let link of this.streamer()) {
      yield getDetails(this.agent, link.killmail_id, link.killmail_hash)
      .then(mail => <[number, esi.killmail.Killmail]> [link.killmail_id, mail]);
    }
  }

  /**
   * @returns An asynchronous iterator over all killmail links in the scope of
   *    this particular API instance
   */
  links() {
    return this.getPaginatedResource();
  }
}

/**
 * A functional interface for getting APIs for a specific killmail or set of
 * killmails. Note that access to an AllKillmails instance for a character,
 * corporation, or war is provided within those modules.
 */
export interface KillmailAPIFactory {
  /**
   * Create a new killmail api targeting the particular mail by its `id` and
   * authorizing `hash`.
   *
   * @param id The killmail id
   * @param hash The killmail hash
   * @returns An Killmail API wrapper for the given id
   */
  (id: number, hash: string): Killmail;

  /**
   * Create a new mapped killmail api targeting the set of killmail ids and
   * corresponding hashes. The mails can be specified by an array where the
   * elements are either the ESI defined type {@link KillmailLink} or a tuple of
   * numeric id and string hash. In this case the array is converted to a map to
   * remove duplicates
   *
   * The ids and hashes can also be specified directly as a map from killmail id
   * to killmail hash.
   *
   * @param idHashes The set of ids and corresponding hashes
   * @returns A MappedKillmails API wrapper for the ids
   */
  (idHashes: [number, string][] | esi.killmail.KillmailLink[] | Map<number, string>): MappedKillmails;

  // NOTE: don't expose a way to create AllKillmails since that gets
  // handled by the specific resource stream providers
}

/**
 * Create a new killmail API factory that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new KillmailAPIFactory
 */
export function makeKillmailFactory(agent: ESIAgent): KillmailAPIFactory {
  return <KillmailAPIFactory> function (ids: number | [number, string][] | esi.killmail.KillmailLink[] | Map<number, string>,
      hash?: string) {
    if (typeof ids === 'number') {
      // Single killmail variant
      return new Killmail(agent, ids, hash!);
    } else if (Array.isArray(ids)) {
      // Either a tuple or KillmailLink array so turn it into a map first
      let map = new Map();
      for (let e of ids) {
        if ((e as any).killmail_id !== undefined) {
          let link = <esi.killmail.KillmailLink> e;
          map.set(link.killmail_id, link.killmail_hash);
        } else {
          let tuple = <[number, string]> e;
          map.set(tuple[0], tuple[1]);
        }
      }

      return new MappedKillmails(agent, map);
    } else {
      // A map so it can be used directly
      return new MappedKillmails(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number, hash: string) {
  return agent.request('get_killmails_killmail_id_killmail_hash',
      { path: { killmail_id: id, killmail_hash: hash } });
}
