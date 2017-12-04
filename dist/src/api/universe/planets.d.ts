import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { MappedMoons } from './moons';
/**
 * The API specification for all variants that access information about a planet
 * or multiple planets. This interface will not be used directly, but will be
 * filtered through some mapper, such as {@link Async} or {@link Mapped}
 * depending on what types of ids are being accessed. However, this allows for a
 * concise and consistent specification for all variants: single, multiple, and
 * all planets.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple planets are being accessed at once.
 *
 * This is an API wrapper over the end points handling planets in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface PlanetAPI {
    details: Responses['get_universe_planets_planet_id'];
}
/**
 * An api adapter for accessing various details of a single planet,
 * specified by a provided id when the api is instantiated.
 */
export declare class Planet extends r.impl.SimpleResource implements r.Async<PlanetAPI> {
    private agent;
    private moons_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the planet
     */
    details(): Promise<esi.universe.Planet>;
    /**
     * @esi_route ~get_universe_systems_system_id
     *
     * @returns A MappedMoons instance for all the moons of the planet
     */
    readonly moons: MappedMoons;
}
/**
 * An api adapter for accessing various details of multiple planet ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedPlanets extends r.impl.SimpleMappedResource implements r.Mapped<PlanetAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns Planet details mapped by planet id
     */
    details(): Promise<Map<number, esi.universe.Planet>>;
}
/**
 * A functional interface for getting APIs for a specific planet or a
 * known set of planet ids. There is currently no way to iterate over all
 * planets in the game.
 */
export interface Planets {
    /**
     * Create a new planet api targeting the particular planet by `id`.
     *
     * @param id The planet id
     * @returns An Planet API wrapper for the given id
     */
    (id: number): Planet;
    /**
     * Create a new planet api targeting the multiple planet ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The planet ids
     * @returns A MappedPlanets API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedPlanets;
}
/**
 * Create a new Planets instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Planets instance
 */
export declare function makePlanets(agent: ESIAgent): Planets;
