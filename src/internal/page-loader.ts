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
export function makePageBasedLoader<T>(fetcher: PageRequest<T>,
    pageSize?: number): PaginatedLoader<T> {
  return new PageLoader(fetcher, pageSize);
}

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
export function makeIDBasedLoader<T>(fetcher: MaxIDRequest<T>,
    resolve: IDResolver<T>, resultLength?: number): PaginatedLoader<T> {
  return new MaxIDLoader(fetcher, resolve, resultLength);
}

class PageLoader<T> implements PaginatedLoader<T> {
  constructor(private fetch: PageRequest<T>, private pageLength?: number) {
  }

  getAll() {
    return this.getPage(1);
  }

  private getPage(page: number): Promise<T[]> {
    return this.fetch(page).then(result => {
      if ((this.pageLength && result.length < this.pageLength) || result.length
          == 0) {
        // End of the data if the page length is fewer than the expected
        // amounts, or if no expected amount, that the page is completely empty
        return result;
      } else {
        // Fetch the next page and then concatenate
        return this.getPage(page + 1).then(nextResult => {
          // FIXME de-duplicate results if page contents shift between calls
          return result.concat(nextResult);
        });
      }
    });
  }
}

class MaxIDLoader<T> implements PaginatedLoader<T> {
  constructor(private fetch: MaxIDRequest<T>, private resolve: IDResolver<T>,
      private resultLength?: number) {
  }

  getAll() {
    return this.getPrior(undefined);
  }

  private getPrior(maxId: number | undefined) :Promise<T[]> {
    return this.fetch(maxId).then(result => {
      if ((this.resultLength && result.length < this.resultLength)
          || result.length == 0) {
        // End of the data so just return it
        return result;
      } else {
        // Iterate and fetch again based on the id at the end of the result
        // (assuming that ids are sorted appropriately in the result).
        let nextMaxId = this.resolve(result[result.length - 1]);
        return this.getPrior(nextMaxId).then(nextResult => {
          // Note: this shouldn't require de-duplication because pagination
          // is based off of ids, and so each call should return mutually
          // exclusive sets.
          return result.concat(nextResult);
        });
      }
    });
  }
}
