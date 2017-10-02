"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Graphics} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Graphics API instance
 */
function makeGraphics(agent) {
    return function (id) {
        if (id === undefined) {
            return agent.request('get_universe_graphics', undefined);
        }
        else {
            return new GraphicImpl(agent, id);
        }
    };
}
exports.makeGraphics = makeGraphics;
class GraphicImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_graphics_graphic_id', { path: { graphic_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=graphics.js.map