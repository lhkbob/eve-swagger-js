"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
/**
 * An api adapter for accessing various details of a single dogma attribute,
 * specified by a provided id when the api is instantiated.
 */
class Attribute extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the dogma attribute
     */
    details() {
        return getAttribute(this.agent, this.id_);
    }
}
exports.Attribute = Attribute;
/**
 * An api adapter for accessing various details of multiple dogma attributes,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedAttributes extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Attribute details mapped by group id
     */
    details() {
        return this.getResource(id => getAttribute(this.agent, id));
    }
}
exports.MappedAttributes = MappedAttributes;
/**
 * An api adapter for accessing various details about every dogma attribute in
 * the game. Even though a route exists to get all attribute ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedAttributes extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_dogma_attributes', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all dogma attributes
     */
    details() {
        return this.getResource(id => getAttribute(this.agent, id));
    }
}
exports.IteratedAttributes = IteratedAttributes;
/**
 * An api adapter for accessing various details of a single dogma effect,
 * specified by a provided id when the api is instantiated.
 */
class Effect extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @returns Information about the dogma attribute
     */
    details() {
        return getEffect(this.agent, this.id_);
    }
}
exports.Effect = Effect;
/**
 * An api adapter for accessing various details of multiple dogma effects,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedEffects extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @returns Attribute details mapped by group id
     */
    details() {
        return this.getResource(id => getEffect(this.agent, id));
    }
}
exports.MappedEffects = MappedEffects;
/**
 * An api adapter for accessing various details about every dogma effect in
 * the game. Even though a route exists to get all effect ids at once, due to
 * their quantity, the API provides asynchronous iterators for the rest of their
 * details.
 */
class IteratedEffects extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_dogma_effects', undefined)), id => id);
        this.agent = agent;
    }
    /**
     * @returns Iterator over details of all dogma effects
     */
    details() {
        return this.getResource(id => getEffect(this.agent, id));
    }
}
exports.IteratedEffects = IteratedEffects;
/**
 * A simple wrapper around functional interfaces for getting APIs for dogma
 * attributes and effects, both of which utilize the
 * [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI end points.
 */
class Dogma {
    constructor(agent) {
        this.agent = agent;
    }
    get attributes() {
        if (this.attributes_ === undefined) {
            this.attributes_ = getAttributes.bind(this, this.agent);
        }
        return this.attributes_;
    }
    get effects() {
        if (this.effects_ === undefined) {
            this.effects_ = getEffects.bind(this, this.agent);
        }
        return this.effects_;
    }
}
exports.Dogma = Dogma;
function getAttributes(agent, ids) {
    if (ids === undefined) {
        // No ids so all groups
        return new IteratedAttributes(agent);
    }
    else if (typeof ids === 'number') {
        // Single id for a group
        return new Attribute(agent, ids);
    }
    else {
        // Mapped groups
        return new MappedAttributes(agent, ids);
    }
}
function getEffects(agent, ids) {
    if (ids === undefined) {
        // No ids so all tasks
        return new IteratedEffects(agent);
    }
    else if (typeof ids === 'number') {
        // Single id for a task
        return new Effect(agent, ids);
    }
    else {
        // Mapped tasks
        return new MappedEffects(agent, ids);
    }
}
function getAttribute(agent, id) {
    return agent.request('get_dogma_attributes_attribute_id', { path: { attribute_id: id } });
}
function getEffect(agent, id) {
    return agent.request('get_dogma_effects_effect_id', { path: { effect_id: id } });
}
//# sourceMappingURL=dogma.js.map