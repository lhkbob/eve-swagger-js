// Force loading of this library to make sure the types are available at runtime
import { ErrorName, ESIError } from '../error';

require('./async-iterator');

/**
 * Map the resource definition `T` to a set of functions that return Promises
 * resolving to the responses. This mapping is used when a single element or
 * resource id is being accessed or modified. Depending on the underlying
 * resource, this may make individual requests or filter the result of a bulk
 * request.
 */
export type Async<T> = {
    [K in keyof T]: () => Promise<T[K]>;
    }

/**
 * Map the resource definition `T` to a set of functions that return Promises
 * that resolve to a Map containing the responses for a finite set of resource
 * ids. This mapping is used when the set of resource ids is known ahead of time
 * or can be resolved some other way, like a search result or response from
 * another request. The mapping performs the same action on each of the ids,
 * possibly using bulk operations if they are available.
 */
export type Mapped<T> = {
    [K in keyof T]: () => Promise<Map<number, T[K]>>;
    }

/**
 * Map the resource definition `T` to a set of functions that return
 * asynchronous iterators that resolve for each element of the collection. This
 * is used when a collection of resources is paginated, overly large, or of
 * potentially unbounded size and trying to request all further details at once
 * is unreasonable.
 *
 * Note that the iterator returns tuples containing the id and corresponding
 * value. This is done because often the resolved value will not contain its
 * original id.
 */
export type Iterated<T extends Object> = {
    [K in keyof T]: () => AsyncIterableIterator<[number, T[K]]>;
    }

/**
 * A Resource represents any of the core, id-oriented types that the ESI
 * routes operate on. These can be alliances, characters, corporations, or
 * more abstract entities like types, transactions, etc.
 */
export interface Resource<T> {
  ids(): T;
}

/**
 * A Resource that accesses only a single identifier of the resource category.
 * Usually implemented in conjunction with {@link Async}.
 */
export type SingleResource = Resource<Promise<number>>;

/**
 * A Resource that accesses multiple ids within the same category. Usually
 * implemented in conjunction with {@link Mapped}.
 */
export type MappedResource = Resource<Promise<Set<number>>>;

/**
 * A Resource that accesses a large, possibly infinite collection of ids within
 * the same resource category. Usually implemented in conjunction with {@link
    * Iterated}.
 */
export type IteratedResource = Resource<AsyncIterableIterator<number>>;


/**
 * The `impl` namespace provides a number of abstract base classes for
 * implementing the single, mapped, and iterated resource variants.
 */
export namespace impl {
  /**
   * A helper function for accessing a single resource's data that is not
   * otherwise accessible via bulk request.
   */
  export interface ResourceLoader<T> {
    (id: number): Promise<T>;
  }

  /**
   * A function that produces an asynchronous iterator over elements of type
   * `T`.
   */
  export interface ResourceStreamer<T> {
    (): AsyncIterableIterator<T>;
  }

  /**
   * A function that asynchronously provides an id
   */
  export interface IDProvider {
    (): Promise<number>;
  }

  /**
   * A function that asynchronously provides a set of ids represented as an
   * array.
   */
  export interface IDSetProvider {
    (): Promise<number[]>;
  }

  /**
   * A function that loads an entire page of elements. Sometimes paginated
   * resources just return a page of numbers, in which case `T = number`, but
   * in other cases the elements are the full values or a smaller summary.
   *
   * The function returns a promise resolving to a tuple. The tuple's first
   * element contains the page elements. The tuple's second element is optional
   * and contains the maximum number of pages available for the resource, if
   * known.
   */
  export interface PageLoader<T> {
    (page: number): Promise<T[] | { result: T[], maxPages?: number }>;
  }

  /**
   * A function that loads a page of elements where pagination is based off a
   * maximum id. If no id is provided, then the most recent elements are
   * returned. If it is provided, then the most recent elements less than that
   * id are returned.
   */
  export interface MaxIDLoader<T> {
    (maxID?: number): Promise<T[]>;
  }

  /**
   * A function that extracts the resource identifier from an element of a page.
   */
  export interface IDResolver<T> {
    (value: T): number;
  }

