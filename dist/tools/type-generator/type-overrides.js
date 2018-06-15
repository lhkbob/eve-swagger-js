"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const fs_1 = require("fs");
const namespaces = loadNamespaceOverrides();
// Title refers to a route id, name is a valid namespace path
exports.ROUTE_NAMESPACE_OVERRIDES = namespaces.explicit.routes;
// Title refers to the generated title for a type, name is the overridden
// namespace path
exports.TYPE_NAMESPACE_OVERRIDES = namespaces.explicit.types;
// Full namespaces that should be collapsed into their parent, these
// are spaces that can be consolidated logically but don't match the present
// set of heuristics for automatic collapse.
exports.COLLAPSE_NAMESPACE = namespaces.collapse;
// Title refers to the generated title for a type, name is the new name
exports.TYPENAME_OVERRIDES = loadTypeNameOverrides();
// Reads ./overrides/namespaces.json
function loadNamespaceOverrides() {
    let json = fs_1.readFileSync(getPathTo('namespaces.json'), 'utf8');
    return JSON.parse(json);
}
// Reads ./overrides/types.json
function loadTypeNameOverrides() {
    let json = fs_1.readFileSync(getPathTo('types.json'), 'utf8');
    return JSON.parse(json);
}
// Whenever this script is run, it is from dist/util as compiled JS, but the
// JSON files aren't copied over, so extra directory levels must be stripped off
function getPathTo(jsonFilename) {
    return path_1.join(__dirname, '../../../tools/type-generator/overrides', jsonFilename);
}
//# sourceMappingURL=type-overrides.js.map