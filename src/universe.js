/**
 * A container for the [universe](https://esi.tech.ccp.is/latest/#/Universe)
 * ESI endpoints. You should not require this module directly, as it technically
 * returns a factory function that requires an internal API. Instead an instance
 * is automatically exposed when the 
 * {@link module:eve_swagger_interface} is loaded and configured.
 *
 * @see https://esi.tech.ccp.is/latest/#/Universe
 * @see https://esi.tech.ccp.is/latest/#/Planetary_Interaction
 * @param api The internal API instance configured by the root module
 * @module universe
 */
 module.exports = function(api) {
    var newRequest = api.newRequest;
    var ESI = api.esi;

    var exports = {};

    /**
     * Get all structures in the universe from the ESI endpoint. This makes an
     * HTTP GET request to [`/universe/structures/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_structures).
     * The request is returned as an asynchronous Promise that resolves to 
     * an array parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   1000000017013,
     *   1000000025062
     * ]
     * ```
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Universe/get_universe_structures
     * @esi_link UniverseApi.getUniverseStructures
     */
    exports.getStructures = function() {
        return newRequest(ESI.UniverseApi, 'getUniverseStructures', []);
    };

    /**
     * Get structure public info from the ESI endpoint. This makes an
     * HTTP GET request to [`/universe/structures/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_structures_structure_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * {
     *   "name": "V-3YG7 VI - The Capital",
     *   "solar_system_id": 30000142
     * }
     * ```
     * @param {Integer} id The structure id to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Universe/get_universe_structures_structure_id
     * @esi_link UniverseApi.getUniverseStructuresStructureId
     */
    exports.getStructure = function(id) {
        return newRequest(ESI.UniverseApi, 'getUniverseStructuresStructureId', [id]);
    };

    /**
     * Get station public info from the ESI endpoint. This makes an
     * HTTP GET request to [`/universe/stations/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_stations_station_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * {
     *   "solar_system_id": 30000142,
     *   "station_name": "Jita IV Moon IV - Caldari Navy Assembly Plant"
     * }
     * ```
     * @param {Integer} id The station id to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Universe/get_universe_stations_station_id
     * @esi_link UniverseApi.getUniverseStationsStationId
     */
    exports.getStation = function(id) {
        return newRequest(ESI.UniverseApi, 'getUniverseStationsStationId', [id]);
    };

    /**
     * Get solar system public info from the ESI endpoint. This makes an
     * HTTP GET request to [`/universe/systems/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_systems_system_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * {
     *   "solar_system_name": "Jita"
     * }
     * ```
     * @param {Integer} id The solar system id to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Universe/get_universe_systems_system_id
     * @esi_link UniverseApi.getUniverseSystemsSystemId
     */
    exports.getSystem = function(id) {
        return newRequest(ESI.UniverseApi, 'getUniverseSystemsSystemId', [id]);
    };

    /**
     * Get a type's public info from the ESI endpoint. This makes an
     * HTTP GET request to [`/universe/types/{id}/`](https://esi.tech.ccp.is/latest/#!/Universe/get_universe_types_type_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * {
     *   "category_id": 6,
     *   "graphic_id": 46,
     *   "group_id": 25,
     *   "type_description": "The Rifter is a very powerful combat frigate and can easily tackle the best frigates out there. It has gone through many radical design phases since its inauguration during the Minmatar Rebellion. The Rifter has a wide variety of offensive capabilities, making it an unpredictable and deadly adversary.",
     *   "type_name": "Rifter"
     * }
     * ```
     * @param {Integer} id The type id to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Universe/get_universe_types_type_id
     * @esi_link UniverseApi.getUniverseTypesTypeId
     */
    exports.getType = function(id) {
        return newRequest(ESI.UniverseApi, 'getUniverseTypesTypeId', [id]);
    };

    /**
     * Get a planetary interaction schematic's public info from the ESI 
     * endpoint. This makes an HTTP GET request to 
     * [`/universe/schematics/{id}/`](https://esi.tech.ccp.is/latest/#!/Planetary_Interaction/get_universe_schematics_schematic_id).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * {
     *   "cycle_time": 1800,
     *   "schematic_name": "Bacteria"
     * }
     * ```
     * @param {Integer} id The schematic id to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Planetary_Interaction/get_universe_schematics_schematic_id
     * @esi_link PlanetaryInteractionApi.getUniverseSchematicsSchematicId
     */
    exports.getSchematic = function(id) {
        return newRequest(ESI.PlanetaryInteractionApi, 
                          'getUniverseSchematicsSchematicId', [id]);
    };

    /**
     * Look up the name and type of the list of ids the ESI endpoint. The ids 
     * can correspond to characters, corporations, alliances, stations, solar 
     * systems, constellations, regions, and types. This makes an
     * HTTP POST request to [`/universe/names/`](https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names).
     * The request is returned as an asynchronous Promise that resolves to 
     * an object parsed from the response JSON model. An example value looks 
     * like:
     * ```
     * [
     *   {
     *     "category": "character",
     *     "id": 95465499,
     *     "name": "CCP Bartender"
     *   },
     *   {
     *     "category": "solar_system",
     *     "id": 30000142,
     *     "name": "Jita"
     *   }
     * ]
     * ```
     * @param {Array.<Integer>} id The ids to look up
     * @return {external:Promise} A Promise that resolves to the response of
     *   the request
     * @see https://esi.tech.ccp.is/latest/#!/Universe/post_universe_names
     * @esi_link UniverseApi.postUniverseNames
     */
    exports.getNamesOf = function(ids) {
        return newRequest(ESI.UniverseApi, 'postUniverseNames', [ids]);
    };

    return exports;
};
