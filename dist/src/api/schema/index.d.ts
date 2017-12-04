import { ESIAgent } from '../../internal/esi-agent';
import { Schematics } from './schematics';
import { Opportunities } from './opportunities';
import { Graphics } from './graphics';
import { Dogma } from './dogma';
import { Types } from './types';
import { Groups } from './groups';
import { Categories } from './categories';
import { MarketGroups } from './market-groups';
import { Insurance } from './insurance';
/**
 * A simple wrapper around functional interfaces for getting APIs for types,
 * groups, categories, PI schematics, opportunities, dogma, etc., which use a
 * range of end points in ESI, but mostly in:
 *
 * - [universe](https://esi.tech.ccp.is/latest/#/Universe)
 * - [dogma](https://esi.tech.ccp.is/latest/#/Dogma)
 * - [opportunities](https://esi.tech.ccp.is/latest/#/Opportunities)
 * - [planetary
 * interaction](https://esi.tech.ccp.is/latest/#/Planetary_Interaction)
 * - [market](https://esi.tech.ccp.is/latest/#/Market)
 */
export declare class Schema {
    private agent;
    private schematics_?;
    private dogma_?;
    private opportunities_?;
    private types_?;
    private groups_?;
    private categories_?;
    private marketGroups_?;
    private graphics_?;
    private insurance_?;
    constructor(agent: ESIAgent);
    readonly schematics: Schematics;
    readonly dogma: Dogma;
    readonly opportunities: Opportunities;
    readonly types: Types;
    readonly groups: Groups;
    readonly categories: Categories;
    readonly marketGroups: MarketGroups;
    readonly graphics: Graphics;
    readonly insurance: Insurance;
}
