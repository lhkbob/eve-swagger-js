const ESIAgent = require('./internal/esi-agent');
const CallableInstance = require('./internal/callable-instance');
const _names = require('./internal/names');

const Characters = require('./api/character/characters');

const Agents = require('./api/universe/agents');
const Bloodlines = require('./api/universe/bloodlines');
const Constellations = require('./api/universe/constellations');
const Factions = require('./api/universe/factions');
const Freeports = require('./api/universe/freeports');
const Industry = require('./api/universe/industry');
const Insurance = require('./api/universe/insurance');
const Moons = require('./api/universe/moons');
const Planets = require('./api/universe/planets');
const PlanetaryInteraction = require('./api/universe/planetary-interaction');
const Races = require('./api/universe/races');
const Regions = require('./api/universe/regions');
const SolarSystems = require('./api/universe/solar-systems');
const Stargates = require('./api/universe/stargates');
const Stations = require('./api/universe/stations');
const Types = require('./api/universe/types');
const Wormholes = require('./api/universe/wormholes');

const Alliances = require('./api/alliances');
const Corporations = require('./api/corporations');
const Incursions = require('./api/incursions');
const Killmail = require('./api/killmail');
const Search = require('./api/search');
const Sovereignty = require('./api/sovereignty');
const Wars = require('./api/wars');

/**
 * API creates a shared, internal ApiProvider and then lazily instantiates all
 * specific modules as needed. The API instance is also a function that can
 * be invoked to create a new API instance with a different configuration.
 *
 * @see https://esi.tech.ccp.is/latest
 */
