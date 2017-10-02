"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Create a new {@link Dogma} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Dogma API instance
 */
function makeDogma(agent) {
    let attributes = function (id) {
        if (id === undefined) {
            return agent.request('get_dogma_attributes', undefined);
        }
        else {
            return new AttributeImpl(agent, id);
        }
    };
    let effects = function (id) {
        if (id === undefined) {
            return agent.request('get_dogma_effects', undefined);
        }
        else {
            return new EffectImpl(agent, id);
        }
    };
    return { attributes, effects };
}
exports.makeDogma = makeDogma;
class AttributeImpl {
    constructor(agent, id) {
        this.agent = agent;
        this.id = id;
    }
    info() {
        return this.agent.request('get_dogma_attributes_attribute_id', { path: { attribute_id: this.id } });
    }
}
class EffectImpl {
    constructor(agent, id) {
        this.agent = agent;
        this.id = id;
    }
    info() {
        return this.agent.request('get_dogma_effects_effect_id', { path: { effect_id: this.id } });
    }
}
//# sourceMappingURL=dogma.js.map