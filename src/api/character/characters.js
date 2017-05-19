const Promise = require('bluebird');

const CallableInstance = require('../../internal/callable-instance');
const [, MaxIdHandler] = require('../../internal/page-handler');
const Search = require('../search');
const Killmail = require('../killmail');

const Autopilot = require('./ui/autopilot');
const Bookmarks = require('./bookmarks');
const Calendar = require('./calendar');
const Colonies = require('./colonies');
const Contacts = require('./contacts');
const CharacterCorporation = require('./character-corporation');
const Fittings = require('./fittings');
const Fleet = require('./fleet');
const Mail = require('./mail');
const Structures = require('./structures');
const Window = require('./ui/window');

const _names = require('../../internal/names');

/**
 * An api adapter that provides functions for viewing public (non-authenticated)
 * information about a specific character  via functions in the
 * [character](https://esi.tech.ccp.is/latest/#/Character) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class CharacterInfo {
  /**
   * Create a new CharacterInfo for the given `agent`, targeting the
   * specific `characterId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param characterId {Number} The id used for all character requests
   * @constructor
   */
  constructor(agent, characterId) {
    this._agent = agent;
    this._id = characterId;
  }

  /**
   * @esi_route get_characters_character_id
   * @esi_example esi.characters(1).info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._agent.noAuth.get('/v4/characters/{character_id}/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_portrait
   * @esi_example esi.characters(1).portrait()
   *
   * @returns {Promise.<Object>}
   */
  portrait() {
    return this._agent.noAuth.get('/v2/characters/{character_id}/portrait/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_corporationhistory
   * @esi_example esi.characters(1).history()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  history() {
    return this._agent.noAuth.get(
        '/v1/characters/{character_id}/corporationhistory/',
        { path: { 'character_id': this._id } });
  }
}

/**
 * An extension of {@link CharacterInfo} that adds the remaining
 * character-linked, authenticated from the
 * [character](https://esi.tech.ccp.is/latest/#/Character) and related ESI end
 * points.
 *
 * @see https://esi.tech.ccp.is/latest/#/Character
 * @see https://esi.tech.cpp.is/latest/#/Assets
 * @see https://esi.tech.cpp.is/latest/#/Bookmarks
 * @see https://esi.tech.cpp.is/latest/#/Clones
 * @see https://esi.tech.cpp.is/latest/#/Fittings
 * @see https://esi.tech.cpp.is/latest/#/Killmails
 * @see https://esi.tech.cpp.is/latest/#/Location
 * @see https://esi.tech.ccp.is/latest/#/Planetary_Interaction
 * @see https://esi.tech.ccp.is/latest/#/Skills
 * @see https://esi.tech.ccp.is/latest/#/Wallet
 */
class Character extends CharacterInfo {
  /**
   * Create a new CharacterInfo for the given `agent`, targeting the
   * specific `characterId`.
   *
   * @param agent {ESIAgent} The agent used to generate web requests
   * @param characterId {Number} The id used for all character requests
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(agent, characterId, token) {
    super(agent, characterId);
    this._token = token;

    this._allKills = new MaxIdHandler(id => this.recentKills(id),
        k => k.killmail_id, 50);
    this._allMails = new MaxIdHandler(id => this.recentKillmails(id),
        km => km.killmail_id, 50);
    this._kills = null;

    this._bms = null;
    this._cal = null;
    this._contacts = null;
    this._corp = null;
    this._fit = null;
    this._mail = null;
    this._pi = null;
    this._struct = null;
    this._auto = null;
    this._win = null;
  }

  /**
   * An Autopilot instance linked to this Character.
   *
   * @type {Autopilot}
   */
  get autopilot() {
    if (!this._auto) {
      this._auto = new Autopilot(this._agent, this._token);
    }
    return this._auto;
  }

  /**
   * A Bookmarks instance linked to this Character.
   *
   * @type {Bookmarks}
   */
  get bookmarks() {
    if (!this._bms) {
      this._bms = new Bookmarks(this._agent, this._id, this._token);
    }
    return this._bms;
  }

  /**
   * A Calendar instance linked to this Character.
   *
   * @type {Calendar}
   */
  get calendar() {
    if (!this._cal) {
      this._cal = new Calendar(this._agent, this._id, this._token);
    }
    return this._cal;
  }

  /**
   * A Colonies instance linked to this Character.
   *
   * @type {Colonies}
   */
  get colonies() {
    if (!this._pi) {
      this._pi = new Colonies(this._agent, this._id, this._token);
    }
    return this._pi;
  }

  /**
   * A Contacts instance linked to this Character.
   *
   * @type {Contacts}
   */
  get contacts() {
    if (!this._contacts) {
      this._contacts = new Contacts(this._agent, this._id, this._token);
    }
    return this._contacts;
  }

  /**
   * A CharacterCorporation instance linked to this Character.
   *
   * @type {CharacterCorporation}
   */
  get corporation() {
    if (!this._corp) {
      this._corp = new CharacterCorporation(this._agent, this._id, this._token);
    }
    return this._corp;
  }

  /**
   * A Fittings instance linked to this Character.
   *
   * @type {Fittings}
   */
  get fittings() {
    if (!this._fit) {
      this._fit = new Fittings(this._agent, this._id, this._token);
    }
    return this._fit;
  }

  /**
   * A Mail instance linked to this Character.
   *
   * @type {Mail}
   */
  get mail() {
    if (!this._mail) {
      this._mail = new Mail(this._agent, this._id, this._token);
    }
    return this._mail;
  }

  /**
   * A Structures instance linked to this Character.
   *
   * @type {Structures}
   */
  get structures() {
    if (!this._struct) {
      this._struct = new Structures(this);
    }
    return this._struct;
  }

  /**
   * A Window instance linked to this Character.
   *
   * @type {Window}
   */
  get window() {
    if (!this._win) {
      this._win = new Window(this._agent, this._token);
    }
    return this._win;
  }

  /**
   * Get a Fleet instance for the given fleet `id`.
   *
   * @param id The fleet id this character belongs to.
   * @returns {Fleet}
   */
  fleet(id) {
    return new Fleet(this._agent, this._token, id);
  }

  /**
   * @esi_route get_characters_character_id_assets
   * @esi_example esi.characters(1, 'token').assets()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  assets() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/assets/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_clones
   * @esi_example esi.characters(1, 'token').clones()
   *
   * @returns {Promise.<Object>}
   */
  clones() {
    return this._agent.auth(this._token)
    .get('/v2/characters/{character_id}/clones/',
        { path: { 'character_id': this._id } });
  }

  /**
   * Get the kill details for the recent {@link Character#recentKillmails
   * recentKillmails} and then uses {@link Killmail#get} to map the details.
   * The request resolves to an array, each containing a killmail detail.
   *
   * @esi_example esi.characters(1, 'token').recentKills() ~ get_characters_character_id_killmails_recent
   *
   * @param maxKillId {Number} Optional; the mail id that limits which mails
   *   can be returned. If provided recent mails older than the id are returned
   * @returns {Promise.<Array.<Object>>}
   */
  recentKills(maxKillId = 0) {
    if (this._kills == null) {
      this._kills = new Killmail(this._agent);
    }

    return this.recentKillmails(maxKillId).then(kms => {
      return Promise.map(kms,
          km => this._kills.get(km.killmail_id, km.killmail_hash));
    });
  }

  /**
   * Get all kill, over all of history, for the given character. This makes
   * multiple calls to {@link Character#recentKills recentKills}. This
   * should be used with caution as some characters may have a very large number
   * of kills.
   *
   * @returns {Promise.<Array.<Object>>}
   */
  kills() {
    return this._allKills.getAll();
  }

  /**
   * @esi_route get_characters_character_id_killmails_recent
   * @esi_param max_count - 50
   * @esi_example esi.characters(1, 'token').recentKillmails() ~ get_characters_character_id_killmails_recent
   *
   * @param maxKillId {Number} If `0`, the most recent killmails are returned.
   * @returns {Promise.<Array.<Object>>}
   * @see Killmail#get
   */
  recentKillmails(maxKillId = 0) {
    let opts = { maxCount: 50 };
    if (maxKillId != 0) {
      opts.maxKillId = maxKillId;
    }
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/killmails/recent/', {
      path: { 'character_id': this._id },
      query: {
        'max_kill_id': maxKillId == 0 ? null : maxKillId,
        'max_count': 50
      }
    });
  }

  /**
   * Get all killmails, over all of history, for the given character. This makes
   * multiple calls to {@link Character#recentKillmails recentKillmails}. This
   * should be used with caution as some characters may have a very large number
   * of kills.
   *
   * @returns {Promise.<Array.<Object>>}
   */
  killmails() {
    return this._allMails.getAll();
  }

  /**
   * @esi_route get_characters_character_id_loyalty_points
   * @esi_example esi.characters(1, 'token').loyaltyPoints()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  loyaltyPoints() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/loyalty/points/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_ship
   * @esi_example esi.characters(1, 'token').ship()
   *
   * @returns {Promise.<Object>}
   */
  ship() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/ship/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_location
   * @esi_example esi.characters(1, 'token').location()
   *
   * @returns {Promise.<Object>}
   */
  location() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/location/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_wallets
   * @esi_example esi.characters(1, 'token').wallets()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  wallets() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/wallets/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_skills
   * @esi_example esi.characters(1, 'token').skills()
   *
   * @returns {Promise.<Object>}
   */
  skills() {
    return this._agent.auth(this._token)
    .get('/v3/characters/{character_id}/skills/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_skillqueue
   * @esi_example esi.characters(1, 'token').skillqueue()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  skillqueue() {
    return this._agent.auth(this._token)
    .get('/v2/characters/{character_id}/skillqueue/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_agents_research
   * @esi_example esi.characters(1, 'token').agentResearch()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  agentResearch() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/agents_research/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_chat_channels
   * @esi_example esi.characters(1, 'token').chatChannels()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  chatChannels() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/chat_channels/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_medals
   * @esi_example esi.characters(1, 'token').medals()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  medals() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/medals/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_standings
   * @esi_example esi.characters(1, 'token').standings()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  standings() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/standings/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_opportunities
   * @esi_example esi.characters(1, 'token').opportunities()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  opportunities() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/opportunities/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_orders
   * @esi_example esi.characters(1, 'token').orders()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  orders() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/orders/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_blueprints
   * @esi_example esi.characters(1, 'token').blueprints()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  blueprints() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/blueprints/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_roles
   * @esi_example esi.characters(1, 'token').roles()
   *
   * @returns {Promise.<Array.<String>>}
   */
  roles() {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/roles/',
        { path: { 'character_id': this._id } });
  }

  /**
   * @esi_route get_characters_character_id_industry_jobs
   * @esi_example esi.characters(1, 'token').industryJobs()
   *
   * @param includeCompleted
   * @returns {Promise.<Array.<Object>>}
   */
  industryJobs(includeCompleted = false) {
    return this._agent.auth(this._token)
    .get('/v1/characters/{character_id}/industry/jobs/', {
      path: { 'character_id': this._id },
      query: { 'include_completed': includeCompleted }
    });
  }
}

/**
 * An api adapter over the end points handling multiple characters via functions
 * in the [character](https://esi.tech.ccp.is/latest/#/Character) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Characters` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Characters#get get}.
 */
class Characters extends CallableInstance {
  /**
   * Create a new Characters function using the given `agent`.
   *
   * @param agent {ESIAgent} The ESI agent
   * @constructor
   */
  constructor(agent) {
    super((id, token) => this.get(id, token));
    this._agent = agent;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'character'`
   * type.
   *
   * @esi_example esi.characters.search categories=[character] get_search
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._agent, ['character']);
    }
    return this._search;
  }

  /**
   * Create a new CharacterInfo or Character end point targeting the particular
   * character by `id`. If `token` is provided then an authorized Character is
   * returned, otherwise the non-authenticated CharacterInfo is returned.
   *
   * @param id {Number} The character id
   * @param token {String} Optional; the character's SSO token
   * @returns {Character|CharacterInfo}
   */
  get(id, token = '') {
    if (token && token.length > 0) {
      return new Character(this._agent, id, token);
    } else {
      return new CharacterInfo(this._agent, id);
    }
  }

  /**
   * @esi_route post_characters_affiliation
   * @esi_param characters - ids
   * @esi_example esi.characters.affiliations(ids)
   *
   * @param ids {Array.<Number>}
   * @returns {Promise.<Array.<Object>>}
   */
  affiliations(ids) {
    return this._agent.noAuth.post('/v1/characters/affiliation/',
        { body: ids });
  }

  /**
   * @esi_route get_characters_names
   * @esi_param character_ids - ids
   * @esi_returns {character_id: id, character_name: name}
   * @esi_example esi.characters.names(ids)
   *
   * @param ids {Array.<Number>}
   * @returns {Promise.<Array.<Object>>}
   */
  names(ids) {
    if (ids.length > 20) {
      // Use universe/names end point since the /characters one breaks if
      // the URL gets too long.
      return _names(this._agent, 'character', ids);
    } else {
      // Use character/names end point
      return this._agent.noAuth.get('/v1/characters/names/',
          { query: { 'character_ids': ids } })
      .then(result => {
        // Rename character_id and character_name
        return result.map(r => {
          return {
            id: r.character_id,
            name: r.character_name
          };
        });
      });
    }
  }
}

module.exports = Characters;
