"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const search_1 = require("../../internal/search");
const names_1 = require("../../internal/names");
/**
 * Create a new {@link Stations} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An Stations API instance
 */
function makeStations(agent) {
    let functor = function (id) {
        return new StationImpl(agent, id);
    };
    functor.search = search_1.makeDefaultSearch(agent, "station" /* STATION */);
    functor.names = function (ids) {
        return names_1.getNames(agent, "station" /* STATION */, ids);
    };
    return functor;
}
exports.makeStations = makeStations;
class StationImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_universe_stations_station_id', { path: { station_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
//# sourceMappingURL=stations.js.map