import { ESIAgent } from '../../internal/esi-agent';

import { SchematicAPIFactory, makeSchematicAPIFactory } from './schematics';
import {
  OpportunitiesAPIFactory,
  makeOpportunitiesAPIFactory
} from './opportunities';
import { DogmaAPIFactory, makeDogmaAPIFactory } from './dogma';
import { TypeAPIFactory, makeTypeAPIFactory } from './types';
import { GroupAPIFactory, makeGroupAPIFactory } from './groups';
import { CategoryAPIFactory, makeCategoryAPIFactory } from './categories';
import {
  MarketGroupAPIFactory,
  makeMarketGroupAPIFactory
} from './market-groups';
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
export interface SchemaAPIFactory {
  readonly schematics: SchematicAPIFactory;
  readonly dogma: DogmaAPIFactory;
  readonly opportunities: OpportunitiesAPIFactory;
  readonly types: TypeAPIFactory;
  readonly groups: GroupAPIFactory;
  readonly categories: CategoryAPIFactory;
  readonly marketGroups: MarketGroupAPIFactory;
  readonly insurance: Insurance;
}

/**
 * Create a new SchemaFactory instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns An SchemaFactory API instance
 */
export function makeSchemaAPIFactory(agent: ESIAgent) {
  return {
    schematics: makeSchematicAPIFactory(agent),
    dogma: makeDogmaAPIFactory(agent),
    opportunities: makeOpportunitiesAPIFactory(agent),
    types: makeTypeAPIFactory(agent),
    groups: makeGroupAPIFactory(agent),
    categories: makeCategoryAPIFactory(agent),
    marketGroups: makeMarketGroupAPIFactory(agent),
    insurance: new Insurance(agent)
  };
}
