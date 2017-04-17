const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling a specific squad in a character's
 * fleet via functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Squad {
  /**
   * Create a new Squad adaptor owned by the given `fleet` corresponding
   * to the given `squadId`.
   *
   * @param fleet {Fleet} The owning fleet
   * @param squadId {Number} The squad id of this instance
   * @constructor
   */
  constructor(fleet, squadId) {
    this._fleet = fleet;
    this._id = squadId;
  }

  /**
   * @esi_route put_fleets_fleet_id_squads_squad_id
   * @esi_param naming - {name}
   *
   * @param name {String}
   * @returns {Promise.<Object>}
   */
  rename(name) {
    return this._fleet._agent.auth(this._fleet._token)
    .put('/v1/fleets/{fleet_id}/squads/{squad_id}/', {
      path: {
        'fleet_id': this._fleet._id,
        'squad_id': this._id
      },
      body: { 'name': name }
    });
  }

  /**
   * @esi_route delete_fleets_fleet_id_squads_squad_id
   *
   * @returns {Promise.<Object>}
   */
  remove() {
    return this._fleet._agent.auth(this._fleet._token)
    .del('/v1/fleets/{fleet_id}/squads/{squad_id}/', {
      path: {
        'fleet_id': this._fleet._id,
        'squad_id': this._id
      }
    });
  }
}

/**
 * An api adapter over the end points handling the squads in a wing in the
 * character's fleet via functions in the
 * [fleets](https://esi.tech.ccp.is/latest/#/Fleets) ESI endpoints. You should
 * not usually instantiate this directly as its constructor requires an internal
 * api instance.
 *
 * This is a function class so instances of `Squads` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Squads#get get}.
 */
class Squads extends ExtendableFunction {
  /**
   * Create a new Squads function owned by the given `wing`.
   *
   * @param wing {Wing} The owning wing
   * @constructor
   */
  constructor(wing) {
    super(id => this.get(id));
    this._wing = wing;
  }

  /**
   * @esi_route post_fleets_fleet_id_wings_wing_id_squads
   * @esi_returns id:squad_id
   *
   * @returns {Promise.<Number>}
   */
  add() {
    return this._wing._fleet._agent.auth(this._wing._fleet._token)
    .post('/v1/fleets/{fleet_id}/wings/{wing_id}/squads/', {
      path: {
        'fleet_id': this._wing._fleet._id,
        'wing_id': this._wing._id
      }
    });
  }

  /**
   * The Squad api adapter for accessing and modifying the specific squad of a
   * wing.
   *
   * @returns {Squad}
   */
  get(id) {
    return new Squad(this._wing._fleet, id);
  }
}

/**
 * An api adapter over the end points handling a specific wing in a character's
 * fleet via functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Wing {
  /**
   * Create a new Wing adaptor owned by the given `fleet` corresponding
   * to the given `wingId`.
   *
   * @param fleet {Fleet} The owning fleet
   * @param wingId {Number} The wing id of this instance
   * @constructor
   */
  constructor(fleet, wingId) {
    this._fleet = fleet;
    this._id = wingId;
    this._squads = new Squads(this);
  }

  /**
   * Get the Squads end point for this particular wing.
   *
   * @type {Squads}
   */
  get squads() {
    return this._squads;
  }

  /**
   * @esi_route put_fleets_fleet_id_wings_wing_id
   * @esi_param naming - {name}
   *
   * @param name {String}
   * @returns {Promise.<Object>}
   */
  rename(name) {
    return this._fleet._agent.auth(this._fleet._token)
    .put('/v1/fleets/{fleet_id}/wings/{wing_id}/', {
      path: {
        'fleet_id': this._fleet._id,
        'wing_id': this._id
      },
      body: { 'name': name }
    });
  }

  /**
   * @esi_route delete_fleets_fleet_id_wings_wing_id
   *
   * @returns {Promise.<Object>}
   */
  remove() {
    return this._fleet._agent.auth(this._fleet._token)
    .del('/v1/fleets/{fleet_id}/wings/{wing_id}/', {
      path: {
        'fleet_id': this._fleet._id,
        'wing_id': this._id
      }
    });
  }
}

