/**
 * An asynchronous function that given a set array of ids, will make a request
 * and then return the values corresponding to the ids. The names are
 * represented by a generic type `T`, which must contain both the id and the
 * name for each element.
 */
export interface BatchRequest<T> {
  (ids: number[]): Promise<T[]>;
}

/**
 * A simple function for extracting the id and value from an object type
 * `T` that contains fields representing such information.
 */
export interface ValueResolver<T, V> {
  (element: T, originalID: number): [number, V];
}

/**
 * Look up the values for a set of ids. This function automatically splits the
 * ids into groups based on `batchSize`, and then passes these groups to the
 * actual lookup function, `requester`. The `resolver` function is used
 * to extract the id and value from the response element type `T`.
 *
 * @param ids The list of ids to resolve, which should not contain duplicates
 * @param requester The batch request function
 * @param resolver A function converting `T` into an `[id, value]` pair
 * @param batchSize The maximum number of ids that `requester` can handle
 * @returns A map from id to value
 */
export function getBatchedValues<T, V>(ids: number[],
    requester: BatchRequest<T>, resolver: ValueResolver<T, V>,
    batchSize: number): Promise<Map<number, V>> {
  return getIDMatchedValues(ids, requester, batchSize).then(array => {
    let map = new Map();
    for (let n of array) {
      let tuple = resolver(n.element, n.id);
      map.set(tuple[0], tuple[1]);
    }
    return map;
  });
}

/**
 * Look up the values corresponding to a stream of ids. This automatically
 * batches the ids into blocks of `batchSize`, and attempts to remove
 * duplicates. However, if the duplicate ids are farther apart than the batch
 * size, this is not possible. It does guarantee that requests will not fail due
 * to duplicates within the batches.
 *
 * This function is flexible, in that it takes a generic batch function to
 * resolve multiple ids at once, and a resolver that turns the response elements
 * into a standardized `[id, value]` pair. The common case of using the `POST
 * /universe/names/` route is handled with {@link getIteratedNames}.
 *
 * @param ids The stream of ids to resolve, ideally should not contain
 *     duplicates
 * @param requester The batch requesting function mapping from ids to value
 * @param resolver A function to convert the response type `T` into an id-value
 *     pair
 * @param batchSize The maximum number of ids that `requester` can handle at
 *     once
 * @returns An iterator resolving to a series of id, value pairs
 */
export async function* getIteratedValues<T, V>(ids: AsyncIterableIterator<number>,
    requester: BatchRequest<T>, resolver: ValueResolver<T, V>,
    batchSize: number): AsyncIterableIterator<[number, V]> {
  // Minimize the requests to the batch end point so collect ids into a set
  // up to batchSize before yielding those responses
  let idBatch = new Set();
  for await (let id of ids) {
    idBatch.add(id);
    if (idBatch.size >= batchSize) {
      // Time to process the batch
      let idArrays = Array.from(idBatch);

      let values = await requester(idArrays)
      .then(array => array.map((e, i) => resolver(e, idArrays[i])));
      idBatch.clear();
      yield* values;
    }
  }

  if (idBatch.size > 0) {
    // Process the remaining ids
    let idArrays = Array.from(idBatch);

    let values = await requester(idArrays)
    .then(array => array.map((e, i) => resolver(e, idArrays[i])));

    idBatch.clear();
    yield* values;
  }
}

/**
 * Invoke the batch requester over the provided list of ids, after splitting
 * the ids into batches based on `batchSize`. The results of all batches are
 * waited on and then combined into a single array.
 *
 * @param ids The ids to look up, should not contain duplicates
 * @param requester The bulk request function
 * @param batchSize The maximum number of ids that `requester` can handle
 * @returns The combined response array of values
 */
export function getRawValues<T>(ids: number[], requester: BatchRequest<T>,
    batchSize: number): Promise<T[]> {
  return getIDMatchedValues(ids, requester, batchSize)
  .then(pairs => pairs.map(e => e.element));
}

function getIDMatchedValues<T>(ids: number[], requester: BatchRequest<T>,
    batchSize: number): Promise<{ element: T, id: number }[]> {
  let groups = splitIds(ids, batchSize);
  return Promise.all(groups.map(idSet => requester(idSet)
  .then(valueSet => valueSet.map((e, i) => ({ element: e, id: idSet[i] })))))
  .then(valueSets => {
    // Join each into a single array
    let combined = [];
    for (let valueSet of valueSets) {
      combined.push(...valueSet);
    }
    return combined;
  });
}

function splitIds(ids: number[], batchSize: number): number[][] {
  let groups = [];

  for (let i = 0; i < ids.length; i += batchSize) {
    let end = i + batchSize;
    if (end > ids.length) {
      end = ids.length;
    }
    groups.push(ids.slice(i, end));
  }

  return groups;
}
