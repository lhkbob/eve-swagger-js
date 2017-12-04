import { ESIAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about an
 * in-game bloodline or multiple bloodlines. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all bloodlines.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's bloodline, or a collection related
 * to the key's bloodline if multiple bloodlines are being accessed at once.
 *
 * This is an API wrapper over the end points handling types in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface BloodlineAPI {
    details: esi.universe.Bloodline;
}
/**
 * An api adapter for accessing various details of a single in-game bloodline,
 * specified by a provided id when the api is instantiated.
 */
export declare class Bloodline extends r.impl.SimpleResource implements r.Async<BloodlineAPI> {
    private agent;
    constructor(agent: ESIAgent, id: number);
    /**
     * @esi_route ~get_universe_bloodlines
     *
     * @returns Information about the bloodline
     */
    details(): Promise<esi.universe.Bloodline>;
}
/**
 * An api adapter for accessing various details of multiple bloodline ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedBloodlines extends r.impl.SimpleMappedResource implements r.Mapped<BloodlineAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_universe_bloodlines
     *
     * @returns Bloodline details mapped by bloodline id
     */
    details(): Promise<Map<number, esi.universe.Bloodline>>;
}
/**
 * An api adapter for accessing various details about every bloodline in the
 * game.
 */
export declare class IteratedBloodlines extends r.impl.SimpleIteratedResource<esi.universe.Bloodline> implements r.Iterated<BloodlineAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @esi_route get_universe_bloodlines
     *
     * @returns Iterator over details of all in-game types
     */
    details(): AsyncIterableIterator<[number, esi.universe.Bloodline]>;
}
/**
 * A functional interface for getting APIs for a specific bloodline, a
 * known set of bloodline ids, or every bloodline in the game.
 */
export interface Bloodlines {
    /**
     * Create a new bloodline api targeting every single bloodline in the game.
     *
     * @esi_route ids get_universe_types
     *
     * @returns An IteratedBloodlines API wrapper
     */
    (): IteratedBloodlines;
    /**
     * Create a new bloodline api targeting the particular bloodline by `id`.
     *
     * @param id The bloodline id
     * @returns An Bloodline API wrapper for the given id
     */
    (id: number): Bloodline;
    /**
     * Create a new bloodline api targeting the multiple bloodline ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The bloodline ids
     * @returns A MappedBloodlines API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedBloodlines;
}
/**
 * Create a new Bloodlines instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Bloodlines instance
 */
export declare function makeBloodlines(agent: ESIAgent): Bloodlines;
