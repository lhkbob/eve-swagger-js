import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about an
 * alliance or multiple alliances. This interface will not be used directly, but
 * will be filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all alliances.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple alliances are being accessed at once.
 *
 * This is an API wrapper over the end points handling alliances via functions
 * in the [alliance](https://esi.tech.ccp.is/latest/#/Alliance) ESI endpoints.
 */
export interface AllianceAPI {
    details: Responses['get_alliances_alliance_id'];
    corporations: Responses['get_alliances_alliance_id_corporations'];
    icons: Responses['get_alliances_alliance_id_icons'];
    names: string;
}
/**
 * An api adapter for accessing various details of a single alliance, specified
 * by a provided id when the api is instantiated.
 */
export declare class Alliance implements r.Async<AllianceAPI>, r.SingleResource {
    private agent;
    private id;
    constructor(agent: ESIAgent, id: number | r.impl.IDProvider);
    /**
     * @returns The public info of the alliance
     */
    details(): Promise<esi.alliance.Alliance>;
    /**
     * @returns The ids of the corporation members of the alliance
     */
    corporations(): Promise<number[]>;
    /**
     * @returns URL lookup information for the alliance icon images
     */
    icons(): Promise<esi.alliance.Icons>;
    /**
     * @esi_route ~get_alliances_alliance_id
     *
     * @returns The name of the alliance
     */
    names(): Promise<string>;
    ids(): Promise<number>;
}
/**
 * An api adapter for accessing various details of multiple alliance, specified
 * by a provided an array, set of ids, or search query when the api is
 * instantiated.
 */
export declare class MappedAlliances extends r.impl.SimpleMappedResource implements r.Mapped<AllianceAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Map from alliance id to their details
     */
    details(): Promise<Map<number, esi.alliance.Alliance>>;
    /**
     * @returns Map from alliance id to their corporation members
     */
    corporations(): Promise<Map<number, number[]>>;
    /**
     * @returns Map from alliance id to their icon information
     */
    icons(): Promise<Map<number, esi.alliance.Icons>>;
    /**
     * @esi_route post_universe_names [alliance]
     * @esi_route get_alliances_names
     *
     * @returns Map from alliance id to their name
     */
    names(): Promise<Map<any, any>>;
}
/**
 * An api adapter for accessing various details about every alliance in the
 * game. Even though a route exists to get all alliance ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export declare class IteratedAlliances extends r.impl.SimpleIteratedResource<number> implements r.Iterated<AllianceAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator for details of every alliance
     */
    details(): AsyncIterableIterator<[number, esi.alliance.Alliance]>;
    /**
     * @returns Iterator for the member corporations of every alliance
     */
    corporations(): AsyncIterableIterator<[number, number[]]>;
    /**
     * @returns Iterator for the icon information of every alliance
     */
    icons(): AsyncIterableIterator<[number, esi.alliance.Icons]>;
    /**
     * @esi_route post_universe_names [alliance]
     *
     * @returns Iterator for the names of every alliance
     */
    names(): AsyncIterableIterator<[number, string]>;
}
