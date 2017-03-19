const ExtendableFunction = require('../internal/ExtendableFunction');
const Search = require('./Search');

const _names = require('../internal/names');

/**
 * An api adapter that provides functions for accessing various details for a
 * corporation specified by id via functions in the
 * [corporation](https://esi.tech.ccp.is/latest/#/Corporation) ESI endpoints.
 * This only includes the non-authenticated corporation end points.
 *
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance. This does not include functions that require a
 * character's authorization.
 */
class Corporation {
  /**
   * Create a new Corporation for the given `api` provider and specific
   * `corporationId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param corporationId {Number} The corporation id that is used for all
   *     requests
   * @constructor
   */
  constructor(api, corporationId) {
    this._api = api;
    this._id = corporationId;
  }

  /**
   * @esi_route get_corporations_corporation_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._api.corporation()
    .newRequest('getCorporationsCorporationId', [this._id]);
  }

  /**
   * @esi_route get_corporations_corporation_id_alliancehistory
   *
   * @return {Promise.<Array.<Object>>}
   */
  history() {
    return this._api.corporation()
    .newRequest('getCorporationsCorporationIdAllianceHistory', [this._id]);
  }

  /**
   * @esi_route get_corporations_corporation_id_icons
   *
   * @return {Promise.<Object>}
   */
  icon() {
    return this._api.corporation()
    .newRequest('getCorporationsCorporationIdIcons', [this._id]);
  }

  /**
   * @esi_route get_loyalty_stores_corporation_id_offers
   *
   * @returns {Promise.<Array.<Object>>}
   */
  loyaltyOffers() {
    return this._api.loyalty().newRequest('getLoyaltyStoresCorporationIdOffers', [this._id]);
  }
}

/**
 * An api adapter over the end points handling multiple corporations  via
 * functions in the [corporation](https://esi.tech.ccp.is/latest/#/Corporation)
 * ESI endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Corporations` are functions and can
 * be invoked directly, besides accessing its members. Its default function
 * action is equivalent to {@link Corporations#get get}.
 */
class Corporations extends ExtendableFunction {
  /**
   * Create a new Corporations function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => this.get(id));
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'corporation'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['corporation']);
    }
    return this._search;
  }

  /**
   * Create a new Corporation end point targeting the particular corporation by
   * `id`.
   *
   * @param id {Number} The corporation id
   * @returns {Corporation}
   */
  get(id) {
    return new Corporation(this._api, id);
  }

  /**
   * @esi_route get_corporations_npccorps
   *
   * @return {Promise.<Array.<Number>>}
   */
  npc() {
    return this._api.corporation().newRequest('getCorporationsNpccorps', []);
  }

  /**
   * @esi_route get_corporations_names
   * @esi_param corporation_ids - ids
   * @esi_returns {corporation_id: id, corporation_name: name}
   *
   * @param {Array.<Number>} ids
   * @return {Promise.<Array.<Object>>}
   */
  names(ids) {
    if (ids.length > 20) {
      // Use universe/names end point since the /corporations one breaks if
      // the URL gets too long.
      return _names(this._api, 'corporation', ids);
    } else {
      // Use alliance/names end point and
      return this._api.corporation().newRequest('getCorporationsNames', [ids])
      .then(result => {
        // Rename corporation_id and corporation_name
        return result.map(r => {
          return {
            id: r.corporation_id,
            name: r.corporation_name
          };
        });
      });
    }
  }
}

module.exports = Corporations;
