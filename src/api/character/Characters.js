const Promise = require('bluebird');

const ExtendableFunction = require('../../internal/ExtendableFunction');
const [, MaxIdHandler] = require('../../internal/PageHandler');
const Search = require('../Search');
const Killmail = require('../Killmail');

const Autopilot = require('./ui/Autopilot');
const Bookmarks = require('./Bookmarks');
const Calendar = require('./Calendar');
const Colonies = require('./Colonies');
const Contacts = require('./Contacts');
const CharacterCorporation = require('./CharacterCorporation');
const Fittings = require('./Fittings');
const Fleet = require('./Fleet');
const Mail = require('./Mail');
const Structures = require('./Structures');
const Window = require('./ui/Window');

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
   * Create a new CharacterInfo for the given `api` provider targeting the
   * specific `characterId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param characterId {Number} The id used for all character requests
   * @constructor
   */
  constructor(api, characterId) {
    this._api = api;
    this._id = characterId;
  }

  /**
   * @esi_route get_characters_character_id
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this._api.character()
    .newRequest('getCharactersCharacterId', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_portrait
   *
   * @returns {Promise.<Object>}
   */
  portrait() {
    return this._api.character()
    .newRequest('getCharactersCharacterIdPortrait', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_corporationhistory
   *
   * @returns {Promise.<Array.<Object>>}
   */
  history() {
    return this._api.character()
    .newRequest('getCharactersCharacterIdCorporationHistory', [this._id]);
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
   * Create a new CharacterInfo for the given `api` provider targeting the
   * specific `characterId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param characterId {Number} The id used for all character requests
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(api, characterId);
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
   * @returns {Autopilot}
   */
  get autopilot() {
    if (!this._auto) {
      this._auto = new Autopilot(this._api, this._token);
    }
    return this._auto;
  }

  /**
   * A Bookmarks instance linked to this Character.
   *
   * @returns {Bookmarks}
   */
  get bookmarks() {
    if (!this._bms) {
      this._bms = new Bookmarks(this._api, this._id, this._token);
    }
    return this._bms;
  }

  /**
   * A Calendar instance linked to this Character.
   *
   * @returns {Calendar}
   */
  get calendar() {
    if (!this._cal) {
      this._cal = new Calendar(this._api, this._id, this._token);
    }
    return this._cal;
  }

  /**
   * A Colonies instance linked to this Character.
   *
   * @returns {Colonies}
   */
  get colonies() {
    if (!this._pi) {
      this._pi = new Colonies(this._api, this._id, this._token);
    }
    return this._pi;
  }

  /**
   * A Contacts instance linked to this Character.
   *
   * @returns {Contacts}
   */
  get contacts() {
    if (!this._contacts) {
      this._contacts = new Contacts(this._api, this._id, this._token);
    }
    return this._contacts;
  }

  /**
   * A CharacterCorporation instance linked to this Character.
   *
   * @returns {CharacterCorporation}
   */
  get corporation() {
    if (!this._corp) {
      this._corp = new CharacterCorporation(this._api, this._id, this._token);
    }
    return this._corp;
  }

  /**
   * A Fittings instance linked to this Character.
   *
   * @returns {Fittings}
   */
  get fittings() {
    if (!this._fit) {
      this._fit = new Fittings(this._api, this._id, this._token);
    }
    return this._fit;
  }

  /**
   * A Mail instance linked to this Character.
   *
   * @returns {Mail}
   */
  get mail() {
    if (!this._mail) {
      this._mail = new Mail(this._api, this._id, this._token);
    }
    return this._mail;
  }

  /**
   * A Structures instance linked to this Character.
   *
   * @returns {Structures}
   */
  get structures() {
    if (!this._struct) {
      this._struct = new Structures(this._api, this._id, this._token);
    }
    return this._struct;
  }

  /**
   * A Window instance linked to this Character.
   *
   * @returns {Window}
   */
  get window() {
    if (!this._win) {
      this._win = new Window(this._api, this._token);
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
    return new Fleet(this._api, this._token, id);
  }

  /**
   * @esi_route get_characters_character_id_assets
   *
   * @returns {Promise.<Array.<Object>>}
   */
  assets() {
    return this._api.assets(this._token)
    .newRequest('getCharactersCharacterIdAssets', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_clones
   *
   * @returns {Promise.<Object>}
   */
  clones() {
    return this._api.clones(this._token)
    .newRequest('getCharactersCharacterIdClones', [this._id]);
  }

  /**
   * Get the kill details for the recent {@link Character#recentKillmails
   * recentKillmails} and then uses {@link Killmail#get} to map the details.
   * The request resolves to an array, each containing a killmail detail.
   *
   * @param maxKillId {Number} Optional; the mail id that limits which mails
   *   can be returned. If provided recent mails older than the id are returned
   * @returns {Promise.<Array.<Object>>}
   */
  recentKills(maxKillId = 0) {
    if (this._kills == null) {
      this._kills = new Killmail(this._api);
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
    return this._api.killmails(this._token)
    .newRequest('getCharactersCharacterIdKillmailsRecent', [this._id], opts);
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
   *
   * @returns {Promise.<Array.<Object>>}
   */
  loyaltyPoints() {
    return this._api.loyalty(this._token)
    .newRequest('getCharactersCharacterIdLoyaltyPoints', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_ship
   *
   * @returns {Promise.<Object>}
   */
  ship() {
    return this._api.location(this._token)
    .newRequest('getCharactersCharacterIdShip', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_location
   *
   * @returns {Promise.<Object>}
   */
  location() {
    return this._api.location(this._token)
    .newRequest('getCharactersCharacterIdLocation', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_wallets
   *
   * @returns {Promise.<Array.<Object>>}
   */
  wallets() {
    return this._api.wallet(this._token)
    .newRequest('getCharactersCharacterIdWallets', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_skills
   *
   * @returns {Promise.<Object>}
   */
  skills() {
    return this._api.skills(this._token)
    .newRequest('getCharactersCharacterIdSkills', [this._id]);
  }

  /**
   * @esi_route get_characters_character_id_skillqueue
   *
   * @returns {Promise.<Array.<Object>>}
   */
  skillqueue() {
    return this._api.skills(this._token)
    .newRequest('getCharactersCharacterIdSkillqueue', [this._id]);
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
class Characters extends ExtendableFunction {
  /**
   * Create a new Characters function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super((id, token) => this.get(id, token));
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'character'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['character']);
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
      return new Character(this._api, id, token);
    } else {
      return new CharacterInfo(this._api, id);
    }
  }

  /**
   * @esi_route get_characters_names
   * @esi_param character_ids - ids
   * @esi_returns {character_id: id, character_name: name}
   *
   * @param ids {Array.<Number>}
   * @returns {Promise.<Array.<Object>>}
   */
  names(ids) {
    // FIXME actually call get_characters_names
    if (ids.length > 20) {
      // Use universe/names end point since the /characters one breaks if
      // the URL gets too long.
      return _names(this._api, 'character', ids);
    } else {
      // Use character/names end point
      return this._api.character().newRequest('getCharactersNames', [ids])
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
