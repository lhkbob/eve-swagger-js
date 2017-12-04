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
export declare class MiningObserver extends r.impl.SimpleResource implements r.Async<MiningObserverAPI> {
    private agent;
    private ledger_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, id: number);
    /**
     * @esi_route ~get_corporation_corporation_id_mining_observers_observer_id
     *
     * @returns The details about the observer
     */
    details(): Promise<{
        last_updated: string;
        observer_id: number;
        observer_type: "structure";
    }>;
    /**
     * @esi_route get_corporation_corporation_id_mining_observers_observer_id
     *
     * @returns The ledger entries for the mining observer
     */
    ledger(): AsyncIterableIterator<esi.corporation.industry.MiningRecord>;
}
/**
 * An api adapter for accessing various details of multiple mining observer ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedMiningObservers extends r.impl.SimpleMappedResource implements r.Mapped<MiningObserverAPI> {
    private agent;
    private observers_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_corporation_corporation_id_mining_observers
     * @esi_route *get_corporation_corporation_id_mining_observers_observer_id
     *
     * @returns The details about the observers mapped by id
     */
    details(): Promise<Map<any, any>>;
}
/**
 * An api adapter for accessing various details about every mining observer
 * associated with the corporation.
 */
export declare class IteratedMiningObservers extends r.impl.SimpleIteratedResource<esi.corporation.industry.MiningObserver> implements r.Iterated<MiningObserverAPI> {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @esi_route get_corporation_corporation_id_mining_observers
     *
     * @returns The details about every observer in the corporation
     */
    details(): AsyncIterableIterator<[number, esi.corporation.industry.MiningObserver]>;
}
/**
 * An interface for getting APIs for a specific mining observer, a
 * known set of mining observer ids, or every mining observer for a corporation.
 */
export declare class Mining {
    private agent;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @returns The scheduled mining extractions for the corporation
     */
    extractions(): Promise<Responses['get_corporation_corporation_id_mining_extractions']>;
    /**
     * Create a new mining observer api targeting every single mining observer of
     * the corporation.
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
}
