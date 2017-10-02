"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const type_overrides_1 = require("./type-overrides");
const pluralize = require('pluralize'); // No typings associated
class Namespace {
    constructor(name, parent) {
        this.name = name;
        this.members = [];
        this.log = [];
        this.children_ = new Map();
        if (parent) {
            parent.children_.set(name, this);
            this.parent_ = parent;
        }
    }
    get declarationCount() {
        let count = 0;
        for (let m of this.members) {
            if (m.hasDeclaration) {
                count++;
            }
        }
        return count;
    }
    get parent() {
        return this.parent_;
    }
    get children() {
        let children = Array.from(this.children_.values());
        children.sort((a, b) => a.name.localeCompare(b.name));
        return children;
    }
    get fullName() {
        let node = this;
        let path = [];
        while (node) {
            if (node.name !== '') {
                path.splice(0, 0, node.name);
            }
            node = node.parent;
        }
        return path.join('.');
    }
    get depth() {
        if (this.parent_) {
            return this.parent_.depth + 1;
        }
        else {
            return 0;
        }
    }
    get childCount() {
        return this.children_.size;
    }
    get leaf() {
        return this.children_.size == 0;
    }
    child(name) {
        return this.children_.get(name);
    }
    sortMembers() {
        this.members.sort((a, b) => a.typeName.localeCompare(b.typeName));
    }
    ensure(name) {
        let lowerName = name.toLowerCase();
        let child = this.child(lowerName);
        if (!child) {
            child = new Namespace(lowerName, this);
        }
        return child;
    }
    join(other) {
        if (other === this) {
            return this;
        }
        let n1 = this;
        while (n1) {
            let n2 = other;
            while (n2) {
                if (n1 === n2) {
                    // Found a match that was as deep as possible
                    return n1;
                }
                else {
                    // Move up other's path
                    n2 = n2.parent;
                }
            }
            // No match at current node in this space, so move up this path
            n1 = n1.parent;
        }
        // No match at all so return the empty namespace
        return Namespace.root;
    }
    /**
     * Child namespaces with fewer than minTypes will be collapsed into parent. If
     * all child (and descendent) namespaces have fewer than minSiblings sibling
     * namespaces then they will be collapsed into this node. This filter is
     * checked after other child namespaces may have been collapsed due to
     * minTypes. Both filters are applied after each child has reduced its own
     * children.
     *
     * @param minTypes
     * @param minSiblings
     */
    reduce(minTypes = 3, minSiblings = 1) {
        // First reduce all children of this namespace
        for (let c of this.children) {
            c.reduce(minTypes, minSiblings);
        }
        // Now do minTypes filter (iterating over local copy of names because
        // the collection is being modified potentially)
        for (let name of Array.from(this.children_.keys())) {
            let c = this.child(name);
            let decCountCheck = c.declarationCount < minTypes;
            let explicitCheck = type_overrides_1.COLLAPSE_NAMESPACE.indexOf(c.fullName) >= 0;
            if (decCountCheck || explicitCheck) {
                // Move members into this node and detach child
                this.members.push(...c.members);
                this.children_.delete(name);
                c.parent_ = undefined;
                this.log.push(...c.log);
                this.log.push(`Collapsed ${name} into ${this.fullName} (failed declaration limit = ${decCountCheck}, explicit = ${explicitCheck})`);
            }
        }
        // Now do the sibling filter, which is equivalent to if the number of
        // child nodes is <= minSiblings AND each child has no children of their
        // own (since they were already reduced, if they failed the minSibling
        // check, their children would have been removed already).
        if (this.declarationCount < minTypes && this.children_.size
            <= minSiblings) {
            for (let c of this.children) {
                if (c.children_.size > 0) {
                    // Must keep the child structure around for this node
                    return;
                }
            }
            if (this.children_.size > 0) {
                // All siblings can be collapsed
                for (let c of this.children) {
                    this.members.push(...c.members);
                    this.log.push(...c.log);
                    c.parent_ = undefined;
                }
                this.log.push(`Collapsed all children into ${this.fullName} due to sibling limit.`);
                this.children_.clear();
            }
        }
    }
    static parse(namespace) {
        let parts = namespace.split('.');
        let space = Namespace.root;
        for (let i = 0; i < parts.length; i++) {
            space = space.ensure(parts[i]);
        }
        return space;
    }
    static forRoute(route) {
        // First look for an override
        if (type_overrides_1.NAMESPACE_OVERRIDES[route.id]) {
            return [Namespace.parse(type_overrides_1.NAMESPACE_OVERRIDES[route.id]), true];
        }
        // Else start at ESI and proceed
        let root = Namespace.parse('esi');
        let tagName = pluralize.singular(route.tag.replace(/\s/g, ''));
        if (tagName != 'Character' && route.id.indexOf('character_id') >= 0) {
            // Insert extra character namespace into it
            root = root.ensure('character');
        }
        if (tagName != 'Corporation' && route.id.indexOf('corporation_id') >= 0) {
            // Same but for corporation
            root = root.ensure('corporation');
        }
        let tag = root.ensure(tagName);
        // To keep the result namespace short, the entirety of the routeID is not
        // used. It is assumed that the namespace for the tag helps to make it
        // unique. Then the following rules are used:
        // 1. Discard http method for the namespacing
        // 2. If it ends in _id, then the _ delimited section before that is the
        //    rest of the name.
        // 3. Otherwise the last _ delimited section is used as the name.
        let routeID = route.id;
        let name;
        if (routeID.endsWith('_id')) {
            let nEnd = routeID.length - 3;
            let nStart = routeID.lastIndexOf('_', nEnd - 1);
            name = routeID.substring(nStart + 1, nEnd);
        }
        else {
            let nStart = routeID.lastIndexOf('_');
            name = routeID.substring(nStart + 1, routeID.length);
        }
        name = pluralize.singular(propertyNameToTypeName(name));
        if (name !== tagName) {
            return [tag.ensure(name), false];
        }
        else {
            return [tag, false];
        }
    }
    // Place each type into a namespace
    static assign(spec, root) {
        let routesUsingType = collectRoutes(spec, root);
        let routeNamespaces = getRouteNamespaces(spec);
        for (let type of routesUsingType.keys()) {
            let routes = routesUsingType.get(type);
            let finalNamespace;
            if (type.hasDeclaration) {
                for (let route of routes) {
                    let namespace = routeNamespaces.get(route);
                    if (namespace) {
                        if (finalNamespace) {
                            if (namespace[1]) {
                                // An explicit namespace, so make sure it is not masking another
                                // explicit namespace that was merged into the type
                                if (finalNamespace[1] && finalNamespace[0] !== namespace[0]) {
                                    // Previous explicit namespace from another route is different
                                    console.error(route + '\'s override to ' + namespace[0].fullName
                                        + ' would shadow explicit name of '
                                        + finalNamespace[0].fullName);
                                    console.error('Triggered by type:', type);
                                    finalNamespace = [finalNamespace[0].join(namespace[0]), true];
                                }
                                // Else the previous namespace was identical or not explicit
                                // so just take this one
                                finalNamespace = namespace;
                            }
                            else if (!finalNamespace[1]) {
                                // Neither namespaces are explicit, so join them together
                                finalNamespace = [finalNamespace[0].join(namespace[0]), false];
                            }
                            // Else preserve older explicit namespace
                        }
                        else {
                            // First valid namespace
                            finalNamespace = namespace;
                        }
                    }
                }
            }
            if (!finalNamespace) {
                finalNamespace = [Namespace.root, false];
            }
            // Add type to the namespace's members
            finalNamespace[0].members.push(type);
        }
    }
}
Namespace.root = new Namespace('');
exports.Namespace = Namespace;
function propertyNameToTypeName(propertyName) {
    let prevWasUnderscore = true; // True to force capital at start of name
    let typeName = '';
    for (let i = 0; i < propertyName.length; i++) {
        let currentChar = propertyName[i];
        if (currentChar === '_' || currentChar === '-') {
            // Must capitalize next letter and discard the _ symbol
            prevWasUnderscore = true;
        }
        else {
            typeName += prevWasUnderscore ? currentChar.toUpperCase() : currentChar;
            prevWasUnderscore = false;
        }
    }
    return typeName;
}
function collectRoutes(spec, root) {
    return root.collect((path, prior) => {
        // Determine route based on path; first node is the root, second node is
        // the route aggregator (encoded by its key).
        if (path.length <= 1) {
            return ['root'];
        }
        let routeID = path[1].key;
        if (path[1].node.type !== 'route' || !spec.route(routeID)) {
            // Skip this path, if the path eventually reaches another type
            if (path.length > 2) {
                return prior || [];
            }
            else {
                // The path ends on a non-route type that should be grouped with the
                // root
                return ['root'];
            }
        }
        if (prior) {
            // Include new route in the list if it's not already there
            if (prior.indexOf(routeID) < 0) {
                return prior.concat(routeID);
            }
            else {
                return prior;
            }
        }
        else {
            // Initialize with just this route
            return [routeID];
        }
    });
}
// Generate the names for all route ids in the specification
function getRouteNamespaces(spec) {
    let names = new Map();
    for (let id of spec.routeIDs) {
        let [namespace, explicit] = Namespace.forRoute(spec.route(id));
        namespace.log.push(`Route ${id} maps to ${namespace.fullName} (explicit = ${explicit})`);
        names.set(id, [namespace, explicit]);
    }
    return names;
}
//# sourceMappingURL=namespace.js.map