import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a star
 * or multiple stars. This interface will not be used directly, but will be
 * filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all stars.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple stars are being accessed at once.
 *
 * This is an API wrapper over the end points handling stars in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface StarAPI {
    details: Responses['get_universe_stars_star_id'];
}
/**
 * An api adapter for accessing various details of a single PI star,
 * specified by a provided id when the api is instantiated.
 */
export declare class Star implements r.Async<StarAPI>, r.SingleResource {
    private agent;
    private id;
    constructor(agent: ESIAgent, id: number | r.impl.IDProvider);
    /**
     * @returns Information about the star
     */
    details(): Promise<esi.universe.Star>;
    ids(): Promise<number>;
}
/**
 * An api adapter for accessing various details of multiple star ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedStars extends r.impl.SimpleMappedResource implements r.Mapped<StarAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number>);
    /**
     * @returns Star details mapped by star id
     */
    details(): Promise<Map<number, esi.universe.Star>>;
}
/**
 * A functional interface for getting APIs for a specific star or a
 * known set of star ids. There is currently no way to iterate over all
 * stars in the game.
 */
export interface Stars {
    /**
     * Create a new star api targeting the particular star by `id`.
     *
     * @param id The star id
     * @returns An Star API wrapper for the given id
     */
    (id: number): Star;
    /**
     * Create a new star api targeting the multiple star ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The star ids
     * @returns A MappedStars API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedStars;
}
/**
 * Create a new Stars instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Stars instance
 */
export declare function makeStars(agent: ESIAgent): Stars;
