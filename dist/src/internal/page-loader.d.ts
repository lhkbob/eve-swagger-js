/**
 * A function that loads an explicit page of results, given an ordinal page
 * number.
 */
export interface PageRequest<T> {
    (page: number): Promise<T[]>;
}
/**
 * A function that loads a page of results where the pagination is determined by
 * an optional maximum ID. If the ID is provided, then the returned list of
 * results will all have elements with a lower ID.
 */
export interface MaxIDRequest<T> {
    (maxID: number | undefined): Promise<T[]>;
}
/**
 * A function that given an element from page of results, returns the id
 * corresponding to that result.
 */
export interface IDResolver<T> {
    (element: T): number;
}
/**
 * A utility function to fetch and concatenate all elements of a resource,
 * where the interface to the resource splits the elements into pages by
 * some mechanism.
 */
export interface PaginatedLoader<T> {
    /**
     * Fetch all elements and concatenate the results. This makes multiple
     * requests to the underlying paginated resource until a page has fewer than
     * the maximum expected results, or has no elements at all.
     */
    getAll(): Promise<T[]>;
}
/**
 * Create a PaginatedLoader that fetches all pages of a resource, where
 * the function `fetcher` gets a specific ordinal page. If `pageSize` is
 * provided, it represents the number of elements in a full page. If not
 * provided, pages are fetched until an empty array is returned.
 *
 * @param fetcher A function to return a page of results as Promised array;
 *     takes the page number to fetch.
 * @param pageSize Maximum number of elements in a result, if
 *    a response has fewer than this then continued fetching is ended
 */
export declare function makePageBasedLoader<T>(fetcher: PageRequest<T>, pageSize?: number): PaginatedLoader<T>;
/**
 * Create a PaginatedLoader that fetches all elements of a resource, where the
 * function `fetcher` gets either the most recent elements or the elements prior
 * to a specific ID. The `resolve` function is used to determine the next ID
 * used in the request chain from the end of the element array of the prior
 * response.
 *
 * If known, `resultLength` can be provided to make it easier to detect when the
 * end of results has been detected. Otherwise, requests will be made until a
 * response contains no elements.
 *
 * @param fetcher A function to return a page of results as Promised array;
 *     takes an maximum id that all results must be less than, or no id to
 *     return the latest results.
 * @param resolve A function to return the id of an element from the results
 * @param resultLength Maximum number of elements in a result, if
 *    a response has fewer than this then continued fetching is ended
 */
export declare function makeIDBasedLoader<T>(fetcher: MaxIDRequest<T>, resolve: IDResolver<T>, resultLength?: number): PaginatedLoader<T>;
