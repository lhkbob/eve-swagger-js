"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const esi = require("../esi-api");
/**
 * Generates the ESI data elements that go into the JSON blobs for displaying
 * the ESI doc accordion. It is not responsible for actually saving those files.
 */
// FIXME will need to be updated to actually build usages maps
function buildESIIndex() {
    let api = esi.API.getLocalAPI();
    // This organizes everything into tags first
    let tagMap = new Map();
    for (let routeID of api.routeIDs) {
        let route = api.route(routeID);
        let tagIndex = tagMap.get(route.tag);
        if (tagIndex === undefined) {
            tagIndex = { label: route.tag, children: [] };
            tagMap.set(route.tag, tagIndex);
        }
        // Add the route to the tag's children
        let data = {
            key: routeID,
            label: route.httpMethod + ' ' + route.path,
            tag: route.tag,
            apiURL: route.path,
            httpMethod: route.httpMethod,
            docURL: route.docURL,
            description: route.description,
            usages: []
        };
        let label = route.httpMethod.toUpperCase() + ' ' + route.path.substring(1 + route.version.length);
        tagIndex.children.push({ label, data });
    }
    return Array.from(tagMap.values());
}
exports.buildESIIndex = buildESIIndex;
//# sourceMappingURL=build-esi-index.js.map