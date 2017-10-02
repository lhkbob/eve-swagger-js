"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
/**
 * Create a new {@link SolarSystems} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An SolarSystems API instance
 */
function makeSolarSystems(agent) {
    let functor = function (id) {
        if (id === undefined) {
            return agent.request('get_universe_systems', undefined);
        }
        else {
            return new SolarSystemImpl(agent, id);
        }
    };
    functor.search = search_1.makeDefaultSearch(agent, "solarsystem" /* SOLARSYSTEM */);
    functor.jumpStats = function () {
        return agent.request('get_universe_system_jumps', undefined);
    };
    functor.killStats = function () {
        return agent.request('get_universe_system_kills', undefined);
    };
    functor.names = function (ids) {
        if (ids === undefined) {
            return functor().then(allIds => functor.names(allIds));
        }
        else {
            return names_1.getNames(agent, "solar_system" /* SOLAR_SYSTEM */, ids);
        }
    };
    return functor;
}
exports.makeSolarSystems = makeSolarSystems;
class SolarSystemImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_systems_system_id', { path: { system_id: this.id_ } });
    }
    getRoute(type, to, avoid, connections) {
        // Build up multi level connections array
        let pairedConnections;
        if (connections !== undefined) {
            pairedConnections = [];
            for (let i = 0; i < connections.length - 1; i++) {
                pairedConnections.push([connections[i], connections[i + 1]]);
            }
        }
        return this.agent.request('get_route_origin_destination', {
            path: { origin: this.id_, destination: to }, query: {
                flag: type, avoid: avoid, connections: pairedConnections
            }
        });
    }
    shortestRoute(to, avoid, connections) {
        return this.getRoute('shortest', to, avoid, connections);
    }
    secureRoute(to, avoid, connections) {
        return this.getRoute('secure', to, avoid, connections);
    }
    insecureRoute(to, avoid, connections) {
        return this.getRoute('insecure', to, avoid, connections);
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=solar-systems.js.map