  /**
   * A utility base class for SingleResource where the id is known ahead of
   * time.
   */
  export abstract class SimpleResource implements SingleResource {
    /**
     * @param id_ The id that is always accessed
     */
    constructor(protected id_: number) {
    }

    ids(): Promise<number> {
      return Promise.resolve(this.id_);
    }
  }

  /**
   * Filter an array of values from a request's response to the single element
   * which has the `id`. The id corresponding to an element is determined by
   * the `resolver` function.
   *
   * @param resources The array of elements returned by the request
   * @param id The id to search for within the elements
   * @param resolver The function mapping from element to id
   * @returns The matching element, or throws a not-found ESIError
   */
  export function filterArray<T>(resources: T[], id: number,
      resolver: IDResolver<T>): T {
    for (let value of resources) {
      if (resolver(value) === id) {
        return value;
      }
    }

    throw new ESIError(ErrorName.NOT_FOUND_ERROR,
        'Could not find value for id: %d', id);
  }

  /**
   * Filter an array of values from a request's response to a map from id to
   * element, based on the provided set of `ids`. The id of an element is
   * determined by the `resolver` function. It is assumed that `ids` conforms to
   * a set's uniqueness property.
   *
   * @param resources The array of elements returned by the request
   * @param ids The ids to filter from resources
   * @param resolver The function mapping from element to id
   * @returns A map from id to matching element, or throws a not-found ESIError
   */
  export function filterArrayToMap<T>(resources: T[], ids: number[],
      resolver: IDResolver<T>): Map<number, T> {
    let map = new Map();
    for (let id of ids) {
      for (let value of resources) {
        if (resolver(value) === id) {
          // Found the value for the key
          map.set(id, value);
          break;
        }
      }

      if (!map.has(id)) {
        // Didn't find it
        throw new ESIError(ErrorName.NOT_FOUND_ERROR,
            'Could not find value for id: %d', id);
      }
    }

    return map;
  }

  /**
   * Filter an iterated collection of values from a request's paginated
   * response
   * to the single element which has the `id`. The id corresponding to an
   * element is determined by the `resolver` function.
   *
   * @param resources The iterator over resource elements
   * @param id The id to search for
   * @param resolver The function mapping from element to id
   * @returns The matching element, or throws a not-found ESIError
   */
  export async function filterIterated<T>(resources: AsyncIterableIterator<T>,
      id: number, resolver: IDResolver<T>): Promise<T> {
    for await (let e of resources) {
      if (resolver(e) === id) {
        return e;
      }
    }

    throw new ESIError(ErrorName.NOT_FOUND_ERROR,
        'Could not find value for id: %d', id);
  }

  /**
   * Filter an iterated collection of values from a request's paginated response
   * to a map from id to element, based on the provided set of `ids`. The id of
   * an elemtn is determined by the `resolver` function. It is assumed that
   * `ids` conforms to a set's uniqueness property.
   *
   * @param resources The iterator over resource elements
   * @param ids The ids to filter from resources
   * @param resolver The function mapping from element to id
   * @returns A map from id to matching element, or throws a not-found ESIError
   */
  export async function filterIteratedToMap<T>(resources: AsyncIterableIterator<T>,
      ids: number[], resolver: IDResolver<T>): Promise<Map<number, T>> {
    let map = new Map();

    // Unlike filterArrayToMap, iterate over the resources first since it can
    // only be iterated through once - must check presence of all ids afterwards
    for await (let e of resources) {
      let eID = resolver(e);
      if (ids.indexOf(eID) >= 0) {
        // One of the requested ones
        map.set(eID, e);
      }

      // Early exit if all the ids have been found
      if (map.size === ids.length) {
        break;
      }
    }

    // Ensure all ids are accounted for
    if (map.size !== ids.length) {
      // At least one is missing, throw exception with first missing id
      for (let id of ids) {
        if (!map.has(id)) {
          throw new ESIError(ErrorName.NOT_FOUND_ERROR,
              'Could not find value for id: %d', id);
        }
      }
    }

    return map;
  }

