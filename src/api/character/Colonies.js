const ExtendableFunction = require('../../internal/ExtendableFunction');

/**
 * An api adapter over the end points handling the planetary interaction
 * colonies for a character via functions in the [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction) ESI
 * endpoints. You should not usually instantiate this directly as its
 * constructor requires an internal api instance.
 *
 * This is a function class so instances of `Colonies` are functions and can be
 * invoked directly, besides accessing its members. Its default function action
 * is equivalent to {@link Colonies#layout layout} or {@link Colonies#all all}
 * if no id is given.
 */
class Colonies extends ExtendableFunction {
  /**
   * Create a new Colonies function for the character, including its SSO token.
   *
   * @param api {ApiProvider} The api provider
   * @param characterId {Number} The id of the character whose PI is accessed
   * @param token {String} The SSO access token for the character
   * @constructor
   */
  constructor(api, characterId, token) {
    super(id => (id ? this.layout(id) : this.all()));
    this._api = api;
    this._id = characterId;
    this._token = token;
  }

  /**
   * Get the full layout of a planetary colony owned by the character from the
   * ESI endpoint. This makes an HTTP GET request to
   * [`characters/{characterId}/planets/{planetId}`](https://esi.tech.ccp.is/latest/#!/Planetary_Interaction/get_characters_character_id_planets_planet_id).
   * The request is returned as an asynchronous Promise that resolves to an
   * object parsed from the response JSON model. An example value looks like:
   *
   * ```
   * {
   *   "links": [
   *     {
   *       "destination_pin_id": 1000000017022,
   *       "link_level": 0,
   *       "source_pin_id": 1000000017021
   *     }
   *   ],
   *   "pins": [
   *     {
   *       "is_running": true,
   *       "latitude": 1.55087844973,
   *       "longitude": 0.717145933308,
   *       "pin_id": 1000000017021,
   *       "type_id": 2254
   *     },
   *     {
   *       "is_running": true,
   *       "latitude": 1.53360639935,
   *       "longitude": 0.709775584394,
   *       "pin_id": 1000000017022,
   *       "type_id": 2256
   *     }
   *   ],
   *   "routes": [
   *     {
   *       "content_type_id": 2393,
   *       "destination_pin_id": 1000000017030,
   *       "quantity": 20,
   *       "route_id": 4,
   *       "source_pin_id": 1000000017029
   *     }
   *   ]
   * }
   * ```
   *
   * @param {Number} planetId The planet id to query
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link PlanetaryInteractionApi.getCharactersCharacterIdPlanetsPlanetId
   */
  layout(planetId) {
    return this._api.planetaryInteraction(this._token)
    .newRequest('getCharactersCharacterIdPlanetsPlanetId',
        [this._id, planetId]);
  }

  /**
   * Get a list of all planetary colonies owned by the character from the ESI
   * endpoint. This makes an HTTP GET request to
   * [`characters/{id}/planets/`](https://esi.tech.ccp.is/latest/#!/Planetary_Interaction/get_characters_character_id_planets).
   * The request is returned as an asynchronous Promise that resolves to an
   * array parsed from the response JSON model. An example value looks like:
   *
   * ```
   * [
   *   {
   *     "last_update": "2016-11-28T16:42:51Z",
   *     "num_pins": 1,
   *     "owner_id": 90000001,
   *     "planet_id": 40023691,
   *     "planet_type": "plasma",
   *     "solar_system_id": 30000379,
   *     "upgrade_level": 0
   *   },
   *   {
   *     "last_update": "2016-11-28T16:41:54Z",
   *     "num_pins": 1,
   *     "owner_id": 90000001,
   *     "planet_id": 40023697,
   *     "planet_type": "barren",
   *     "solar_system_id": 30000379,
   *     "upgrade_level": 0
   *   }
   * ]
   * ```
   *
   * @return {Promise} A Promise that resolves to the response of the request
   * @esi_link PlanetaryInteractionApi.getCharactersCharacterIdPlanets
   */
  all() {
    return this._api.planetaryInteraction(this._token)
    .newRequest('getCharactersCharacterIdPlanets', [this._id]);
  }
}

module.exports = Colonies;
