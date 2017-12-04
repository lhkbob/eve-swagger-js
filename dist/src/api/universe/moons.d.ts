import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a moon
 * or multiple moons. This interface will not be used directly, but will be
 * filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all moons.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple moons are being accessed at once.
 *
 * This is an API wrapper over the end points handling moons in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface MoonAPI {
    details: Responses['get_universe_moons_moon_id'];
}
/**
 * An api adapter for accessing various details of a single moon,
 * specified by a provided id when the api is instantiated.
 */
export declare class Moon extends r.impl.SimpleResource implements r.Async<MoonAPI> {
    private agent;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the moon
     */
    details(): Promise<esi.universe.Moon>;
}
/**
 * An api adapter for accessing various details of multiple moon ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedMoons extends r.impl.SimpleMappedResource implements r.Mapped<MoonAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Moon details mapped by moon id
     */
    details(): Promise<Map<number, esi.universe.Moon>>;
}
/**
 * A functional interface for getting APIs for a specific moon or a
 * known set of moon ids. There is currently no way to iterate over all
 * moons in the game.
 */
export interface Moons {
    /**
     * Create a new moon api targeting the particular moon by `id`.
     *
     * @param id The moon id
     * @returns An Moon API wrapper for the given id
     */
    (id: number): Moon;
    /**
     * Create a new moon api targeting the multiple moon ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The moon ids
     * @returns A MappedMoons API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedMoons;
}
/**
 * Create a new Moons instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Moons instance
 */
export declare function makeMoons(agent: ESIAgent): Moons;
