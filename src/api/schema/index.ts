import { ESIAgent } from '../../internal/esi-agent';

import { Schematics, makeSchematics } from './schematics';
import {
  Opportunities
} from './opportunities';
import { Graphics, makeGraphics} from './graphics';
import { Dogma } from './dogma';
import { Types, makeTypes} from './types';
import { Groups, makeGroups } from './groups';
import { Categories, makeCategories } from './categories';
import {
  MarketGroups,
  makeMarketGroups
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
export class Schema {
  private schematics_?:Schematics;
  private dogma_?:Dogma;
  private opportunities_?:Opportunities;
  private types_?:Types;
  private groups_?:Groups;
  private categories_?:Categories;
  private marketGroups_?:MarketGroups;
  private graphics_?:Graphics;
  private insurance_?:Insurance;
  
  constructor(private agent:ESIAgent) { }
  
  get schematics() : Schematics {
    if (this.schematics_ === undefined) {
      this.schematics_ = makeSchematics(this.agent);
    }
    return this.schematics_;
  }

  get dogma() : Dogma {
    if (this.dogma_ === undefined) {
      this.dogma_ = new Dogma(this.agent);
    }
    return this.dogma_;
  }

  get opportunities() : Opportunities {
    if (this.opportunities_ === undefined) {
      this.opportunities_ = new Opportunities(this.agent);
    }
    return this.opportunities_;
  }

  get types() : Types {
    if (this.types_ === undefined) {
      this.types_ = makeTypes(this.agent);
    }
    return this.types_;
  }

  get groups() : Groups {
    if (this.groups_ === undefined) {
      this.groups_ = makeGroups(this.agent);
    }
    return this.groups_;
  }

  get categories() : Categories {
    if (this.categories_ === undefined) {
      this.categories_ = makeCategories(this.agent);
    }
    return this.categories_;
  }

  get marketGroups() : MarketGroups {
    if (this.marketGroups_ === undefined) {
      this.marketGroups_ = makeMarketGroups(this.agent);
    }
    return this.marketGroups_;
  }

  get graphics() : Graphics {
    if (this.graphics_ === undefined) {
      this.graphics_ = makeGraphics(this.agent);
    }
    return this.graphics_;
  }

  get insurance() : Insurance {
    if (this.insurance_ === undefined) {
      this.insurance_ = new Insurance(this.agent);
    }
    return this.insurance_;
  }
}
