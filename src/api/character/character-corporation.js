const Promise = require('bluebird');

const [PageHandler,] = require('../../internal/page-handler');

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
   * Create a new corporation agent adapter for the particular character's
   * corporation.
   *
   * @param agent {ESIAgent} The ESI agent
   * @param characterId {Number} The character this is linked to
   * @param token {String} The SSO access token for the character
   */
  constructor(agent, characterId, token) {
    this._agent = agent;
    this._charId = characterId;
    this._token = token;
    this._id = null;
    this._allStructs = new PageHandler(page => this.structures(page), 250);
  }

  /**
   * @esi_route get_corporations_corporation_id
   *
   * Note that this is equivalent to {@link Corporation#info}.
   *
   * @esi_example esi.characters(1, 'token').corporation.info()
   *
   * @returns {Promise.<Object>}
   */
  info() {
    return this.id().then(corpId => {
      return this._agent.noAuth.get('/v3/corporations/{corporation_id}/',
          { path: { 'corporation_id': corpId } });
    });
  }

  /**
   * @esi_route get_corporations_corporation_id_alliancehistory
   *
   * Note that this is equivalent to {@link Corporation#history}.
   *
   * @esi_example esi.characters(1, 'token').corporation.history()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  history() {
    return this.id().then(corpId => {
      return this._agent.noAuth.get(
          '/v1/corporations/{corporation_id}/alliancehistory/',
          { path: { 'corporation_id': corpId } });
    });
  }

  /**
   * @esi_route get_corporations_corporation_id_icons
   *
   * Note that this is equivalent to {@link Corporation#icon}
   *
   * @esi_example esi.characters(1, 'token').corporation.icon()
   *
   * @returns {Promise.<Object>}
   */
  icon() {
    return this.id().then(corpId => {
      return this._agent.noAuth.get('/v1/corporations/{corporation_id}/icons/',
          { path: { 'corporation_id': corpId } });
    });
  }

  /**
   * @esi_route get_loyalty_stores_corporation_id_offers
   *
   * Note that this is equivalent to {@link Corporation#loyaltyOffers}
   *
   * @esi_example esi.characters(1, 'token').corporation.loyaltyOffers()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  loyaltyOffers() {
    return this.id().then(corpId => {
      return this._agent.noAuth.get(
          '/v1/loyalty/stores/{corporation_id}/offers/',
          { path: { 'corporation_id': corpId } });
    });
  }

  /**
   * @esi_route get_corporations_corporation_id_members
   * @esi_returns character_id
   * @esi_example esi.characters(1, 'token').corporation.members()
   *
   * @returns {Promise.<Array.<Number>>}
   */
  members() {
    return this.id().then(corpId => {
      return this._agent.auth(this._token)
      .get('/v2/corporations/{corporation_id}/members/',
          { path: { 'corporation_id': corpId } });
    }).then(result => {
      return result.map(e => e.character_id);
    });
  }

  /**
   * @esi_route get_corporations_corporation_id_roles
   * @esi_example esi.characters(1, 'token').corporation.roles()
   *
   * @returns {Promise.<Array.<Object>>}
   */
  roles() {
    return this.id().then(corpId => {
      return this._agent.auth(this._token)
      .get('/v1/corporations/{corporation_id}/roles/',
          { path: { 'corporation_id': corpId } });
    });
  }

  /**
   * @esi_route get_corporations_corporation_id_structures
   * @esi_example esi.characters(1, 'token').corporation.structures()
   *
   * @param page {Number} If `0`, all structures are returned
   *
   * @returns {Promise.<Array.<Object>>}
   */
  structures(page = 0) {
    if (page == 0) {
      return this._allStructs.getAll();
    } else {
      return this.id().then(corpId => {
        return this._agent.auth(this._token)
        .get('/v1/corporations/{corporation_id}/structures/', {
          path: { 'corporation_id': corpId },
          query: { 'page': page }
        });
      });
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
      return this._agent.noAuth.get('/v4/characters/{character_id}/',
          { path: { 'character_id': this._charId } }).then(result => {
        let id = result.corporation_id;
        this._id = id;
        return id;
      });
    }
  }
}

module.exports = CharacterCorporation;
