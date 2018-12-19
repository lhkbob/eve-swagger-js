import { Configuration } from './internal/esi-agent';
import { Responses } from '../gen/esi';
import { Agents } from './api/universe/agents';
import { Bloodlines } from './api/universe/bloodlines';
import { Constellations } from './api/universe/constellations';
import { Dogma } from './api/universe/dogma';
import { Factions } from './api/universe/factions';
import { Freeports } from './api/universe/freeports';
import { Graphics } from './api/universe/graphics';
import { Industry } from './api/universe/industry';
import { Insurance } from './api/universe/insurance';
import { Moons } from './api/universe/moons';
import { Opportunities } from './api/universe/opportunities';
import { Planets } from './api/universe/planets';
import { PlanetaryInteraction } from './api/universe/planetary-interaction';
import { Races } from './api/universe/races';
import { Regions } from './api/universe/regions';
import { SolarSystems } from './api/universe/solar-systems';
import { Stargates } from './api/universe/stargates';
import { Stations } from './api/universe/stations';
import { Types } from './api/universe/types';
import { Wormholes } from './api/universe/wormholes';
import { Alliances } from './api/alliances';
import { Corporations } from './api/corporations';
import { Incursions } from './api/incursions';
import { Killmail } from './api/killmail';
import { Sovereignty } from './api/sovereignty';
import { Wars } from './api/wars';
import { Characters } from './api/character/characters';
/**
 * API creates a shared, internal ESIAgent and then lazily instantiates all
 * specific modules as needed. The API instance is also a function that can
 * be invoked to create a new API instance with a different configuration.
 *
 * @see https://esi.evetech.net/latest
 */
export interface API {
    /**
     * An instance of Characters using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    characters: Characters;
    /**
     * An instance of Agents using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    agents: Agents;
    /**
     * An instance of Bloodlines using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    bloodlines: Bloodlines;
    /**
     * An instance of Constellations using a shared ESIAgent configured based
     * on the API's initialization options.
     */
    constellations: Constellations;
    /**
     * An instance of Dogma using a shared ESIAgent configured based
     * on the API's initialization options.
     */
    dogma: Dogma;
    /**
     * An instance of Factions using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    factions: Factions;
    /**
     * An instance of Freeports using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    freeports: Freeports;
    /**
     * An instance of Graphics using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    graphics: Graphics;
    /**
     * An instance of Industry using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    industry: Industry;
    /**
     * An instance of Insurance using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    insurance: Insurance;
    /**
     * An instance of Moons using a shared ESIAgent configured based
     * on the API's initialization options.
     */
    moons: Moons;
    /**
     * An instance of Opportunities using a shared ESIAgent configured based
     * on the API's initialization options.
     */
    opportunities: Opportunities;
    /**
     * An instance of Planets using a shared ESIAgent configured based
     * on the API's initialization options.
     */
    planets: Planets;
    /**
     * An instance of PlanetaryInteraction using a shared ESIAgent configured
     * based on the API's initialization options.
     */
    pi: PlanetaryInteraction;
    /**
     * An instance of Races using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    races: Races;
    /**
     * An instance of Regions using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    regions: Regions;
    /**
     * An instance of SolarSystems using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    solarSystems: SolarSystems;
    /**
     * An instance of Stargates using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    stargates: Stargates;
    /**
     * An instance of Stations using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    stations: Stations;
    /**
     * An instance of Types using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    types: Types;
    /**
     * An instance of Wormholes using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    wormholes: Wormholes;
    /**
     * An instance of Alliances using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    alliances: Alliances;
    /**
     * An instance of Corporations using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    corporations: Corporations;
    /**
     * An instance of Incursions using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    incursions: Incursions;
    /**
     * An instance of Killmail using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    killmail: Killmail;
    /**
     * An instance of Sovereignty using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    sovereignty: Sovereignty;
    /**
     * An instance of Wars using a shared ESIAgent configured based on
     * the API's initialization options.
     */
    wars: Wars;
    /**
     * @esi_example esi.search('text')
     *
     * @param text The text to search all entities and types for
     * @param strict Whether or not the search should be strict, defaults to false
     * @returns All matches and their corresponding categories
     */
    search(text: string, strict?: boolean): Promise<Responses['get_search']>;
    /**
     * If ids is longer than the reported maximum length for ESI, the array will
     * be split into smaller chunks and multiple requests will be made and then
     * concatenated back together.
     *
     * @esi_example esi.names(ids)
     *
     * @param ids The ids to lookup
     * @returns The resolved names and detected categories
     */
    names(ids: number[]): Promise<Responses['post_universe_names']>;
    /**
     * @esi_example esi.status()
     *
     * @returns The status of the Eve servers
     */
    status(): Promise<Responses['get_status']>;
}
/**
 * The default configuration that specifies values for parameters that aren't
 * explicitly given when {@link makeAPI} is called.
 */
export declare const DEFAULT_CONFIG: Configuration;
/**
 * Create a new API with the given configuration provided in a single
 * object map. Any parameter that is not provided will use the default value
 * in {@link DEFAULT_CONFIG}.
 *
 * It is strongly recommended that a custom user agent be provided.
 *
 * @param config The configuration for the API
 * @returns The API instance
 */
export declare function makeAPI(config?: Partial<Configuration>): API;
