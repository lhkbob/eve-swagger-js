"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single fitting,
 * specified by a provided fitting id when the api is instantiated.
 */
class Fitting extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_fittings
     *
     * @returns Details about the specific fitting
     */
    details() {
        return getFittings(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, e => e.fitting_id));
    }
    /**
     * Delete the specific fitting for the character.
     *
     * @esi_route delete_characters_character_id_fittings
     *
     * @returns An empty promise that resolves after the fitting has been deleted
     */
    del() {
        return deleteFitting(this.agent, this.id_);
    }
}
exports.Fitting = Fitting;
/**
 * An api adapter for accessing various details of multiple fitting ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedFittings extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_characters_character_id_fittings
     *
     * @returns The fitting details, mapped by id
     */
    details() {
        return this.arrayIDs()
            .then(ids => getFittings(this.agent)
            .then(all => r.impl.filterArrayToMap(all, ids, e => e.fitting_id)));
    }
    /**
     * Delete the specific fittings for the character.
     *
     * @esi_route delete_characters_character_id_fittings
     *
     * @returns An empty promise that resolves after the fittings have been
     *     deleted
     */
    del() {
        // Discard the map from id to undefined after they have completed
        return this.getResource(id => deleteFitting(this.agent, id))
            .then(map => undefined);
    }
}
exports.MappedFittings = MappedFittings;
/**
 * An api adapter for accessing various details about every fitting registered
 * to the character.
 */
class IteratedFittings extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => getFittings(agent)), e => e.fitting_id);
        this.agent = agent;
    }
    /**
     * @returns The fitting details for every fitting of the character
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedFittings = IteratedFittings;
/**
 * Create a new {@link Fittings} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The character access information
 * @returns An Fittings API instance
 */
function makeFittings(agent) {
    let fittings = function (ids) {
        if (ids === undefined) {
            // All fittings
            return new IteratedFittings(agent);
        }
        else if (typeof ids === 'number') {
            // Single fitting
            return new Fitting(agent, ids);
        }
        else {
            // Multiple fittings
            return new MappedFittings(agent, ids);
        }
    };
    fittings.add = function (fitting) {
        return agent.agent.request('post_characters_character_id_fittings', { path: { character_id: agent.id }, body: fitting }, agent.ssoToken)
            .then(newID => newID.fitting_id);
    };
    return fittings;
}
exports.makeFittings = makeFittings;
function getFittings(agent) {
    return agent.agent.request('get_characters_character_id_fittings', { path: { character_id: agent.id } }, agent.ssoToken);
}
function deleteFitting(agent, fitting) {
    return agent.agent.request('delete_characters_character_id_fittings_fitting_id', { path: { character_id: agent.id, fitting_id: fitting } });
}
//# sourceMappingURL=fittings.js.map