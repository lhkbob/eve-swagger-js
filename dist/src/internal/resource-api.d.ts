/**
 * Map the resource definition `T` to a set of functions that return Promises
 * resolving to the responses. This mapping is used when a single element or
 * resource id is being accessed or modified. Depending on the underlying
 * resource, this may make individual requests or filter the result of a bulk
 * request.
 */
export declare type Async<T> = {
    [K in keyof T]: () => Promise<T[K]>;
};
/**
 * Map the resource definition `T` to a set of functions that return Promises
 * that resolve to a Map containing the responses for a finite set of resource
 * ids. This mapping is used when the set of resource ids is known ahead of time
 * or can be resolved some other way, like a search result or response from
 * another request. The mapping performs the same action on each of the ids,
 * possibly using bulk operations if they are available.
 */
export declare type Mapped<T> = {
    [K in keyof T]: () => Promise<Map<number, T[K]>>;
};
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
export declare type Iterated<T extends Object> = {
    [K in keyof T]: () => AsyncIterableIterator<[number, T[K]]>;
};
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
export declare type SingleResource = Resource<Promise<number>>;
/**
 * A Resource that accesses multiple ids within the same category. Usually
 * implemented in conjunction with {@link Mapped}.
 */
export declare type MappedResource = Resource<Promise<Set<number>>>;
/**
 * A Resource that accesses a large, possibly infinite collection of ids within
 * the same resource category. Usually implemented in conjunction with {@link
    * Iterated}.
 */
export declare type IteratedResource = Resource<AsyncIterableIterator<number>>;
/**
 * The `impl` namespace provides a number of abstract base classes for
 * implementing the single, mapped, and iterated resource variants.
 */
export declare namespace impl {
    /**
     * A helper function for accessing a single resource's data that is not
     * otherwise accessible via bulk request.
     */
    interface ResourceLoader<T> {
        (id: number): Promise<T>;
    }
    /**
     * A function that produces an asynchronous iterator over elements of type
     * `T`.
     */
    interface ResourceStreamer<T> {
        (): AsyncIterableIterator<T>;
    }
    /**
     * A function that asynchronously provides an id
     */
    interface IDProvider {
        (): Promise<number>;
    }
    /**
     * A function that asynchronously provides a set of ids represented as an
     * array.
     */
    interface IDSetProvider {
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
    interface PageLoader<T> {
        (page: number): Promise<T[] | {
            result: T[];
            maxPages?: number;
        }>;
    }
    /**
     * A function that loads a page of elements where pagination is based off a
     * maximum id. If no id is provided, then the most recent elements are
     * returned. If it is provided, then the most recent elements less than that
     * id are returned.
     */
    interface MaxIDLoader<T> {
        (maxID?: number): Promise<T[]>;
    }
    /**
     * A function that extracts the resource identifier from an element of a page.
     */
    interface IDResolver<T> {
        (value: T): number;
    }
    /**
     * A utility base class for SingleResource where the id is known ahead of
     * time.
     */
    abstract class SimpleResource implements SingleResource {
        protected id_: number;
        /**
         * @param id_ The id that is always accessed
         */
        constructor(id_: number);
        ids(): Promise<number>;
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
    function filterArray<T>(resources: T[], id: number, resolver: IDResolver<T>): T;
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
    function filterArrayToMap<T>(resources: T[], ids: number[], resolver: IDResolver<T>): Map<number, T>;
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
    function filterIterated<T>(resources: AsyncIterableIterator<T>, id: number, resolver: IDResolver<T>): Promise<T>;
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
    function filterIteratedToMap<T>(resources: AsyncIterableIterator<T>, ids: number[], resolver: IDResolver<T>): Promise<Map<number, T>>;
    /**
     * A utility base class for a MappedResource where the ids are known ahead of
     * time or can be resolved by an asynchronous function that will return a
     * reasonably sized set of ids.
     */
    abstract class SimpleMappedResource implements MappedResource {
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
        constructor(ids: number[] | Set<number> | IDSetProvider);
        /**
         * An optimized method for getting to the ids as an array, since that is
         * how the ESI agent needs to consume them. Subclasses can use this when
         * implementing bulk functionality.
         *
         * @returns The ids as an array, skipping the extraneous Set creation
         */
        protected arrayIDs(): Promise<number[]>;
        /**
         * A helper function to execute the resource loader for each of the ids
         * represented by this mapped resource and bundle them into a Map.
         *
         * @param loader The resource loader handling a single id
         * @returns A Promise resolving to a map containing all responses
         */
        protected getResource<T>(loader: ResourceLoader<T>): Promise<Map<number, T>>;
        ids(): Promise<Set<number>>;
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
    abstract class SimpleIteratedResource<T> implements IteratedResource {
        protected streamer: ResourceStreamer<T>;
        protected idResolver: IDResolver<T>;
        /**
         * @param streamer The function that provides streams of the paginated
         *     resource
         * @param idResolver The function that maps an element to its id
         */
        constructor(streamer: ResourceStreamer<T>, idResolver: IDResolver<T>);
        /**
         * A helper function to automatically call the resource loader on each of
         * the ids returned.
         *
         * @param loader Function to get individual elements by id
         * @returns Asynchronous iterator over the resolved elements
         */
        protected getResource<E>(loader: ResourceLoader<E>): AsyncIterableIterator<[number, E]>;
        /**
         * A helper function to transform the paginated resource of type `T` into
         * an asynchronous iterator over identified tuples. This returned value is
         * suitable to be the returned value for an `Iterated<API>`.
         *
         * @returns An iterator over the paginated reosurce
         */
        protected getPaginatedResource(): AsyncIterableIterator<[number, T]>;
        ids(): AsyncIterableIterator<number>;
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
    function makePageBasedStreamer<T>(pageLoader: PageLoader<T>, maxPageSize?: number): ResourceStreamer<T>;
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
    function makeMaxIDStreamer<T>(pageLoader: MaxIDLoader<T>, idResolver: IDResolver<T>, maxPageSize?: number): ResourceStreamer<T>;
    /**
     * A utility function that creates a ResourceStreamer based off of a function
     * that asynchronously provides a complete array of elements.
     *
     * @param arrayLoader The function which loads all elements at once
     * @returns A ResourceStreamer over the loaded array
     */
    function makeArrayStreamer<T>(arrayLoader: () => Promise<T[]>): ResourceStreamer<T>;
}
