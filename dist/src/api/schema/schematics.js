"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single PI schematic,
 * specified by a provided id when the api is instantiated.
 */
class Schematic extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the schematic
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
}
exports.Schematic = Schematic;
/**
 * An api adapter for accessing various details of multiple schematic ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedSchematics extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Schematic details mapped by schematic id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedSchematics = MappedSchematics;
/**
 * Create a new Schematics instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Schematics instance
 */
function makeSchematics(agent) {
    return function (ids) {
        if (typeof ids === 'number') {
            // Single id so single API
            return new Schematic(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedSchematics(agent, ids);
        }
    };
}
exports.makeSchematics = makeSchematics;
function getDetails(agent, id) {
    return agent.request('get_universe_schematics_schematic_id', { path: { schematic_id: id } });
}
//# sourceMappingURL=schematics.js.map