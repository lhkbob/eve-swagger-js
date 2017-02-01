const ApiProvider = require('./internal/ApiProvider');

const Characters = require('./api/character/Characters');

const Agents = require('./api/universe/Agents');
const Constellations = require('./api/universe/Constellations');
const Factions = require('./api/universe/Factions');
const Freeports = require('./api/universe/Freeports');
const Industry = require('./api/universe/Industry');
const Insurance = require('./api/universe/Insurance');
const PlanetaryInteraction = require('./api/universe/PlanetaryInteraction');
const Races = require('./api/universe/Races');
const Regions = require('./api/universe/Regions');
const SolarSystems = require('./api/universe/SolarSystems');
const Stations = require('./api/universe/Stations');
const Types = require('./api/universe/Types');
const Wormholes = require('./api/universe/Wormholes');

const Alliances = require('./api/Alliances');
const Corporations = require('./api/Corporations');
const Incursions = require('./api/Incursions');
const Killmail = require('./api/Killmail');
const Search = require('./api/Search');
const Sovereignty = require('./api/Sovereignty');
const Wars = require('./api/Wars');

/**
 * Api creates a shared, internal ApiProvider and then lazily instantiates all
 * specific modules as needed.
 *
 * @see https://esi.tech.ccp.is/latest
 */
class Api {
  /**
   * Create a new Api with the given configuration provided in a single
   * object map. If no argument is provided, the defaults are used.
   *
   * @param service {String} URL to the ESI service, defaults to
   *     `'https://esi.tech.ccp.is/latest'`.
   * @param source {String} Data source used, defaults to `tranquility`.
   * @param agent {String} Custom user agent string to send with each request,
   *     which defaults to this project but really should be set for your app
   * @param language {String} Language character code, defaults to `en-us`
   * @param timeout {Number} Request timeout in milliseconds, defaults to `6000`
   * @constructor
   */
  constructor({
      service: service = 'https://esi.tech.ccp.is/latest',
      source: source = 'tranquility',
      agent: agent = 'eve-swagger-js / https://github.com/lhkbob/eve-swagger-js',
      language: language = 'en-us',
      timeout: timeout = 6000
  } = {}) {
    this._api = new ApiProvider({service: service, source: source, agent: agent, language: language, timeout: timeout});

    this._char = null;

    this._agent = null;
    this._const = null;
    this._faction = null;
    this._freeport = null;
    this._indy = null;
    this._insurance = null;
    this._pi = null;
    this._race = null;
    this._region = null;
    this._system = null;
    this._station = null;
    this._type = null;
    this._worm = null;

    this._alliance = null;
    this._corp = null;
    this._incursion = null;
    this._km = null;
    this._search = null;
    this._sov = null;
    this._wars = null;
  }

  /**
   * An instance of Characters using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Characters}
   */
  get characters() {
    if (!this._char) {
      this._char = new Characters(this._api);
    }
    return this._char;
  }

  /**
   * An instance of Agents using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Agents}
   */
  get agents() {
    if (!this._agent) {
      this._agent = new Agents(this._api);
    }
    return this._agent;
  }

  /**
   * An instance of Constellations using a shared ApiProvider configured based
   * on the Api's initialization options.
   *
   * @returns {Constellations}
   */
  get constellations() {
    if (!this._const) {
      this._const = new Constellations(this._api);
    }
    return this._const;
  }

  /**
   * An instance of Factions using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Factions}
   */
  get factions() {
    if (!this._faction) {
      this._faction = new Factions(this._api);
    }
    return this._faction;
  }

  /**
   * An instance of Freeports using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Freeports}
   */
  get freeports() {
    if (!this._freeport) {
      this._freeport = new Freeports(this._api);
    }
    return this._freeport;
  }

  /**
   * An instance of Industry using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Industry}
   */
  get industry() {
    if (!this._indy) {
      this._indy = new Industry(this._api);
    }
    return this._indy;
  }

  /**
   * An instance of Insurance using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Insurance}
   */
  get insurance() {
    if (!this._insurance) {
      this._insurance = new Insurance(this._api);
    }
    return this._insurance;
  }

  /**
   * An instance of PlanetaryInteraction using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {PlanetaryInteraction}
   */
  get pi() {
    if (!this._pi) {
      this._pi = new PlanetaryInteraction(this._api);
    }
    return this._pi;
  }

  /**
   * An instance of Races using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Races}
   */
  get races() {
    if (!this._race) {
      this._race = new Races(this._api);
    }
    return this._race;
  }

  /**
   * An instance of Regions using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Regions}
   */
  get regions() {
    if (!this._region) {
      this._region = new Regions(this._api);
    }
    return this._region;
  }

  /**
   * An instance of SolarSystems using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {SolarSystems}
   */
  get solarSystems() {
    if (!this._system) {
      this._system = new SolarSystems(this._api);
    }
    return this._system;
  }

  /**
   * An instance of Stations using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Stations}
   */
  get stations() {
    if (!this._station) {
      this._station = new Stations(this._api);
    }
    return this._station;
  }

  /**
   * An instance of Types using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Types}
   */
  get types() {
    if (!this._type) {
      this._type = new Types(this._api);
    }
    return this._type;
  }

  /**
   * An instance of Wormholes using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Wormholes}
   */
  get wormholes() {
    if (!this._worm) {
      this._worm = new Wormholes(this._api);
    }
    return this._worm;
  }

  /**
   * An instance of Alliances using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Alliances}
   */
  get alliances() {
    if (!this._alliance) {
      this._alliance = new Alliances(this._api);
    }
    return this._alliance;
  }

  /**
   * An instance of Corporations using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Corporations}
   */
  get corporations() {
    if (!this._corp) {
      this._corp = new Corporations(this._api);
    }
    return this._corp;
  }

  /**
   * An instance of Incursions using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Incursions}
   */
  get incursions() {
    if (!this._incursion) {
      this._incursion = new Incursions(this._api);
    }
    return this._incursion;
  }

  /**
   * An instance of Killmail using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Killmail}
   */
  get killmail() {
    if (!this._km) {
      this._km = new Killmail(this._api);
    }
    return this._km;
  }

  /**
   * An instance of Sovereignty using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Sovereignty}
   */
  get sovereignty() {
    if (!this._sov) {
      this._sov = new Sovereignty(this._api);
    }
    return this._sov;
  }

  /**
   * An instance of Wars using a shared ApiProvider configured based on
   * the Api's initialization options.
   *
   * @returns {Wars}
   */
  get wars() {
    if (!this._wars) {
      this._wars = new Wars(this._api);
    }
    return this._wars;
  }

  /**
   * An instance of Search using a shared ApiProvider configured based on
   * the Api's initialization options. This Search instance is configured to
   * use all categories and is not tied to a character.
   *
   * @returns {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._api);
    }
    return this._search;
  }

  /**
   * Query names of a given set of `ids`. These ids can be of mixed types, and
   * each entry has its category reported. This makes an HTTP POST request to
   * [`/universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
   *
   * The request is returned as an asynchronous Promise that resolves to an object
   * parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "id": 95465499,
   *     "name": "CCP Bartender",
   *     "category": "character"
   *   },
   *   {
   *     "id": 30000142,
   *     "name": "Jita",
   *     "category": "solar_system"
   *   }
   * ]
   * ```
   *
   * @param ids {Array.<Number>} Ids to look up
   * @returns {Promise}
   * @private
   */
  names(ids) {
    return this._api.universe()
    .newRequest('postUniverseNames', [{ ids: ids }]);
  }
}

module.exports = Api;
