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
   * Get a corporation's public info from the ESI endpoint. This makes an HTTP
   * GET request to
   * [`corporations/{id}/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "alliance_id": 434243723,
   *   "ceo_id": 180548812,
   *   "corporation_name": "C C P",
   *   "member_count": 656,
   *   "ticker": "-CCP-"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CorporationApi.getCorporationsCorporationId
   */
  info() {
    return this._api.corporation()
    .newRequest('getCorporationsCorporationId', [this._id]);
  }

  /**
   * Get a corporation's alliance history from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`corporations/{id}/alliancehistory/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_alliancehistory).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "alliance": {
   *       "alliance_id": 99000006,
   *       "is_deleted": false
   *     },
   *     "record_id": 23,
   *     "start_date": "2016-10-25T14:46:00Z"
   *   },
   *   {
   *     "record_id": 1,
   *     "start_date": "2015-07-06T20:56:00Z"
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CorporationApi.getCorporationsCorporationIdAllianceHistory
   */
  history() {
    return this._api.corporation()
    .newRequest('getCorporationsCorporationIdAllianceHistory', [this._id]);
  }

  /**
   * Get a corporation's icon URLs from the ESI endpoint. This makes an HTTP
   * GET
   * request to
   * [`corporations/{id}/icons/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_corporation_id_icons).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "px128x128":
   * "https://imageserver.eveonline.com/Corporation/1000010_128.png",
   *   "px256x256":
   * "https://imageserver.eveonline.com/Corporation/1000010_256.png",
   *   "px64x64":
   * "https://imageserver.eveonline.com/Corporation/1000010_64.png"
   * }
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of  the request
   * @esi_link CorporationApi.getCorporationsCorporationIdIcons
   */
  icon() {
    return this._api.corporation()
    .newRequest('getCorporationsCorporationIdIcons', [this._id]);
  }

  /**
   * Get all offers from a corporation's loyalty store, from the ESI endpoint.
   * This makes an HTTP GET request to
   * [`loyalty/stores/{id}/offers/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Loyalty/get_loyalty_stores_corporation_id_offers).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "isk_cost": 0,
   *     "lp_cost": 100,
   *     "offer_id": 1,
   *     "quantity": 1,
   *     "required_items": [],
   *     "type_id": 123
   *  },
   *  {
   *     "isk_cost": 1000,
   *     "lp_cost": 100,
   *     "offer_id": 2,
   *     "quantity": 10,
   *     "required_items": [
   *       {
   *         "quantity": 10,
   *         "type_id": 1234
   *       }
   *     ],
   *     "type_id": 1235
   *   }
   * ]
   * ```
   *
   * @returns {Promise}
   * @esi_link LoyaltyApi.getLoyaltyStoresCorporationIdOffers
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
   * Get a list of NPC corporation ids from the ESI endpoint. This makes an
   * HTTP GET request to
   * [`corporations/npccorps/`](https://esi.tech.ccp.is/dev/?datasource=tranquility#!/Corporation/get_corporations_npccorps).
   * The request is returned as an asycnrhonous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   1000001,
   *   1000002,
   *   1000003
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link CorporationApi.getCorporationsNpccorps
   */
  npc() {
    return this._api.corporation().newRequest('getCorporationsNpccorps', []);
  }

  /**
   * Get the names for a list of corporation ids from the ESI endpoint. This
   * makes an HTTP GET request to
   * [`corporations/names/`](https://esi.tech.ccp.is/latest/#!/Corporation/get_corporations_names).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 1000171,
   *     "name": "Republic University"
   *   }
   * ]
   * ```
   *
   * Note that this has the id and name fields simplified compared to what the
   * actual ESI end point reports ('corporation_id' and 'corporation_name').
   * For
   * very long arrays, this will fall back to making an HTTP POST request to
   * [`universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names),
   * which does not have a URL length limitation. In this case the response
   * format will be as above.
   *
   * @param {Array.<Number>} ids The corporation ids to look up.
   * @return {Promise} A Promise that resolves to the response of
   *   the request
   * @esi_link CorporationApi.getCorporationsNames
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
