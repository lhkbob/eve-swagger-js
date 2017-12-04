"use strict";
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
var __asyncGenerator = (this && this.__asyncGenerator) || function (thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q = [];
    return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
    function verb(n) { if (g[n]) i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
    function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
    function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r);  }
    function fulfill(value) { resume("next", value); }
    function reject(value) { resume("throw", value); }
    function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
};
Object.defineProperty(exports, "__esModule", { value: true });
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
function getBatchedValues(ids, requester, resolver, batchSize) {
    return getIDMatchedValues(ids, requester, batchSize).then(array => {
        let map = new Map();
        for (let n of array) {
            let tuple = resolver(n.element, n.id);
            map.set(tuple[0], tuple[1]);
        }
        return map;
    });
}
exports.getBatchedValues = getBatchedValues;
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
function getIteratedValues(ids, requester, resolver, batchSize) {
    return __asyncGenerator(this, arguments, function* getIteratedValues_1() {
        // Minimize the requests to the batch end point so collect ids into a set
        // up to batchSize before yielding those responses
        let idBatch = new Set();
        try {
            for (var ids_1 = __asyncValues(ids), ids_1_1; ids_1_1 = yield __await(ids_1.next()), !ids_1_1.done;) {
                let id = yield __await(ids_1_1.value);
                idBatch.add(id);
                if (idBatch.size >= batchSize) {
                    // Time to process the batch
                    let idArrays = Array.from(idBatch);
                    let values = yield __await(requester(idArrays)
                        .then(array => array.map((e, i) => resolver(e, idArrays[i]))));
                    idBatch.clear();
                    yield __await(yield* __asyncDelegator(__asyncValues(values)));
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (ids_1_1 && !ids_1_1.done && (_a = ids_1.return)) yield __await(_a.call(ids_1));
            }
            finally { if (e_1) throw e_1.error; }
        }
        if (idBatch.size > 0) {
            // Process the remaining ids
            let idArrays = Array.from(idBatch);
            let values = yield __await(requester(idArrays)
                .then(array => array.map((e, i) => resolver(e, idArrays[i]))));
            idBatch.clear();
            yield __await(yield* __asyncDelegator(__asyncValues(values)));
        }
        var e_1, _a;
    });
}
exports.getIteratedValues = getIteratedValues;
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
function getRawValues(ids, requester, batchSize) {
    return getIDMatchedValues(ids, requester, batchSize)
        .then(pairs => pairs.map(e => e.element));
}
exports.getRawValues = getRawValues;
function getIDMatchedValues(ids, requester, batchSize) {
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
function splitIds(ids, batchSize) {
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
//# sourceMappingURL=batch.js.map