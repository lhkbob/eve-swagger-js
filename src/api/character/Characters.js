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
   * Get the public info of the character from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`characters/{id}/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "ancestry_id": 19,
   *   "birthday": "2015-03-24T11:37:00Z",
   *   "bloodline_id": 3,
   *   "corporation_id": 109299958,
   *   "description": "",
   *   "gender": "male",
   *   "name": "CCP Bartender",
   *   "race_id": 2
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CharacterApi.getCharactersCharacterId
   */
  info() {
    return this._api.character()
    .newRequest('getCharactersCharacterId', [this._id]);
  }

  /**
   * Get a character's portrait URLs from the ESI endpoint. This makes an HTTP
   * GET request to
   * [`characters/{id}/portraits/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id_portraits).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "px128x128":
   * "https://imageserver.eveonline.com/Character/95465499_128.jpg",
   *   "px256x256":
   * "https://imageserver.eveonline.com/Character/95465499_256.jpg",
   *   "px512x512":
   * "https://imageserver.eveonline.com/Character/95465499_512.jpg",
   *   "px64x64":
   * "https://imageserver.eveonline.com/Character/95465499_64.jpg"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CharacterApi.getCharactersCharacterIdPortraits
   */
  portrait() {
    return this._api.character()
    .newRequest('getCharactersCharacterIdPortraits', [this._id]);
  }

  /**
   * Get a character's corporation history from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`characters/{id}/corporationhistory/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_character_id_corporationhistory).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "corporation_id": 90000001,
   *     "is_deleted": false,
   *     "record_id": 500,
   *     "start_date": "2016-06-26T20:00:00Z"
   *   },
   *   {
   *     "corporation_id": 90000002,
   *     "is_deleted": false,
   *     "record_id": 501,
   *     "start_date": "2016-07-26T20:00:00Z"
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CharacterApi.getCharactersCharacterIdCorporationHistory
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
   * Get a character's assets from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`characters/{id}/assets/`](https://esi.tech.ccp.is/latest/#!/Assets/get_characters_character_id_assets).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "is_singleton": true,
   *     "item_id": 1000000016835,
   *     "location_flag": "Hangar",
   *     "location_id": 60002959,
   *     "location_type": "station",
   *     "type_id": 3516
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link AssetsApi.getCharactersCharacterIdPortraits
   */
  assets() {
    return this._api.assets(this._token)
    .newRequest('getCharactersCharacterIdAssets', [this._id]);
  }

  /**
   * Get a character's clones state from the ESI endpoint. This makes an HTTP
   * GET request to
   * [`characters/{id}/clones/`](https://esi.tech.ccp.is/latest/#!/Clones/get_characters_character_id_clones).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "home_location": {
   *     "location_id": 1021348135816,
   *    "location_type": "structure"
   *   },
   *   "jump_clones": [
   *     {
   *       "implants": [
   *         22118
   *       ],
   *       "location_id": 60003463,
   *       "location_type": "station"
   *     },
   *     {
   *       "implants": [],
   *      "location_id": 1021348135816,
   *      "location_type": "structure"
   *     }
   *   ]
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link ClonesApi.getCharactersCharacterIdClones
   */
  clones() {
    return this._api.clones(this._token)
    .newRequest('getCharactersCharacterIdClones', [this._id]);
  }

  /**
   * Get the kill details for the recent {@link Character.recentKillmails
   * recentKillmails} and then uses {@link Killmail.get} to map the details.
   * The request resolves to an array, each containing a killmail detail:
   *
   * ```
   * [
   *   {
   *     "attackers": [
   *       {
   *         "character_id": 95810944,
   *         "corporation_id": 1000179,
   *         "damage_done": 5745,
   *         "faction_id": 500003,
   *         "final_blow": true,
   *         "security_status": -0.3,
   *         "ship_type_id": 17841,
   *         "weapon_type_id": 3074
   *       }
   *     ],
   *     "killmail_id": 56733821,
   *     "killmail_time": "2016-10-22T17:13:36Z",
   *     "solar_system_id": 30002976,
   *     "victim": {
   *       "alliance_id": 621338554,
   *       "character_id": 92796241,
   *       "corporation_id": 841363671,
   *       "damage_taken": 5745,
   *       "items": [
   *         {
   *           "flag": 20,
   *           "item_type_id": 5973,
   *           "quantity_dropped": 1,
   *           "singleton": 0
   *         }
   *       ],
   *       "position": {
   *         "x": 452186600569.4748,
   *         "y": 146704961490.90222,
   *         "z": 109514596532.54477
   *       },
   *       "ship_type_id": 17812
   *     }
   *   }
   * ]
   * ```
   *
   * @param maxKillId {Number} Optional; the mail id that limits which mails
   *   can be returned. If provided recent mails older than the id are returned
   * @returns {Promise}
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
   * multiple calls to {@link Character.recentKills recentKills}. This
   * should be used with caution as some characters may have a very large number
   * of kills.
   *
   * @returns {Promise}
   */
  kills() {
    return this._allKills.getAll();
  }

  /**
   * Get recent kill mails for the given character via the ESI end point. Up to
   * to 50 mails are provided at a time. Pagination is supported by specifying
   * `maxKillId`, in which case the most recent mails prior to the max id will
   * be returned.
   *
   * This makes an HTTP GET request to
   * [`/characters/{characterId}/killmails/recent/`](https://esi.tech.ccp.is/latest/#!/Killmails/get_characters_character_id_killmails_recent).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "killmail_hash": "8eef5e8fb6b88fe3407c489df33822b2e3b57a5e",
   *     "killmail_id": 2
   *   },
   *   {
   *     "killmail_hash": "b41ccb498ece33d64019f64c0db392aa3aa701fb",
   *     "killmail_id": 1
   *   }
   * ]
   * ```
   *
   * @param {Number} maxKillId Optional; the mail id that limits which mails
   *   can be returned. If provided recent mails older than the id are returned
   * @return {Promise} A Promise that resolves to the response of the request
   * @see Killmail#get
   * @esi_link KillmailsApi.getCharactersCharacterIdKillmailsRecent
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
   * multiple calls to {@link Character.recentKillmails recentKillmails}. This
   * should be used with caution as some characters may have a very large number
   * of kills.
   *
   * @returns {Promise}
   */
  killmails() {
    return this._allMails.getAll();
  }

  /**
   * Get all loyalty points the character has earned, from every corporation
   * they have worked for from the ESI endpoint. This makes an HTTP GET request
   * to
   * [`characters/{id}/loyalty/points/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Loyalty/get_characters_character_id_loyalty_points).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "corporation_id": 123,
   *     "loyalty_points": 100
   *   }
   * ]
   * ```
   *
   * @returns {Promise}
   * @esi_link LoyaltyApi.getCharactersCharacterIdLoyaltyPoints
   */
  loyaltyPoints() {
    return this._api.loyalty(this._token)
    .newRequest('getCharactersCharacterIdLoyaltyPoints', [this._id]);
  }

  /**
   * Get a character's current ship from the ESI endpoint. This makes an HTTP
   * GET request to
   * [`characters/{id}/ship/`](https://esi.tech.ccp.is/latest/#!/Location/get_characters_character_id_ship).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "ship_item_id": 1000000016991,
   *   "ship_name": "SPACESHIPS!!!",
   *   "ship_type_id": 1233
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link LocationApi.getCharactersCharacterIdShip
   */
  ship() {
    return this._api.location(this._token)
    .newRequest('getCharactersCharacterIdShip', [this._id]);
  }

  /**
   * Get the character's location from the ESI endpoint. This makes an HTTP GET
   * request to
   * [`characters/{id}/location/`](https://esi.tech.ccp.is/latest/#!/Location/get_characters_character_id_location).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "solar_system_id": 30002505,
   *   "structure_id": 1000000016989
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link LocationApi.getCharactersCharacterIdLocation
   */
  location() {
    return this._api.location(this._token)
    .newRequest('getCharactersCharacterIdLocation', [this._id]);
  }

  /**
   * Get the character's wallets' balances from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`characters/{id}/wallets/`](https://esi.tech.ccp.is/latest/#!/Wallet/get_characters_character_id_wallets).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "balance": 295000,
   *     "wallet_id": 1000
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link WalletApi.getCharactersCharacterIdWallets
   */
  wallets() {
    return this._api.wallet(this._token)
    .newRequest('getCharactersCharacterIdWallets', [this._id]);
  }

  /**
   * Get the character's trained skills, sorted ascending by finishing time,
   * from the ESI endpoint. This makes an HTTP GET request to
   * [`characters/{id}/skills/`](https://esi.tech.ccp.is/latest/#!/Skills/get_characters_character_id_skills).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "skills": [
   *     {
   *       "current_skill_level": 1,
   *       "skill_id": 1,
   *       "skillpoints_in_skill": 10000
   *     },
   *     {
   *       "current_skill_level": 1,
   *       "skill_id": 2,
   *       "skillpoints_in_skill": 10000
   *     }
   *   ],
   *   "total_sp": 20000
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link SkillsApi.getCharactersCharacterIdSkills
   */
  skills() {
    return this._api.skills(this._token)
    .newRequest('getCharactersCharacterIdSkills', [this._id]);
  }

  /**
   * Get the character's skill queue, sorted ascending by finishing time, from
   * the ESI endpoint. This makes an HTTP GET request to
   * [`characters/{id}/skillqueue/`](https://esi.tech.ccp.is/latest/#!/Skills/get_characters_character_id_skillqueue).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "finish_date": "2016-06-29T10:47:00Z",
   *     "finished_level": 3,
   *     "queue_position": 0,
   *     "skill_id": 1,
   *     "start_date": "2016-06-29T10:46:00Z"
   *   },
   *   {
   *     "finish_date": "2016-07-15T10:47:00Z",
   *     "finished_level": 4,
   *     "queue_position": 1,
   *     "skill_id": 1,
   *     "start_date": "2016-06-29T10:47:00Z"
   *   },
   *   {
   *     "finish_date": "2016-08-30T10:47:00Z",
   *     "finished_level": 2,
   *     "queue_position": 2,
   *     "skill_id": 2,
   *     "start_date": "2016-07-15T10:47:00Z"
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link SkillsApi.getCharactersCharacterIdSkillqueue
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
   * Get the names for a list of character ids from the ESI endpoint. This
   * makes
   * an HTTP GET request to
   * [`characters/names/`](https://esi.tech.ccp.is/latest/#!/Character/get_characters_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 95465499,
   *     "name": "CCP Bartender"
   *   }
   * ]
   * ```
   *
   * Note that this has the id and name fields simplified compared to what the
   * actual ESI end point reports ('character_id' and 'character_name'). For
   * very long arrays, this will fall back to making an HTTP POST request to
   * [`universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names),
   * which does not have a URL length limitation. In this case the response
   * format will be as above.
   *
   * @param {Array.<Number>} ids The character ids to look up.
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CharacterApi.getCharactersNames
   */
  names(ids) {
    if (ids.length > 20) {
      // Use universe/names end point since the /characters one breaks if
      // the URL gets too long.
      return _names(this._api, 'character', ids);
    } else {
      // Use characters/names end point and
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
