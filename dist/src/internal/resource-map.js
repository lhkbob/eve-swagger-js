"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getResourcesAsMap(ids, loader) {
    return getResourcesAsArray(ids, loader).then(arrayMap => {
        let map = new Map();
        for (let e of arrayMap) {
            map.set(e[0], e[1]);
        }
        return map;
    });
}
exports.getResourcesAsMap = getResourcesAsMap;
function getResourcesAsArray(ids, loader) {
    let elements = [];
    for (let id of ids) {
        elements.push(loader(id).then(result => [id, result]));
    }
    return Promise.all(elements);
}
exports.getResourcesAsArray = getResourcesAsArray;
//# sourceMappingURL=resource-map.js.map