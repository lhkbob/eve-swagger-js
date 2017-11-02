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
export class Category extends r.impl.SimpleResource implements r.Async<CategoryAPI> {
  private members_: MappedGroups | undefined;

  constructor(private agent: ESIAgent, id: number) {
    super(id);
  }

  /**
   * @returns Information about the category
   */
  details() {
    return getDetails(this.agent, this.id_);
  }

  /**
   * @returns A MappedGroups instance tied to the groups defined in the details
   *    of this category
   */
  get members(): MappedGroups {
    if (this.members_ === undefined) {
      this.members_ = new MappedGroups(this.agent,
          () => this.details().then(result => result.groups));
    }
    return this.members_!;
  }
}

/**
 * An api adapter for accessing various details of multiple category ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
export class MappedCategories extends r.impl.SimpleMappedResource implements r.Mapped<CategoryAPI> {
  constructor(private agent: ESIAgent, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns Category details mapped by category id
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
}

/**
 * An api adapter for accessing various details about every category in the
 * game. Even though a route exists to get all category ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
export class IteratedCategories extends r.impl.SimpleIteratedResource<number> implements r.Iterated<CategoryAPI> {
  constructor(private agent: ESIAgent) {
    super(r.impl.makeArrayStreamer(
        () => agent.request('get_universe_categories', undefined)), id => id);
  }

  /**
   * @returns Iterator over details of all in-game categories
   */
  details() {
    return this.getResource(id => getDetails(this.agent, id));
  }
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
export function makeCategories(agent: ESIAgent): Categories {
  return <Categories> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All categories since no id
      return new IteratedCategories(agent);
    } else if (typeof ids === 'number') {
      // Single id so single API
      return new Category(agent, ids);
    } else {
      // Set or array, so mapped API
      return new MappedCategories(agent, ids);
    }
  };
}

function getDetails(agent: ESIAgent, id: number) {
  return agent.request('get_universe_categories_category_id',
      { path: { category_id: id } });
}