/**
 * An api adapter over the end points handling the wings in the character's
 * fleet via functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Wings` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Wings#get get} or {@link Wings#all all} if no id is
 * provided.
 */
class Wings extends ExtendableFunction {
  /**
   * Create a new Wings function owned by the given `fleet`.
   *
   * @param fleet {Fleet} The owning fleet
   * @constructor
   */
  constructor(fleet) {
    super(id => (id ? this.get(id) : this.all()));
    this._fleet = fleet;
  }

  /**
   * @esi_route get_fleets_fleet_id_wings
   *
   * @returns {Promise.<Array.<Object>>}
   */
  all() {
    return this._fleet._agent.auth(this._fleet._token)
    .get('/v1/fleets/{fleet_id}/wings/',
        { path: { 'fleet_id': this._fleet._id } });
  }

  /**
   * @esi_route post_fleets_fleet_id_wings
   * @esi_returns id:wing_id
   *
   * @returns {Promise.<Number>}
   */
  add() {
    return this._fleet._agent.auth(this._fleet._token)
    .post('/v1/fleets/{fleet_id}/wings/',
        { path: { 'fleet_id': this._fleet._id } });
  }

  /**
   * The Wing api adapter for accessing and modifying the specific wing of a
   * fleet.
   *
   * @returns {Wing}
   */
  get(id) {
    return new Wing(this._fleet, id);
  }
}

/**
 * An api adapter over the end points handling a character's fleet via
 * functions in the [fleets](https://esi.tech.ccp.is/latest/#/Fleets) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 */
class Fleet {
  /**
   * Create a new Fleet function using the given `agent` with SSO access from
   * `token`. The `fleetId` must also be provided.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param token {String} The SSO access token for the character
   * @param fleetId {Number} The fleet id of the fleet the character belongs to
   * @constructor
   */
  constructor(agent, token, fleetId) {
    this._agent = agent;
    this._token = token;
    this._id = fleetId;

    this._wings = new Wings(this);
  }

  /**
   * The Wings api adapter for accessing and modifying the wing state of the
   * fleet.
   *
   * @type {Wings}
   */
  get wings() {
    return this._wings;
  }

  /**
   * @esi_route get_fleets_fleet_id
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.auth(this._token)
    .get('/v1/fleets/{fleet_id}/', { path: { 'fleet_id': this._id } });
  }

  /**
   * @esi_route get_fleets_fleet_id_members
   *
   * @returns {Promise.<Array.<Object>>}
   */
  members() {
    return this._agent.auth(this._token)
    .get('/v1/fleets/{fleet_id}/members/', { path: { 'fleet_id': this._id } });
  }

  /**
   * @esi_route post_fleets_fleet_id_members
   *
   * @param invitation {Object}
   * @returns {Promise.<Object>}
   */
  invite(invitation) {
    return this._agent.auth(this._token)
    .post('/v1/fleets/{fleet_id}/members/', {
      path: { 'fleet_id': this._id },
      body: invitation
    });
  }

  /**
   * @esi_route delete_fleets_fleet_id_members_member_id
   *
   * @param memberId {Number}
   * @returns {Promise.<Object>}
   */
  kick(memberId) {
    return this._agent.auth(this._token)
    .del('/v1/fleets/{fleet_id}/members/{member_id}/', {
      path: {
        'fleet_id': this._id,
        'member_id': memberId
      }
    });
  }

  /**
   * @esi_route put_fleets_fleet_id_members_member_id
   * @esi_param movement - moveOrder
   *
   * @param memberId {Number}
   * @param moveOrder {Object}
   * @returns {Promise.<Object>}
   */
  move(memberId, moveOrder) {
    return this._agent.auth(this._token)
    .put('/v1/fleets/{fleet_id}/members/{member_id}/', {
      path: {
        'fleet_id': this._id,
        'member_id': memberId
      },
      body: moveOrder
    });
  }

  /**
   * @esi_route put_fleets_fleet_id
   *
   * @param newSettings {Object}
   * @returns {Promise.<Object>}
   */
  update(newSettings) {
    return this._agent.auth(this._token)
    .put('/v1/fleets/{fleet_id}/', {
      path: { 'fleet_id': this._id },
      body: newSettings
    });
  }
}

module.exports = Fleet;
