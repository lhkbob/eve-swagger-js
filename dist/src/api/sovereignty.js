"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../internal/resource-api");
/**
 * An api adapter for accessing various details of a single in-game campaign,
 * specified by a provided id when the api is instantiated.
 */
class Campaign extends r.impl.SimpleResource {
    constructor(agent, id) {
        super(id);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_campaigns
     *
     * @returns Information about the campaign
     */
    details() {
        return getCampaigns(this.agent)
            .then(all => r.impl.filterArray(all, this.id_, r => r.campaign_id));
    }
}
exports.Campaign = Campaign;
/**
 * An api adapter for accessing various details of multiple campaign ids,
 * specified by a provided an array or set of ids when the api is instantiated.
 */
class MappedCampaigns extends r.impl.SimpleMappedResource {
    constructor(agent, ids) {
        super(ids);
        this.agent = agent;
    }
    /**
     * @esi_route ~get_universe_campaigns
     *
     * @returns Campaign details mapped by campaign id
     */
    details() {
        return this.arrayIDs().then(ids => {
            return getCampaigns(this.agent)
                .then(all => r.impl.filterArrayToMap(all, ids, r => r.campaign_id));
        });
    }
}
exports.MappedCampaigns = MappedCampaigns;
/**
 * An api adapter for accessing various details about every campaign in the
 * game.
 */
class IteratedCampaigns extends r.impl.SimpleIteratedResource {
    constructor(agent) {
        super(r.impl.makeArrayStreamer(() => agent.request('get_sovereignty_campaigns', undefined)), r => r.campaign_id);
        this.agent = agent;
    }
    /**
     * @esi_route get_universe_campaigns
     *
     * @returns Iterator over details of all in-game types
     */
    details() {
        return this.getPaginatedResource();
    }
}
exports.IteratedCampaigns = IteratedCampaigns;
/**
 * A simple wrapper around functional interfaces for getting APIs for campaigns,
 * sovereignty structures, and the sovereignty map. The sovereignty map is also
 * accessible through the solar system apis. These utilize the
 * [sovereignty](https://esi.tech.ccp.is/latest/#/Sovereignty) ESI end points.
 */
class Sovereignty {
    constructor(agent) {
        this.agent = agent;
    }
    get campaigns() {
        if (this.campaigns_ === undefined) {
            this.campaigns_ = makeCampaigns(this.agent);
        }
        return this.campaigns_;
    }
    /**
     * @returns Information on all structures involved in sovereignty
     *    conflicts
     */
    structures() {
        return this.agent.request('get_sovereignty_structures', undefined);
    }
    /**
     * @returns The complete sovereignty map
     */
    map() {
        return this.agent.request('get_sovereignty_map', undefined);
    }
}
exports.Sovereignty = Sovereignty;
function makeCampaigns(agent) {
    return function (ids) {
        if (ids === undefined) {
            // All types since no id
            return new IteratedCampaigns(agent);
        }
        else if (typeof ids === 'number') {
            // Single id so single API
            return new Campaign(agent, ids);
        }
        else {
            // Set or array, so mapped API
            return new MappedCampaigns(agent, ids);
        }
    };
}
function getCampaigns(agent) {
    return agent.request('get_sovereignty_campaigns', undefined);
}
//# sourceMappingURL=sovereignty.js.map