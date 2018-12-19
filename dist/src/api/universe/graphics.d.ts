import { ESIAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter that provides functions for accessing various details for a
 * graphic specified by id, via functions in the
 * [universe](https://esi.evetech.net/latest/#/Universe) ESI endpoints.
 */
export interface Graphic {
    /**
     * @esi_example esi.graphics(id).info()
     *
     * @returns Details about the specific graphic
     */
    info(): Promise<Responses['get_universe_graphics_graphic_id']>;
    /**
     * @returns The ID of the graphic
     */
    id(): Promise<number>;
}
/**
 * An api adapter that provides functions for accessing graphics information via
 * the [universe](https://esi.evetech.net/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Graphics` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Graphics#all all} or {@link Graphics#get get}
 * if an id is provided.
 */
export interface Graphics {
    /**
     * @esi_example esi.graphics()
     *
     * @returns List of ids for all graphics in Eve
     */
    (): Promise<Responses['get_universe_graphics']>;
    /**
     * Create a new Graphic end point targeting the particular moon
     * by `id`.
     *
     * @param id The graphic ID
     * @returns The Graphic API wrapper for the id
     */
    (id: number): Graphic;
}
/**
 * Create a new {@link Graphics} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Graphics API instance
 */
export declare function makeGraphics(agent: ESIAgent): Graphics;
