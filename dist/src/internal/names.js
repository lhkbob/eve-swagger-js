"use strict";
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