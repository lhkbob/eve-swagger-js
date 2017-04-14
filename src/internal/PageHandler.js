/**
 * A utility class to fetch all pages of a resource where pagination is
 * represented by ordinal page numbers.
 * @private
 */
class PageHandler {
  /**
   * Create a PageHandler that fetches partial results using `fetch`, which
   * must be a function that takes a page number and returns a Promise
   * that resolves to an array.
   *
   * If known, `resultLength` can be provided to make it easier to detect when
   * the end of results has been detected.
   *
   * @param fetch {Function} Return a page of results as Promised array; takes
   *    the page number to fetch.
   * @param resultLength {Number} Maximum number of elements in a result, if
   *    a response has fewer than this then continued fetching is ended
   */
  constructor(fetch, resultLength = 0) {
    this._fetch = fetch;
    this._resultLength = resultLength;
  }

  /**
   * Load all pages for the wrapped resource by repeatedly calling the `fetch`
   * function provided to the handler at creation time. This continues until the
   * result is empty or less than the configured max elements per fetch.
   *
   * @return Promise The promise resolving to an array representing the entire
   *     sequence of data
   */
  getAll() {
    return this._get(1);
  }

  _get(page) {
    return this._fetch(page).then(result => {
      if (result.length < this._resultLength || result.length == 0) {
        // End of the data so return it
        return result;
      } else {
        // Fetch the next page
        return this._get(page + 1).then(nextResult => {
          // FIXME de-duplicate results if page contents shift between calls
          return result.concat(nextResult);
        });
      }
    });
  }
}

/**
 * A utility class to fetch all pages of a resource where pagination is
 * represented by an optional maximum id that delimits what is returned in each
 * request.
 * @private
 */
class MaxIdHandler {
  /**
   * Create a MaxIdHandler that fetches partial results using `fetch`, which
   * must be a function that takes an optional maximum id and returns a Promise
   * that resolves to an array. `resolveId` must be a function that takes an
   * element of the result array and returns its corresponding id.
   *
   * If known, `resultLength` can be provided to make it easier to detect when
   * the end of results has been detected.
   *
   * @param fetch {Function} Return a page of results as Promised array; takes
   *    an maximum id that all results must be less than, or no id to return
   *    the latest results.
   * @param resolveId {Function} Return the id of an element from the results
   * @param resultLength {Number} Maximum number of elements in a result, if
   *    a response has fewer than this then continued fetching is ended
   */
  constructor(fetch, resolveId, resultLength = 0) {
    this._fetch = fetch;
    this._resolveId = resolveId;
    this._resultLength = resultLength;
  }

  /**
   * Load all pages for the wrapped resource by repeatedly calling the
   * `fetch` function provided to the handler at creation time. The `resolveId`
   * function is used to extract the id from the last element in the results,
   * which becomes the max id to the next fetch call. This continues until
   * the result is empty or less than the configured max elements per fetch.
   *
   * @return Promise The promise resolving to an array representing the entire
   *     sequence of data
   */
  getAll() {
    let _get = function(maxId) {
      return this._fetch(maxId).then(result => {
        if (result.length == 0 || result.length < this._resultLength) {
          // End of the data so just return it
          return result;
        } else {
          // Iterate and fetch again based on the id at the end of the result
          // (assuming that ids are sorted appropriately in the result).
          let nextMaxId = this._resolveId(result[result.length - 1]);
          return _get(nextMaxId).then(nextResult => {
            // Note: this shouldn't require de-duplication because pagination
            // is based off of ids, and so each call should return mutually
            // exclusive sets.
            return result.concat(nextResult);
          });
        }
      })
    };

    return _get();
  }
}

module.exports = [PageHandler, MaxIdHandler];