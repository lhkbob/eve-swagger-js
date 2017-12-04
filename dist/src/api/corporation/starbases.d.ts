import { SSOAgent } from '../../internal/esi-agent';
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
export declare class Starbase extends r.impl.SimpleResource implements r.Async<StarbaseAPI> {
    private agent;
    private systemID;
    private starbases_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, id: number, systemID?: number | undefined);
    /**
     * @returns The details of the specific starbase
     */
    details(): Promise<esi.corporation.structure.Starbase>;
    /**
     * @esi_route ~get_corporations_corporation_id_starbases
     *
     * @returns Summary and status of the specific starbase
     */
    summaries(): Promise<esi.corporation.structure.StarbaseSummary>;
}
/**
 * An api adapter for accessing various details of multiple starbase ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedStarbases extends r.impl.SimpleMappedResource implements r.Mapped<StarbaseAPI> {
    private agent;
    private starbases_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number>);
    /**
     * @returns Details of the starbases mapped by their id
     */
    details(): Promise<Map<any, any>>;
    /**
     * @esi_route ~get_corporations_corporation_id_starbases
     *
     * @returns Summary and status information for the set of starbases, mapped
     *     by their id
     */
    summaries(): Promise<Map<number, esi.corporation.structure.StarbaseSummary>>;
}
/**
 * An api adapter for accessing various details about every starbase of the
 * corporation.
 */
export declare class IteratedStarbases extends r.impl.SimpleIteratedResource<esi.corporation.structure.StarbaseSummary> implements r.Iterated<StarbaseAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @returns Details for all of the corporation's starbases
     */
    details(): AsyncIterableIterator<[number, esi.corporation.structure.Starbase]>;
    /**
     * @esi_route get_corporations_corporation_id_starbases
     *
     * @returns Summary and state information for the corporation's starbases
     */
    summaries(): AsyncIterableIterator<[number, esi.corporation.structure.StarbaseSummary]>;
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
export declare function makeStarbases(agent: SSOAgent<number | r.impl.IDProvider>): Starbases;
