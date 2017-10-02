"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function makePlanets(agent) {
    return function (id) {
        return new PlanetImpl(agent, id);
    };
}
exports.makePlanets = makePlanets;
class PlanetImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_planets_planet_id', { path: { planet_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=planets.js.map