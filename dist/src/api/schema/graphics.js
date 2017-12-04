"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single in-game graphic,
 * specified by a provided id when the api is instantiated.
 */
class Graphic extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the graphic
     */
    details() {
        return getDetails(this.agent, this.id_);
    }
}
exports.Graphic = Graphic;
/**
 * An api adapter for accessing various details of multiple graphic ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedGraphics extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Graphic details mapped by graphic id
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.MappedGraphics = MappedGraphics;
/**
 * An api adapter for accessing various details about every graphic in
 * the game. Even though a route exists to get all graphic ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedGraphics extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_universe_graphics', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all in-game graphics
     */
    details() {
        return this.getResource(id => getDetails(this.agent, id));
    }
}
exports.IteratedGraphics = IteratedGraphics;
/**
 * Create a new Graphics instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Graphics instance
 */
function makeGraphics(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All graphics since no id
            return new IteratedGraphics(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Graphic(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedGraphics(agent, ids);
        }
    };
}
exports.makeGraphics = makeGraphics;
function getDetails(agent, id) {
    return agent.request('get_universe_graphics_graphic_id', { path: { graphic_id: id } });
}
//# sourceMappingURL=graphics.js.map