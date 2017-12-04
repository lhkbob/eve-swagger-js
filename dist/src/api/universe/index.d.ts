import { ESIAgent } from '../../internal/esi-agent';
import { Races } from './races';
import { Bloodlines } from './bloodlines';
import { Stars } from './stars';
import { Planets } from './planets';
import { Moons } from './moons';
import { Stargates } from './stargates';
import { Regions } from './regions';
import { Constellations } from './constellations';
import { Stations } from './stations';
import { SolarSystems } from './solar-systems';
import { Responses } from '../../esi';
/**
 * A simple wrapper around functional interfaces for getting APIs for regions,
 * solar systems, constellations, races, bloodlines, etc.
 *
 * - [universe](https://esi.tech.ccp.is/latest/#/Universe)
 * - [industry](https://esi.tech.ccp.is/latest/#/Industry)
 * - [incursions](https://esi.tech.ccp.is/latest/#/Incursions)
 * - [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty)
 * - [market](https://esi.tech.ccp.is/latest/#/Market)
 */
export declare class Universe {
    private agent;
    private races_?;
    private bloodlines_?;
    private stars_?;
    private planets_?;
    private moons_?;
    private stargates_?;
    private regions_?;
    private constellations_?;
    private stations_?;
    private solarSystems_?;
    private agents_?;
    private wormholes_?;
    constructor(agent: ESIAgent);
    readonly races: Races;
    readonly bloodlines: Bloodlines;
    readonly stars: Stars;
    readonly planets: Planets;
    readonly moons: Moons;
    readonly stargates: Stargates;
    readonly regions: Regions;
    readonly constellations: Constellations;
    readonly stations: Stations;
    readonly solarSystems: SolarSystems;
    /**
     * @returns All player-created freeport citadels
     */
    freeports(): Promise<Responses['get_universe_structures']>;
    /**
     * @esi_route get_search [agent]
     *
     * @param query Search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns Agent ids matching the search terms
     */
    agents(query: string, strict?: boolean): Promise<number[]>;
    /**
     * @esi_route get_search [wormhole]
     *
     * @param query Search terms
     * @param strict Whether or not the search is strict, defaults to false
     * @returns Wormhole ids matching the search terms
     */
    wormholes(query: string, strict?: boolean): Promise<number[]>;
    /**
     * @returns Details on all active incursions in the universe
     */
    incursions(): Promise<Responses['get_incursions']>;
}