  /**
   * A utility base class for a MappedResource where the ids are known ahead of
   * time or can be resolved by an asynchronous function that will return a
   * reasonably sized set of ids.
   */
  export abstract class SimpleMappedResource implements MappedResource {
    // The ESI routes consume bulk ids as an array, but often have set-like
    // requirements on those values. Store the ids as an array since it is
    // likely to be used directly more often than wrapping as a set.
    protected ids_: number[] | IDSetProvider;

    /**
     * The `ids` can either be an array of ids, in which case all unique items
     * are removed; it can already be a `Set` of ids; and it can be a function
     * asynchronously resolving to an id set (represented as an array). It is
     * assumed for efficiency's sake that such a resolved id set does not have
     * duplicates in it.
     *
     * @param ids The set of ids that are mapped
     */
    constructor(ids: number[] | Set<number> | IDSetProvider) {
      if (ids instanceof Set) {
        // Unwrap the set into a simple array
        this.ids_ = Array.from(ids);
      } else if (Array.isArray(ids)) {
        // First convert the array into a set to remove duplicates
        this.ids_ = Array.from(new Set(ids));
      } else {
        // It's a provider function, which we trust to provide a set-like array
        this.ids_ = ids;
      }
    }

    /**
     * An optimized method for getting to the ids as an array, since that is
     * how the ESI agent needs to consume them. Subclasses can use this when
     * implementing bulk functionality.
     *
     * @returns The ids as an array, skipping the extraneous Set creation
     */
    protected arrayIDs(): Promise<number[]> {
      if (Array.isArray(this.ids_)) {
        return Promise.resolve(this.ids_);
      } else {
        return this.ids_();
      }
    }

    /**
     * A helper function to execute the resource loader for each of the ids
     * represented by this mapped resource and bundle them into a Map.
     *
     * @param loader The resource loader handling a single id
     * @returns A Promise resolving to a map containing all responses
     */
    protected getResource<T>(loader: ResourceLoader<T>): Promise<Map<number, T>> {
      return this.arrayIDs().then(ids => {
        return Promise.all(ids.map(loader)).then(responses => {
          let map = new Map();
          for (let i = 0; i < ids.length; i++) {
            map.set(ids[i], responses[i]);
          }
          return map;
        });
      });
    }

    ids(): Promise<Set<number>> {
      if (Array.isArray(this.ids_)) {
        return Promise.resolve(new Set(this.ids_));
      } else {
        return this.ids_().then(ids => new Set(ids));
      }
    }
  }

  /**
   * A helper class that provides the definition of `ids()` and convenience
   * functions to map a resource stream to asynchronous iterators of related
   * types: {@link getResource} and {@link getPaginatedResource}.
   *
   * This class does not define the pagination mechanism, and requires the
   * implementation of a raw paginated resource iterator. APIs can use {@link
      * makeArrayStreamer}, {@link makePageBasedStreamer} or, {@link
      * makeMaxIDStreamer} to conveniently build a ResourceStreamer based on
      * their pagination style.
   */
  export abstract class SimpleIteratedResource<T> implements IteratedResource {
    /**
     * @param streamer The function that provides streams of the paginated
     *     resource
     * @param idResolver The function that maps an element to its id
     */
    constructor(protected streamer: ResourceStreamer<T>,
        protected idResolver: IDResolver<T>) {
    }

    /**
     * A helper function to automatically call the resource loader on each of
     * the ids returned.
     *
     * @param loader Function to get individual elements by id
     * @returns Asynchronous iterator over the resolved elements
     */
    protected async * getResource<E>(loader: ResourceLoader<E>): AsyncIterableIterator<[number, E]> {
      for await (let value of this.streamer()) {
        let id = this.idResolver(value);
        yield loader(id).then(e => <[number, E]> [id, e]);
      }
    }

    /**
     * A helper function to transform the paginated resource of type `T` into
     * an asynchronous iterator over identified tuples. This returned value is
     * suitable to be the returned value for an `Iterated<API>`.
     *
     * @returns An iterator over the paginated reosurce
     */
    protected async * getPaginatedResource(): AsyncIterableIterator<[number, T]> {
      for await (let value of this.streamer()) {
        let id = this.idResolver(value);
        yield <[number, T]> [id, value];
      }
    }

