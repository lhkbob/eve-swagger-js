const ExtendableFunction = require('../internal/ExtendableFunction');
const Search = require('./Search');

const _names = require('../internal/names');

/**
 * An api adapter that provides functions for accessing various details for an
 * alliance specified by id, via functions in the
 * [alliance](https://esi.tech.ccp.is/latest/#/Alliance) ESI endpoints. You
 * should not usually instantiate this directly as its constructor requires an
 * internal api instance.
 */
class Alliance {
  /**
   * Create a new Alliance for the given `api` provider and specific
   * `allianceId`.
   *
   * @param api {ApiProvider} The api provider used to generate web requests
   * @param allianceId {Number} The alliance id that is used for all requests
   * @constructor
   */
  constructor(api, allianceId) {
    this._api = api;
    this._id = allianceId;
  }

  /**
   * @esi_route get_alliances_alliance_id
   *
   * @return {Promise.<Object>}
   */
  info() {
    return this._api.alliance()
    .newRequest('getAlliancesAllianceId', [this._id]);
  }

  /**
   * @esi_route get_alliances_alliance_id_corporations
   *
   * @return {Promise.<Array.<Number>>}
   */
  corporations() {
    return this._api.alliance()
    .newRequest('getAlliancesAllianceIdCorporations', [this._id]);
  }

  /**
   * @esi_route get_alliances_alliance_id_icons
   *
   * @return {Promise.<Object>}
   */
  icon() {
    return this._api.alliance()
    .newRequest('getAlliancesAllianceIdIcons', [this._id]);
  }
}

/**
 * An api adapter over the end points handling multiple alliances via functions
 * in the [alliance](https://esi.tech.ccp.is/latest/#/Alliance) ESI endpoints.
 * You should not usually instantiate this directly as its constructor requires
 * an internal api instance.
 *
 * This is a function class so instances of `Alliances` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Alliances#get get} or {@link Alliances#all all} if
 * no id is provided.
 */
class Alliances extends ExtendableFunction {
  /**
   * Create a new Alliances function using the given `api`.
   *
   * @param api {ApiProvider} The api provider
   * @constructor
   */
  constructor(api) {
    super(id => (id ? this.get(id) : this.all()));
    this._api = api;

    this._search = null;
  }

  /**
   * A Search module instance configured to search over the `'alliance'`
   * type.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api, ['alliance']);
    }
    return this._search;
  }

  /**
   * Create a new Alliance end point targeting the particular alliance by `id`.
   *
   * @param id {Number} The alliance id
   * @returns {Alliance}
   */
  get(id) {
    return new Alliance(this._api, id);
  }

  /**
   * @esi_route get_alliances
   *
   * @return {Promise.<Array.<Number>>}
   */
  all() {
    return this._api.alliance().newRequest('getAlliances', []);
  }

  /**
   * @esi_route get_alliances_names
   * @esi_param alliance_ids - ids
   * @esi_returns {alliance_id: id, alliance_name: name}
   *
   * @param {Array.<Number>} ids If not provided then the names of all
   *     alliances will be returned.
   * @return {Promise.<Array.<Object>>}
   */
  names(ids = []) {
    if (!ids || ids.length == 0) {
      return this.all().then(allIds => this.names(allIds));
    } else {
      if (ids.length > 20) {
        // Use universe/names end point since the /alliances one breaks if
        // the URL gets too long.
        return _names(this._api, 'alliance', ids);
      } else {
        // Use alliance/names end point
        return this._api.alliance().newRequest('getAlliancesNames', [ids])
        .then(result => {
          // Rename alliance_id and alliance_name
          return result.map(r => {
            return {
              id: r.alliance_id,
              name: r.alliance_name
            };
          });
        });
      }
    }
  }
}

module.exports = Alliances;
