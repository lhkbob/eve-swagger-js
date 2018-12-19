import { ESIAgent } from '../internal/esi-agent';
import { Responses } from '../../gen/esi';
/**
 * An api adapter over the end points handling killmail details via functions in
 * the [killmails](https://esi.evetech.net/latest/#/Killmails) ESI endpoints.
 */
export interface Killmail {
    /**
     * @esi_example esi.killmail(id, hash)
     *
     * @param id The id of the killmail
     * @param hash The hash of the killmail that provides access to it
     * @return The killmail details identified by the id
     */
    (id: number, hash: string): Promise<Responses['get_killmails_killmail_id_killmail_hash']>;
}
/**
 * Create a new {@link Killmail} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Killmail API instance
 */
export declare function makeKillmail(agent: ESIAgent): Killmail;
