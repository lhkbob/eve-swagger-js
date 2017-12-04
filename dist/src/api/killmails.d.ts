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
export declare class Killmail extends r.impl.SimpleResource implements r.Async<KillmailAPI> {
    private agent;
    private hash;
    constructor(agent: ESIAgent, id: number, hash: string);
    /**
     * @returns Details about this killmail
     */
    details(): Promise<esi.killmail.Killmail>;
    /**
     * @returns The ID and hash link for this killmail
     */
    links(): Promise<{
        killmail_id: number;
        killmail_hash: string;
    }>;
}
/**
 * An api adapter for accessing various details of multiple killmails, specified
 * by a provided an mapping of ids and hashes.
 */
export declare class MappedKillmails extends r.impl.SimpleMappedResource implements r.Mapped<KillmailAPI> {
    private agent;
    private idHashes;
    constructor(agent: ESIAgent, idHashes: Map<number, string>);
    /**
     * @returns Details about all of the specified killmails
     */
    details(): Promise<Map<any, any>>;
    /**
     * @returns ID and hash links for all specified killmails
     */
    links(): Promise<Map<any, any>>;
}
/**
 * An api adapter for accessing various details about every killmail restricted
 * to some dynamic scope. This scope currently is either a character's,
 * corporation's or war's killmails from losses and final blows.
 *
 * The Killmails does not provide a way to create these instances
 * because it is instead the responsibility of each scope to provide an
 * IteratedKillmails instance accessing the appropriate mails.
 */
export declare class IteratedKillmails extends r.impl.SimpleIteratedResource<esi.killmail.KillmailLink> implements r.Iterated<KillmailAPI> {
    private agent;
    constructor(agent: ESIAgent, links: r.impl.ResourceStreamer<esi.killmail.KillmailLink>);
    /**
     * @returns An asynchronous iterator over all killmails in the scope of this
     *    particular API instance
     */
    details(): AsyncIterableIterator<[number, esi.killmail.Killmail]>;
    /**
     * @returns An asynchronous iterator over all killmail links in the scope of
     *    this particular API instance
     */
    links(): AsyncIterableIterator<[number, esi.killmail.KillmailLink]>;
}
/**
 * A functional interface for getting APIs for a specific killmail or set of
 * killmails. Note that access to an IteratedKillmails instance for a character,
 * corporation, or war is provided within those modules.
 */
export interface Killmails {
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
}
/**
 * Create a new Killmails API that uses the given `agent` to make its
 * HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A new Killmails
 */
export declare function makeKillmails(agent: ESIAgent): Killmails;
