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
 * Look up the names of a set of ids, restricted to a particular name category.
 * This utility function automatically splits large arrays of ids into lists of
 * 500 elements and then recombines the results. It also maps the response data
 * from the internal ESI representation into a more useful Map from id to name.
 *
 * @param agent The agent making requests
 * @param category The category of names to look up
 * @param ids The list of ids to resolve, should not contain duplicates
 * @returns Promise resolving to a Map from id to name
 */
function getNames(agent, category, ids) {
    return _getNames(agent, category, ids).then(array => {
        let map = new Map();
        for (let n of array) {
            map.set(n.id, n.name);
        }
        return map;
    });
}
exports.getNames = getNames;
/**
 * Look up the names corresponding to a stream of ids. This automatically
 * batches the names and attempts to remove duplicates, although if they are
 * sufficiently far apart in the stream an id could show up in the output stream
 * agian. The guarantee is that requests will not fail due to duplicates in the
 * batches.
 *
 * @param agent The agent making requests
 * @param category The category of names to look up
 * @param ids The list of ids to resolve, ideally should not contain duplicates
 * @returns Iterator resolving to a series of tuples pairing id to name
 */
function getIteratedNames(agent, category, ids) {
    return __asyncGenerator(this, arguments, function* getIteratedNames_1() {
        // Minimize the requests to post_universe_names so collect ids into a set
        // up to 500 before yielding those responses
        let idBatch = new Set();
        try {
            for (var ids_1 = __asyncValues(ids), ids_1_1; ids_1_1 = yield __await(ids_1.next()), !ids_1_1.done;) {
                let id = yield __await(ids_1_1.value);
                idBatch.add(id);
                if (idBatch.size >= 500) {
                    // Time to process the batch
                    let names = yield __await(getFilteredNames(agent, Array.from(idBatch), category).then(transformNamesToTuples));
                    idBatch.clear();
                    yield __await(yield* __asyncDelegator(__asyncValues(names)));
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
            let names = yield __await(getFilteredNames(agent, Array.from(idBatch), category).then(transformNamesToTuples));
            idBatch.clear();
            yield __await(yield* __asyncDelegator(__asyncValues(names)));
        }
        var e_1, _a;
    });
}
exports.getIteratedNames = getIteratedNames;
/**
 * Look up the names of a set of ids, which can be from any of the categories.
 * Because the response can have ids from multiple categories, it is returned
 * without simplifying into the Map type. Like {@link getNames} it automatically
 * splits large arrays into multiple requests.
 *
 * @param agent The agent making requests
 * @param ids The names to resolve, from any category, but should not contain
 *  duplicates
 * @returns Promise resolving to an array of esi.universe.Name instances
 */
function getAllNames(agent, ids) {
    return _getNames(agent, 'all', ids);
}
exports.getAllNames = getAllNames;
function transformNamesToTuples(array) {
    return array.map(name => [name.id, name.name]);
}
function splitIds(ids) {
    let groups = [];
    for (let i = 0; i < ids.length; i += 500) {
        let end = i + 500;
        if (end > ids.length) {
            end = ids.length;
        }
        groups.push(ids.slice(i, end));
    }
    return groups;
}
function getFilteredNames(agent, ids, category) {
    return agent.request('post_universe_names', { body: ids })
        .then(result => {
        if (category !== 'all') {
            return result.filter(r => r.category === category);
        }
        else {
            return result;
        }
    });
}
function _getNames(agent, category, ids) {
    let groups = splitIds(ids);
    return Promise.all(groups.map(idSet => getFilteredNames(agent, idSet, category)))
        .then(nameSets => {
        // Join each group of names into a single array
        let combined = [];
        for (let set of nameSets) {
            combined.push(...set);
        }
        return combined;
    });
}
//# sourceMappingURL=names.js.map