const Search = require('../search');

const CallableInstance = require('../../internal/callable-instance');

/**
 * An api adapter that provides functions for accessing various details for a
 * graphic specified by id, via functions in the
 * [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Graphic {
  /**
   * Create a new Graphic for the given `agent` provider and specific
   * `graphicId`.
   *
   * @param agent {ESIAgent} The ESI agent used to generate web requests
   * @param graphicId {Number} The graphic id that is used for all
   *     requests
   * @constructor
   */
  constructor(agent, graphicId) {
    this._agent = agent;
    this._id = graphicId;
  }

  /**
   * @esi_route get_universe_graphics_graphic_id
   * @esi_example esi.graphics(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v1/universe/graphics/{graphic_id}/',
        { path: { 'graphic_id': this._id } });
  }
}

/**
 * An api adapter that provides functions for accessing graphics information via
 * the [universe](https://esi.tech.ccp.is/latest/#/Universe) ESI end points. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 *
 * This is a function class so instances of `Graphics` are functions and
 * can be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Graphics#all all} or {@link Graphics#get get}
 * if an id is provided.
 */
class Graphics extends CallableInstance {
  /**
   * Create a new Graphics instance using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super(id => id ? this.get(id) : this.all());
    this._agent = agent;
  }

  /**
   * @esi_route get_universe_graphics
   * @esi_example esi.graphics()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  all() {
    return this._agent.noAuth.get('/v1/universe/graphics/');
  }

  /**
   * Create a new Graphic end point targeting the particular moon
   * by `id`.
   *
   * @param id {Number} The moon id
   * @returns {Graphic}
   */
  get(id) {
    return new Graphic(this._agent, id);
  }
}

module.exports = Graphics;
