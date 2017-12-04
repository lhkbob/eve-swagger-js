import { Configuration } from './internal/esi-agent';
import { Responses, esi } from './esi';
import { Factions } from './api/factions';
import { Alliances } from './api/alliance';
import { Characters } from './api/character';
import { Corporations } from './api/corporation';
import { Killmails } from './api/killmails';
import { Sovereignty } from './api/sovereignty';
import { Wars } from './api/wars';
import { Schema } from './api/schema';
import { Universe } from './api/universe';
import { Fleet } from './api/fleet';
export { esi, Configuration };
export * from './error';
/**
 * ESI creates a shared, internal agent and then lazily instantiates all
 * specific modules as needed. The internal agent maintains a single cache for
 * all of the requests to the network interface.
 *
 * The ESI instance also provides a function to create new API instances
 * with an updated configuration.
 *
 * @see https://esi.tech.ccp.is/latest
 */
export declare class ESI {
    private agent;
    private alliances_?;
    private chars_?;
    private corps_?;
    private factions_?;
    private kms_?;
    private schema_?;
    private sov_?;
    private universe_?;
    private wars_?;
    constructor(config?: Partial<Configuration>);
    readonly configuration: Configuration;
    readonly alliances: Alliances;
    readonly characters: Characters;
    readonly corporations: Corporations;
    readonly wars: Wars;
    readonly factions: Factions;
    readonly schema: Schema;
    readonly universe: Universe;
    readonly sovereignty: Sovereignty;
    readonly killmails: Killmails;
    /**
     * Create a new ESI interface that uses the updated `config`. The provided
     * configuration is merged with this ESI's configuration, overriding this
     * instance's configuration with any keys specified in `config`.
     *
     * The newly created ESI instance uses its own internal agent with a separate
     * cache from this instance.
     *
     * If `config` is an empty object or not provided at all, the created ESI is a
     * new instance with the exact same configuration. Because the new instance
     * has its own cache, this can be a useful way to create multiple instances
     * that behave the same but are independent.
     *
     * @param config New configuration settings to override
     * @returns A new ESI instance
     */
    clone(config?: Partial<Configuration>): ESI;
    /**
     * Create a new Fleet API associated with the specific `fleetID`. The `token`
     * must be an SSO authentication token for a character in the fleet. Depending
     * on the character's role within the fleet, certain features may be
     * inaccessible.
     *
     * @param fleetID The ID of the fleet
     * @param token The SSO token for a character in the fleet
     * @returns A Fleet API
     */
    fleet(fleetID: number, token: string): Fleet;
    /**
     * @param text The text to search all entities and types for
     * @param strict Whether or not the search should be strict, defaults to false
     * @returns All matches and their corresponding categories
     */
    search(text: string, strict?: boolean): Promise<Responses['get_search']>;
    /**
     * If ids is longer than the reported maximum length for ESI, the array will
     * be split into smaller chunks and multiple requests will be made and then
     * concatenated back together.
     *
     * @param ids The ids to lookup
     * @returns The resolved names and detected categories
     */
    names(ids: number[]): Promise<Responses['post_universe_names']>;
    /**
     * @returns The status of the Eve servers
     */
    status(): Promise<Responses['get_status']>;
}
/**
 * The default configuration that specifies values for parameters that aren't
 * explicitly given.
 */
export declare const DEFAULT_CONFIG: Configuration;
