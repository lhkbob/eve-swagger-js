"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncIterator) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator];
    return m ? m.call(o) : typeof __values === "function" ? __values(o) : o[Symbol.iterator]();
};
var __await = (this && this.__await) || function (v) { return this instanceof __await ? (this.v = v, this) : new __await(v); }
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
var __asyncDelegator = (this && this.__asyncDelegator) || function (o) {
    var i, p;
    return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
    function verb(n, f) { if (o[n]) i[n] = function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; }; }
};
Object.defineProperty(exports, "__esModule", { value: true });
const error_1 = require("../error");
// Force loading of this library to make sure the types are available at runtime
require("./async-iterator");
require('./async-iterator');
/**
 * The `impl` namespace provides a number of abstract base classes for
 * implementing the single, mapped, and iterated resource variants.
 */
var impl;
(function (impl) {
    /**
     * A utility base class for SingleResource where the id is known ahead of
     * time.
     */
    class SimpleResource {
        /**
         * @param id_ The id that is always accessed
         */
        constructor(id_) {
            this.id_ = id_;
        }
        ids() {
            return Promise.resolve(this.id_);
        }
    }
    impl.SimpleResource = SimpleResource;
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
    function filterArray(resources, id, resolver) {
        for (let value of resources) {
            if (resolver(value) === id) {
                return value;
            }
        }
        throw new error_1.ESIError("esi:NotFoundError" /* NOT_FOUND_ERROR */, 'Could not find value for id: %d', id);
    }
    impl.filterArray = filterArray;
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
    function filterArrayToMap(resources, ids, resolver) {
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
                throw new error_1.ESIError("esi:NotFoundError" /* NOT_FOUND_ERROR */, 'Could not find value for id: %d', id);
            }
        }
        return map;
    }
    impl.filterArrayToMap = filterArrayToMap;
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
    function filterIterated(resources, id, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                for (var resources_1 = __asyncValues(resources), resources_1_1; resources_1_1 = yield resources_1.next(), !resources_1_1.done;) {
                    let e = yield resources_1_1.value;
                    if (resolver(e) === id) {
                        return e;
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (resources_1_1 && !resources_1_1.done && (_a = resources_1.return)) yield _a.call(resources_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            throw new error_1.ESIError("esi:NotFoundError" /* NOT_FOUND_ERROR */, 'Could not find value for id: %d', id);
            var e_1, _a;
        });
    }
    impl.filterIterated = filterIterated;
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
    function filterIteratedToMap(resources, ids, resolver) {
        return __awaiter(this, void 0, void 0, function* () {
            let map = new Map();
            try {
                // Unlike filterArrayToMap, iterate over the resources first since it can
                // only be iterated through once - must check presence of all ids afterwards
                for (var resources_2 = __asyncValues(resources), resources_2_1; resources_2_1 = yield resources_2.next(), !resources_2_1.done;) {
                    let e = yield resources_2_1.value;
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
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (resources_2_1 && !resources_2_1.done && (_a = resources_2.return)) yield _a.call(resources_2);
                }
                finally { if (e_2) throw e_2.error; }
            }
            // Ensure all ids are accounted for
            if (map.size !== ids.length) {
                // At least one is missing, throw exception with first missing id
                for (let id of ids) {
                    if (!map.has(id)) {
                        throw new error_1.ESIError("esi:NotFoundError" /* NOT_FOUND_ERROR */, 'Could not find value for id: %d', id);
                    }
                }
            }
            return map;
            var e_2, _a;
        });
    }
    impl.filterIteratedToMap = filterIteratedToMap;
    /**
     * A utility base class for a MappedResource where the ids are known ahead of
     * time or can be resolved by an asynchronous function that will return a
     * reasonably sized set of ids.
     */
    class SimpleMappedResource {
        /**
         * The `ids` can either be an array of ids, in which case all unique items
         * are removed; it can already be a `Set` of ids; and it can be a function
         * asynchronously resolving to an id set (represented as an array). It is
         * assumed for efficiency's sake that such a resolved id set does not have
         * duplicates in it.
         *
         * @param ids The set of ids that are mapped
         */
        constructor(ids) {
            if (ids instanceof Set) {
                // Unwrap the set into a simple array
                this.ids_ = Array.from(ids);
            }
            else if (Array.isArray(ids)) {
                // First convert the array into a set to remove duplicates
                this.ids_ = Array.from(new Set(ids));
            }
            else {
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
        arrayIDs() {
            if (Array.isArray(this.ids_)) {
                return Promise.resolve(this.ids_);
            }
            else {
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
        getResource(loader) {
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
        ids() {
            if (Array.isArray(this.ids_)) {
                return Promise.resolve(new Set(this.ids_));
            }
            else {
                return this.ids_().then(ids => new Set(ids));
            }
        }
    }
    impl.SimpleMappedResource = SimpleMappedResource;
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
    class SimpleIteratedResource {
        /**
         * @param streamer The function that provides streams of the paginated
         *     resource
         * @param idResolver The function that maps an element to its id
         */
        constructor(streamer, idResolver) {
            this.streamer = streamer;
            this.idResolver = idResolver;
        }
        /**
         * A helper function to automatically call the resource loader on each of
         * the ids returned.
         *
         * @param loader Function to get individual elements by id
         * @returns Asynchronous iterator over the resolved elements
         */
        getResource(loader) {
            return __asyncGenerator(this, arguments, function* getResource_1() {
                try {
                    for (var _a = __asyncValues(this.streamer()), _b; _b = yield __await(_a.next()), !_b.done;) {
                        let value = yield __await(_b.value);
                        let id = this.idResolver(value);
                        yield loader(id).then(e => [id, e]);
                    }
                }
                catch (e_3_1) { e_3 = { error: e_3_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                    }
                    finally { if (e_3) throw e_3.error; }
                }
                var e_3, _c;
            });
        }
        /**
         * A helper function to transform the paginated resource of type `T` into
         * an asynchronous iterator over identified tuples. This returned value is
         * suitable to be the returned value for an `Iterated<API>`.
         *
         * @returns An iterator over the paginated reosurce
         */
        getPaginatedResource() {
            return __asyncGenerator(this, arguments, function* getPaginatedResource_1() {
                try {
                    for (var _a = __asyncValues(this.streamer()), _b; _b = yield __await(_a.next()), !_b.done;) {
                        let value = yield __await(_b.value);
                        let id = this.idResolver(value);
                        yield [id, value];
                    }
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                var e_4, _c;
            });
        }
        ids() {
            return __asyncGenerator(this, arguments, function* ids_1() {
                try {
                    for (var _a = __asyncValues(this.streamer()), _b; _b = yield __await(_a.next()), !_b.done;) {
                        let value = yield __await(_b.value);
                        yield this.idResolver(value);
                    }
                }
                catch (e_5_1) { e_5 = { error: e_5_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) yield __await(_c.call(_a));
                    }
                    finally { if (e_5) throw e_5.error; }
                }
                var e_5, _c;
            });
        }
    }
    impl.SimpleIteratedResource = SimpleIteratedResource;
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
    function makePageBasedStreamer(pageLoader, maxPageSize) {
        return () => getPageBasedIterator(pageLoader, maxPageSize);
    }
    impl.makePageBasedStreamer = makePageBasedStreamer;
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
    function makeMaxIDStreamer(pageLoader, idResolver, maxPageSize) {
        return () => getMaxIDIterator(pageLoader, idResolver, maxPageSize);
    }
    impl.makeMaxIDStreamer = makeMaxIDStreamer;
    /**
     * A utility function that creates a ResourceStreamer based off of a function
     * that asynchronously provides a complete array of elements.
     *
     * @param arrayLoader The function which loads all elements at once
     * @returns A ResourceStreamer over the loaded array
     */
    function makeArrayStreamer(arrayLoader) {
        return () => getArrayIterator(arrayLoader);
    }
    impl.makeArrayStreamer = makeArrayStreamer;
    function getPageBasedIterator(pageLoader, maxPageSize) {
        return __asyncGenerator(this, arguments, function* getPageBasedIterator_1() {
            let page = 1;
            let maxPages = undefined;
            while (maxPages === undefined || page < maxPages) {
                let pageResults = yield __await(pageLoader(page));
                let elements;
                // Process the extracted maximum number of pages
                if (Array.isArray(pageResults)) {
                    // No maximum provided so use as elements directly
                    elements = pageResults;
                }
                else {
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
                yield __await(yield* __asyncDelegator(__asyncValues(elements)));
                // Determine stopping criteria in the event that max pages is known
                if (maxPageSize !== undefined && elements.length < maxPageSize) {
                    break;
                }
                // Move on to next page
                page++;
            }
        });
    }
    function getMaxIDIterator(pageLoader, idResolver, maxPageSize) {
        return __asyncGenerator(this, arguments, function* getMaxIDIterator_1() {
            let maxID = undefined;
            while (true) {
                let pageResults = yield __await(pageLoader(maxID));
                // Early exit for an empty page
                if (pageResults.length == 0) {
                    break;
                }
                // Yield all the elements
                yield __await(yield* __asyncDelegator(__asyncValues(pageResults)));
                // Stopping criteria if the max page size is known
                if (maxPageSize !== undefined && pageResults.length < maxPageSize) {
                    break;
                }
                // Advance to next id constraint
                maxID = idResolver(pageResults[pageResults.length - 1]);
            }
        });
    }
    function getArrayIterator(arrayLoader) {
        return __asyncGenerator(this, arguments, function* getArrayIterator_1() {
            let array = yield __await(arrayLoader());
            yield __await(yield* __asyncDelegator(__asyncValues(array)));
        });
    }
})(impl = exports.impl || (exports.impl = {}));
//# sourceMappingURL=resource-api.js.map