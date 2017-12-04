import { esi } from '../../esi';
import { SSOAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about a
 * character's fitting or fittings. This interface will not be used directly,
 * but will be filtered through some mapper, such as {@link Async} or {@link
 * Mapped} depending on what types of ids are being accessed. However, this
 * allows for a concise and consistent specification for all variants: single,
 * multiple, and all fittings.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple fittings are being accessed at once.
 *
 * An api adapter over the end points handling a specific fitting via functions
 * in the [fittings](https://esi.tech.ccp.is/latest/#Fittings) ESI endpoints.
 */
export interface FittingAPI {
    details: esi.character.fitting.Fitting;
}
/**
 * An api adapter for accessing various details of a single fitting,
 * specified by a provided fitting id when the api is instantiated.
 */
export declare class Fitting extends r.impl.SimpleResource implements r.Async<FittingAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, id: number);
    /**
     * @esi_route ~get_characters_character_id_fittings
     *
     * @returns Details about the specific fitting
     */
    details(): Promise<esi.character.fitting.Fitting>;
    /**
     * Delete the specific fitting for the character.
     *
     * @esi_route delete_characters_character_id_fittings
     *
     * @returns An empty promise that resolves after the fitting has been deleted
     */
    del(): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of multiple fitting ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedFittings extends r.impl.SimpleMappedResource implements r.Mapped<FittingAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, ids: number[] | Set<number>);
    /**
     * @esi_route ~get_characters_character_id_fittings
     *
     * @returns The fitting details, mapped by id
     */
    details(): Promise<Map<number, esi.character.fitting.Fitting>>;
    /**
     * Delete the specific fittings for the character.
     *
     * @esi_route delete_characters_character_id_fittings
     *
     * @returns An empty promise that resolves after the fittings have been
     *     deleted
     */
    del(): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every fitting registered
 * to the character.
 */
export declare class IteratedFittings extends r.impl.SimpleIteratedResource<esi.character.fitting.Fitting> implements r.Iterated<FittingAPI> {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * @returns The fitting details for every fitting of the character
     */
    details(): AsyncIterableIterator<[number, esi.character.fitting.Fitting]>;
}
/**
 * A functional interface for creating APIs to access a single fitting, a
 * specific set of fittings, or every fitting registered to a character. It
 * additionally has members for adding new fittings.
 */
export interface Fittings {
    /**
     * Create a new fittings api targeting every fitting of the character.
     *
     * @returns An IteratedFittings API wrapper
     */
    (): IteratedFittings;
    /**
     * Create a new fittings end point targeting the particular fitting by `id`.
     *
     * @param id The fitting's id
     * @returns An Fitting API wrapper for the id
     */
    (id: number): Fitting;
    /**
     * Create a new fittings api targeting the multiple fittings ids. If an array
     * is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The fitting ids
     * @returns A MappedFittings API wrapper
     */
    (ids: number[] | Set<number>): MappedFittings;
    /**
     * Create a new fitting based on the specification provided.
     *
     * @esi_route post_characters_character_id_fittings
     *
     * @param fitting The fitting specification
     *
     * @returns The id of the newly created fitting
     */
    add(fitting: esi.character.fitting.NewFitting): Promise<number>;
}
/**
 * Create a new {@link Fittings} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Fittings API instance
 */
export declare function makeFittings(agent: SSOAgent<number>): Fittings;
