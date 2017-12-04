"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schematics_1 = require("./schematics");
const opportunities_1 = require("./opportunities");
const graphics_1 = require("./graphics");
const dogma_1 = require("./dogma");
const types_1 = require("./types");
const groups_1 = require("./groups");
const categories_1 = require("./categories");
const market_groups_1 = require("./market-groups");
const insurance_1 = require("./insurance");
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
class Schema {
    constructor(agent) {
        this.agent = agent;
    }
    get schematics() {
        if (this.schematics_ === undefined) {
            this.schematics_ = schematics_1.makeSchematics(this.agent);
        }
        return this.schematics_;
    }
    get dogma() {
        if (this.dogma_ === undefined) {
            this.dogma_ = new dogma_1.Dogma(this.agent);
        }
        return this.dogma_;
    }
    get opportunities() {
        if (this.opportunities_ === undefined) {
            this.opportunities_ = new opportunities_1.Opportunities(this.agent);
        }
        return this.opportunities_;
    }
    get types() {
        if (this.types_ === undefined) {
            this.types_ = types_1.makeTypes(this.agent);
        }
        return this.types_;
    }
    get groups() {
        if (this.groups_ === undefined) {
            this.groups_ = groups_1.makeGroups(this.agent);
        }
        return this.groups_;
    }
    get categories() {
        if (this.categories_ === undefined) {
            this.categories_ = categories_1.makeCategories(this.agent);
        }
        return this.categories_;
    }
    get marketGroups() {
        if (this.marketGroups_ === undefined) {
            this.marketGroups_ = market_groups_1.makeMarketGroups(this.agent);
        }
        return this.marketGroups_;
    }
    get graphics() {
        if (this.graphics_ === undefined) {
            this.graphics_ = graphics_1.makeGraphics(this.agent);
        }
        return this.graphics_;
    }
    get insurance() {
        if (this.insurance_ === undefined) {
            this.insurance_ = new insurance_1.Insurance(this.agent);
        }
        return this.insurance_;
    }
}
exports.Schema = Schema;
//# sourceMappingURL=index.js.map