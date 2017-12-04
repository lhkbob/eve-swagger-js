import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { MappedGroups } from './groups';
/**
 * The API specification for all variants that access information about an
 * in-game category or multiple categories. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all categories.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's type, or a collection related to the
 * key's type if multiple categories are being accessed at once.
 *
 * This is an API wrapper over the end points handling categories in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints.
 */
export interface CategoryAPI {
    details: Responses['get_universe_categories_category_id'];
}
/**
 * An api adapter for accessing various details of a single in-game category,
 * specified by a provided id when the api is instantiated.
 */
export declare class Category extends r.impl.SimpleResource implements r.Async<CategoryAPI> {
    private agent;
    private members_;
    constructor(agent: ESIAgent, id: number);
    /**
     * @returns Information about the category
     */
    details(): Promise<esi.universe.Category>;
    /**
     * @returns A MappedGroups instance tied to the groups defined in the details
     *    of this category
     */
    readonly members: MappedGroups;
}
/**
 * An api adapter for accessing various details of multiple category ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export declare class MappedCategories extends r.impl.SimpleMappedResource implements r.Mapped<CategoryAPI> {
    private agent;
    constructor(agent: ESIAgent, ids: number[] | Set<number>);
    /**
     * @returns Category details mapped by category id
     */
    details(): Promise<Map<number, esi.universe.Category>>;
}
/**
 * An api adapter for accessing various details about every category in the
 * game. Even though a route exists to get all category ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export declare class IteratedCategories extends r.impl.SimpleIteratedResource<number> implements r.Iterated<CategoryAPI> {
    private agent;
    constructor(agent: ESIAgent);
    /**
     * @returns Iterator over details of all in-game categories
     */
    details(): AsyncIterableIterator<[number, esi.universe.Category]>;
}
/**
 * A functional interface for getting APIs for a specific category, a
 * known set of category ids, or every category in the game.
 */
export interface Categories {
    /**
     * Create a new category api targeting every single category in the game.
     *
     * @esi_route ids get_universe_categories
     *
     * @returns An IteratedCategories API wrapper
     */
    (): IteratedCategories;
    /**
     * Create a new category api targeting the particular category by `id`.
     *
     * @param id The category id
     * @returns An Category API wrapper for the given id
     */
    (id: number): Category;
    /**
     * Create a new category api targeting the multiple category ids. If an
     * array is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The category ids
     * @returns A MappedCategories API wrapper for the given ids
     */
    (ids: number[] | Set<number>): MappedCategories;
}
/**
 * Create a new Categories instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Categories instance
 */
export declare function makeCategories(agent: ESIAgent): Categories;
