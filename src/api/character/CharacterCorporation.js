const Promise = require('bluebird');

/**
 * An api adapter that provides functions for accessing various details for a
 * corporation specified by id via functions in the
 * [corporation](https://esi.tech.ccp.is/latest/#/Corporation) ESI endpoints.
 * Unlike {@link Corporation}, his only includes all corporation end points,
 * including those requiring access tokens. Additionally, this corporation
 * adapter is attached to a character so it always reports information on the
 * character's corporation.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 */
class CharacterCorporation {
  /**
   * Create a new corporation api adapter for the particular character's
   * corporation.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The character this is linked to
   * @param token {String} The SSO access token for the character
   */
  constructor(api, characterId, token) {
    this._api = api;
    this._charId = characterId;
    this._token = token;
    this._id = null;
  }

  /**
   * @esi_route get_corporations_corporation_id
   *
   * Note that this is equivalent to {@link Corporation#info}.
   *
   * @returns {Promise.<Object>}
   */
  info() {
    if (this._id) {
      return this._api.corporation()
      .newRequest('getCorporationsCorporationId', [this._id]);
    } else {
      return this.id().then(corpId => {
        return this._api.corporation()
        .newRequest('getCorporationsCorporationId', [corpId]);
      });
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_alliancehistory
   *
   * Note that this is equivalent to {@link Corporation#history}.
   *
   * @returns {Promise.<Array.<Object>>}
   */
  history() {
    if (this._id) {
      return this._api.corporation()
      .newRequest('getCorporationsCorporationIdAllianceHistory', [this._id]);
    } else {
      return this.id().then(corpId => {
        return this._api.corporation()
        .newRequest('getCorporationsCorporationIdAllianceHistory', [corpId]);
      });
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_icons
   *
   * Note that this is equivalent to {@link Corporation#icon}
   *
   * @returns {Promise.<Object>}
   */
  icon() {
    if (this._id) {
      return this._api.corporation()
      .newRequest('getCorporationsCorporationIdIcons', [this._id]);
    } else {
      return this.id().then(corpId => {
        return this._api.corporation()
        .newRequest('getCorporationsCorporationIdIcons', [corpId]);
      });
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_members
   * @esi_returns character_id
   *
   * @returns {Promise.<Array.<Number>>}
   */
  // FIXME how to document the remap?
  members() {
    if (this._id) {
      return this._api.corporation(this._token)
      .newRequest('getCorporationsCorporationIdMembers', [this._id])
      .then(members => members.map(m => m.character_id));
    } else {
      return this.id().then(corpId => {
        return this._api.corporation(this._token)
        .newRequest('getCorporationsCorporationIdMembers', [corpId])
        .then(members => members.map(m => m.character_id));
      })
    }
  }

  /**
   * @esi_route get_corporations_corporation_id_roles
   *
   * @returns {Promise.<Array.<Object>>}
   */
  roles() {
    if (this._id) {
      return this._api.corporation(this._token)
      .newRequest('getCorporationsCorporationIdRoles', [this._id]);
    } else {
      return this.id().then(corpId => {
        return this._api.corporation(this._token)
        .newRequest('getCorporationsCorporationIdRoles', [corpId]);
      })
    }
  }

  /**
   * Get the corporation id of the corp that the character belongs to.
   *
   * @returns {Promise.<Number>} A Promise that resolves to the character's
   *     corporation id
   */
  id() {
    if (this._id) {
      return Promise.resolve(this._id);
    } else {
      return this._api.character()
      .newRequest('getCharactersCharacterId', [this._charId])
      .then(result => {
        let id = result.corporation_id;
        this._id = id;
        return id;
      });
    }
  }
}

module.exports = CharacterCorporation;