    async * ids(): AsyncIterableIterator<number> {
      for await (let value of this.streamer()) {
        yield this.idResolver(value);
      }
    }
  }

  /**
   * A utility function that creates a ResourceStreamer based off of a function
   * that provides pages of elements, and an optional parameter of the number of
   * elements per full page. This converts the page-based resource into a
   * more convenient asynchronous iterator over the elements.
   *
   * @param pageLoader The function that loads a specific page of elements
   * @param maxPageSize Optional, the size of a full page. If known, it can
   *     help reduce excess requests.
   * @returns A ResourceStreamer factory function for the page-based loader
   */
  export function makePageBasedStreamer<T>(pageLoader: PageLoader<T>,
      maxPageSize?: number): ResourceStreamer<T> {
    return () => getPageBasedIterator(pageLoader, maxPageSize);
  }

  /**
   * A utility function that creates a ResourceStreamer based off of a function
   * that provides pages of elements, and an optional parameter of the number of
   * elements per full page, paginated by a maximum id constraint. This converts
   * the max-id based resource into a more convenient asynchronous iterator over
   * the elements.
   *
   * @param pageLoader The function that loads a specific page of elements
   *     with a specific id constraint
   * @param idResolver The function that turns page elements into their ids
   * @param maxPageSize Optional, the size of a full page. If known, it can
   *     help reduce excess requests.
   * @returns A ResourceStreamer factory function for the max-id based loader
   */
  export function makeMaxIDStreamer<T>(pageLoader: MaxIDLoader<T>,
      idResolver: IDResolver<T>, maxPageSize?: number): ResourceStreamer<T> {
    return () => getMaxIDIterator(pageLoader, idResolver, maxPageSize);
  }

  /**
   * A utility function that creates a ResourceStreamer based off of a function
   * that asynchronously provides a complete array of elements.
   *
   * @param arrayLoader The function which loads all elements at once
   * @returns A ResourceStreamer over the loaded array
   */
  export function makeArrayStreamer<T>(arrayLoader: () => Promise<T[]>): ResourceStreamer<T> {
    return () => getArrayIterator(arrayLoader);
  }

  async function* getPageBasedIterator<T>(pageLoader: PageLoader<T>,
      maxPageSize?: number) {
    let page = 1;
    let maxPages: number | undefined = undefined;

    while (maxPages === undefined || page < maxPages) {
      let pageResults = await pageLoader(page);
      let elements: T[];

      // Process the extracted maximum number of pages
      if (Array.isArray(pageResults)) {
        // No maximum provided so use as elements directly
        elements = pageResults;
      } else {
        // Array and max size specification
        elements = pageResults.result;
        if (pageResults.maxPages !== undefined && maxPages === undefined) {
          maxPages = pageResults.maxPages;
        }
      }

      // Early exit for empty page
      if (elements.length === 0) {
        break;
      }

      // Yield the elements
      yield* elements;

      // Determine stopping criteria in the event that max pages is known
      if (maxPageSize !== undefined && elements.length < maxPageSize) {
        break;
      }

      // Move on to next page
      page++;
    }
  }

  async function* getMaxIDIterator<T>(pageLoader: MaxIDLoader<T>,
      idResolver: IDResolver<T>, maxPageSize?: number) {
    let maxID: number | undefined = undefined;

    while (true) {
      let pageResults = await pageLoader(maxID);

      // Early exit for an empty page
      if (pageResults.length == 0) {
        break;
      }

      // Yield all the elements
      yield* pageResults;

      // Stopping criteria if the max page size is known
      if (maxPageSize !== undefined && pageResults.length < maxPageSize) {
        break;
      }

      // Advance to next id constraint
      maxID = idResolver(pageResults[pageResults.length - 1]);
    }
  }

  async function* getArrayIterator<T>(arrayLoader: () => Promise<T[]>) {
    let array = await arrayLoader();
    yield* array;
  }
}
