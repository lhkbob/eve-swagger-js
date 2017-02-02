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
   * Get the character's corporation's public info from the ESI endpoint.
   * Besides being defined against a particular character, this is equivalent to
   * {@link Corporation#info}.
   *
   * @return {Promise} A Promise that resolves to the response of the request
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
   * Get the character's corporation's alliance history from the ESI endpoint.
   * Besides being defined against a particular character, this is equivalent to
   * {@link Corporation#history}.
   *
   * @return {Promise} A Promise that resolves to the response of the request
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
   * Get the character's corporation's icon URLs from the ESI endpoint. Besides
   * being defined against a particular character, this is equivalent to {@link
      * Corporation#icon}.
   *
   * @return {Promise} A Promise that resolves to the response of the request
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
   * Get the character's corporation's member list from the ESI endpoint. This
   * makes an HTTP GET request to
   * [`corporations/{id}/members/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_members).
   * The request is returned as an asynchronous Promise that resolves to an
   * array of character ids. An example value looks like:
   *
   * ```
   * [
   *   90000001,
   *   90000002
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CorporationApi.getCorporationsCorporationIdMembers
   */
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
   * Get the character's corporation's member list with roles for each
   * character
   * from the ESI endpoint. The character must have the personalle manager or
   * any other grantable role in order for this request to succeed. This makes
   * an HTTP GET request to
   * [`corporations/{id}/roles/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_roles).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "character_id": 1000171,
   *     "roles": [
   *       "Director",
   *       "Station_Manager"
   *     ]
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CorporationApi.getCorporationsCorporationIdRoles
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
   * @returns {Promise} A Promise that resolves to the character's corporation
   *     id
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
