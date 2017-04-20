const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter that provides functions for accessing a particular dogma
 * attribute, specified by id via functions in the
 * [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Attribute {
  /**
   * Create a new Attribute identified as `attrId`.
   *
   * @param agent {ESIAgent} The ESI agent used to make web requests
   * @param attrId {Number} The attribute id used in all requests
   * @constructor
   */
  constructor(agent, attrId) {
    this._agent = agent;
    this._id = attrId;
  }

  /**
   * @esi_route get_dogma_attributes_attribute_id
   * @esi_example esi.dogma.attributes(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/dogma/attributes/{attribute_id}/',
        { path: { 'attribute_id': this._id } });
  }
}

/**
 * An api adapter over the end points handling multiple dogma attributes via
 * functions in the [dogma](https://esi.tech.ccp.is/latest/#/Dogma)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Attributes` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Attributes#get get} or {@link Attributes#all
 * all} depending on if an id is provided.
 */
class Attributes extends CallableInstance {
  /**
   * Create a new Attributes function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => id ? this.get(id) : this.all());
    this._agent = agent;
  }

  /**
   * Create a new Attribute end point targeting the particular attribute by
   * `id`.
   *
   * @param id {Number} The attribute id
   * @returns {Attribute}
   */
  get(id) {
    return new Attribute(this._agent, id);
  }

  /**
   * @esi_route get_dogma_attributes
   * @esi_example esi.dogma.attributes()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/dogma/attributes/');
  }
}

/**
 * An api adapter that provides functions for accessing a particular dogma
 * effect, specified by id via functions in the
 * [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI endpoints.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class Effect {
  /**
   * Create a new Effect identified as `effectId`.
   *
   * @param agent {ESIAgent} The ESI agent used to make web requests
   * @param effectId {Number} The effect id used in all requests
   * @constructor
   */
  constructor(agent, effectId) {
    this._agent = agent;
    this._id = effectId;
  }

  /**
   * @esi_route get_dogma_effects_effect_id
   * @esi_example esi.dogma.effects(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/dogma/effects/{effect_id}/',
        { path: { 'effect_id': this._id } });
  }
}

/**
 * An api adapter over the end points handling multiple dogma effects via
 * functions in the [dogma](https://esi.tech.ccp.is/latest/#/Dogma)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Effects` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Effects#get get} or {@link Effects#all
 * all} depending on if an id is provided.
 */
class Effects extends CallableInstance {
  /**
   * Create a new Effects function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => id ? this.get(id) : this.all());
    this._agent = agent;
  }

  /**
   * Create a new Effect end point targeting the particular effect by `id`.
   *
   * @param id {Number} The effect id
   * @returns {Effect}
   */
  get(id) {
    return new Effect(this._agent, id);
  }

  /**
   * @esi_route get_dogma_effects
   * @esi_example esi.dogma.effects()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/dogma/effects/');
  }
}

/**
 * An api adapter over the end points accessing dogma effects and attributes via
 * functions in the [dogma](https://esi.tech.ccp.is/latest/#/Dogma) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Dogma {
  /**
   * Create a new Dogma end point using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    this._agent = agent;
    this._attrs = null;
    this._effects = null;
  }

  /**
   * An instance of Attributes for all dogma attributes.
   *
   * @type {Attributes}
   */
  get attributes() {
    if (!this._attrs) {
      this._attrs = new Attributes(this._agent);
    }
    return this._attrs;
  }

  /**
   * An instance of Effects for all dogma effects.
   *
   * @type {Effects}
   */
  get effects() {
    if (!this._effects) {
      this._effects = new Effects(this._agent);
    }
    return this._effects;
  }
}

module.exports = Dogma;