class API extends CallableInstance {
  /**
   * Create a new API with the given configuration provided in a single
   * object map. If no argument is provided, the defaults are used.
   *
   * @param service {String} URL to the ESI service, defaults to
   *     `'https://esi.tech.ccp.is/latest'`.
   * @param source {String} Data source used, defaults to `tranquility`.
   * @param agent {String} Custom user agent string to send with each request,
   *     which defaults to this project but really should be set for your app
   * @param language {String} Language character code, defaults to `en-us`
   * @param timeout {Number} Request timeout in milliseconds, defaults to
   *     `6000`
   * @param maxConcurrent {Number} Maximum number of requests running at once,
   *     defaults to 0 (unlimited)
   * @param minTime {Number} Minimum time before launching another request (in
   *     milliseconds), defaults to 0 (no rate limiting)
   * @constructor
   */
  constructor({
      service: service = 'https://esi.tech.ccp.is/latest', source: source = 'tranquility', agent: agent = 'eve-swagger-js / https://github.com/lhkbob/eve-swagger-js', language: language = 'en-us', timeout: timeout = 6000, maxConcurrent: maxConcurrent = 0, minTime: minTime = 0
  } = {}) {
    super(config => new API(config));
    this._esiAgent = new ESIAgent({
      service,
      source,
      agent,
      language,
      timeout,
      maxConcurrent,
      minTime
    });

    this._char = null;

    this._agent = null;
    this._blood = null;
    this._const = null;
    this._faction = null;
    this._freeport = null;
    this._gate = null;
    this._indy = null;
    this._insurance = null;
    this._moon = null;
    this._pi = null;
    this._planet = null;
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
   * the API's initialization options.
   *
   * @type {Characters}
   */
  get characters() {
    if (!this._char) {
      this._char = new Characters(this._esiAgent);
    }
    return this._char;
  }

  /**
   * An instance of Agents using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Agents}
   */
  get agents() {
    if (!this._agent) {
      this._agent = new Agents(this._esiAgent);
    }
    return this._agent;
  }

  /**
   * An instance of Bloodlines using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Bloodlines}
   */
  get bloodlines() {
    if (!this._blood) {
      this._blood = new Bloodlines(this._esiAgent);
    }
    return this._blood;
  }

  /**
   * An instance of Constellations using a shared ApiProvider configured based
   * on the API's initialization options.
   *
   * @type {Constellations}
   */
  get constellations() {
    if (!this._const) {
      this._const = new Constellations(this._esiAgent);
    }
    return this._const;
  }

  /**
   * An instance of Factions using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Factions}
   */
  get factions() {
    if (!this._faction) {
      this._faction = new Factions(this._esiAgent);
    }
    return this._faction;
  }

  /**
   * An instance of Freeports using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Freeports}
   */
  get freeports() {
    if (!this._freeport) {
      this._freeport = new Freeports(this._esiAgent);
    }
    return this._freeport;
  }

  /**
   * An instance of Industry using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Industry}
   */
  get industry() {
    if (!this._indy) {
      this._indy = new Industry(this._esiAgent);
    }
    return this._indy;
  }

  /**
   * An instance of Insurance using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Insurance}
   */
  get insurance() {
    if (!this._insurance) {
      this._insurance = new Insurance(this._esiAgent);
    }
    return this._insurance;
  }

  /**
   * An instance of Moons using a shared ApiProvider configured based
   * on the API's initialization options.
   *
   * @type {Moons}
   */
  get moons() {
    if (!this._moon) {
      this._moon = new Moons(this._esiAgent);
    }
    return this._moon;
  }

  /**
   * An instance of Planets using a shared ApiProvider configured based
   * on the API's initialization options.
   *
   * @type {Planets}
   */
  get planets() {
    if (!this._planet) {
      this._planet = new Planets(this._esiAgent);
    }
    return this._planet;
  }

  /**
   * An instance of PlanetaryInteraction using a shared ApiProvider configured
   * based on the API's initialization options.
   *
   * @type {PlanetaryInteraction}
   */
  get pi() {
    if (!this._pi) {
      this._pi = new PlanetaryInteraction(this._esiAgent);
    }
    return this._pi;
  }

  /**
   * An instance of Races using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Races}
   */
  get races() {
    if (!this._race) {
      this._race = new Races(this._esiAgent);
    }
    return this._race;
  }

  /**
   * An instance of Regions using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Regions}
   */
  get regions() {
    if (!this._region) {
      this._region = new Regions(this._esiAgent);
    }
    return this._region;
  }

  /**
   * An instance of SolarSystems using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {SolarSystems}
   */
  get solarSystems() {
    if (!this._system) {
      this._system = new SolarSystems(this._esiAgent);
    }
    return this._system;
  }

  /**
   * An instance of Stargates using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Stargates}
   */
  get stargates() {
    if (!this._gate) {
      this._gate = new Stargates(this._esiAgent);
    }
    return this._gate;
  }

  /**
   * An instance of Stations using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Stations}
   */
  get stations() {
    if (!this._station) {
      this._station = new Stations(this._esiAgent);
    }
    return this._station;
  }

  /**
   * An instance of Types using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Types}
   */
  get types() {
    if (!this._type) {
      this._type = new Types(this._esiAgent);
    }
    return this._type;
  }

  /**
   * An instance of Wormholes using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Wormholes}
   */
  get wormholes() {
    if (!this._worm) {
      this._worm = new Wormholes(this._esiAgent);
    }
    return this._worm;
  }

  /**
   * An instance of Alliances using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Alliances}
   */
  get alliances() {
    if (!this._alliance) {
      this._alliance = new Alliances(this._esiAgent);
    }
    return this._alliance;
  }

  /**
   * An instance of Corporations using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Corporations}
   */
  get corporations() {
    if (!this._corp) {
      this._corp = new Corporations(this._esiAgent);
    }
    return this._corp;
  }

  /**
   * An instance of Incursions using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Incursions}
   */
  get incursions() {
    if (!this._incursion) {
      this._incursion = new Incursions(this._esiAgent);
    }
    return this._incursion;
  }

  /**
   * An instance of Killmail using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Killmail}
   */
  get killmail() {
    if (!this._km) {
      this._km = new Killmail(this._esiAgent);
    }
    return this._km;
  }

  /**
   * An instance of Sovereignty using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Sovereignty}
   */
  get sovereignty() {
    if (!this._sov) {
      this._sov = new Sovereignty(this._esiAgent);
    }
    return this._sov;
  }

  /**
   * An instance of Wars using a shared ApiProvider configured based on
   * the API's initialization options.
   *
   * @type {Wars}
   */
  get wars() {
    if (!this._wars) {
      this._wars = new Wars(this._esiAgent);
    }
    return this._wars;
  }

  /**
   * An instance of Search using a shared ApiProvider configured based on
   * the API's initialization options. This Search instance is configured to
   * use all categories and is not tied to a character.
   *
   * @type {Search}
   */
  get search() {
    if (!this._search) {
      this._search = new Search(this._esiAgent);
    }
    return this._search;
  }

  /**
   * @esi_route post_universe_names
   *
   * If ids is longer than the reported maximum length for ESI, the array will
   * be split into smaller chunks and multiple requests will be made and then
   * concatenated back together.
   *
   * @esi_example esi.names(ids)
   *
   * @param ids {Array.<Number>}
   * @returns {Promise.<Array.<Object>>}
   */
  names(ids) {
    return _names(this._esiAgent, 'all', ids);
  }
}

module.exports = API;
