import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * The API specification for all variants that access information about an
 * in-game graphic or multiple graphics. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all graphics.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to
 * the key's type if multiple graphics are being accessed at once.
 *
 * This is an API wrapper over the end points handling graphics in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI
 * endpoints.
 */
export interface GraphicAPI {
    details: Responses['get_universe_graphics_graphic_id'];
}
/**
 * An api adapter for accessing various details of a single in-game graphic,
 * specified by a provided id when the api is instantiated.
 */
export declare class Graphic extends r.impl.SimpleResource implements r.Async<GraphicAPI> {
    private agent;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the graphic
     */
    details(): Promise<esi.universe.Graphic>;
}
/**
 * An api adapter for accessing various details of multiple graphic ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedGraphics extends r.impl.SimpleMappedResource implements r.Mapped<GraphicAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number>);
    /**
     * @returns Graphic details mapped by graphic id
     */
    details(): Promise<Map<number, esi.universe.Graphic>>;
}
/**
 * An api adapter for accessing various details about every graphic in
 * the game. Even though a route exists to get all graphic ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export declare class IteratedGraphics extends r.impl.SimpleIteratedResource<number> implements r.Iterated<GraphicAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game graphics
     */
    details(): AsyncIterableIterator<[number, esi.universe.Graphic]>;
}
/**
 * A functional interface for getting APIs for a specific graphic, a
 * known set of graphic ids, or every graphic in the game.
 */
export interface Graphics {
    /**
     * Create a new graphic api targeting every single graphic in the game.
     *
     * @esi_route ids get_universe_graphics
     *
     * @returns An IteratedGraphics API wrapper
     */
    (): IteratedGraphics;
    /**
     * Create a new graphic api targeting the particular graphic by `id`.
     *
     * @param id The graphic id
     * @returns An Graphic API wrapper for the given id
     */
    (id: number): Graphic;
    /**
     * Create a new graphic api targeting the multiple graphic ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The graphic ids
     * @returns A MappedGraphics API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedGraphics;
}
/**
 * Create a new Graphics instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Graphics instance
 */
export declare function makeGraphics(agent: ESIAgent): Graphics;
