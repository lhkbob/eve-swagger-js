"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
const corporations_1 = require("./corporations");
const killmails_1 = require("../killmails");
const structures_1 = require("../structures");
const assets_1 = require("./assets");
const wallets_1 = require("./wallets");
const starbases_1 = require("./starbases");
const mining_1 = require("./mining");
const members_1 = require("./members");
/**
 * An api adapter for accessing various details of a single corporation,
 * specified by a provided id when the api is instantiated.
 *
 * This API is authenticated by an SSO token corresponding to a member. Some
 * functions that are exposed expect the member to have specific in-game roles.
 * If these permissions are not met when a request is made to ESI, then it will
 * respond with an error.
 */
class AuthenticatedCorporation {
    constructor(agent, ssoToken, id, charID) {
        this.charID = charID;
        this.agent = {
            agent, ssoToken, id
        };
    }
    get structures() {
        if (this.structures_ === undefined) {
            this.structures_ = structures_1.makeStructures(this.agent.agent, this.agent.ssoToken, this.charID, this.agent.id);
        }
        return this.structures_;
    }
    get members() {
        if (this.members_ === undefined) {
            this.members_ = members_1.makeMembers(this.agent);
        }
        return this.members_;
    }
    get kills() {
        if (this.kills_ === undefined) {
            this.kills_ = new killmails_1.IteratedKillmails(this.agent.agent, r.impl.makeMaxIDStreamer(maxID => this.getKillsPage(maxID), e => e.killmail_id, 1000));
        }
        return this.kills_;
    }
    getKillsPage(maxID) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_killmails_recent', { path: { corporation_id: corpID }, query: { max_kill_id: maxID } }, this.agent.ssoToken));
    }
    get assets() {
        if (this.assets_ === undefined) {
            this.assets_ = assets_1.makeAssets(this.agent);
        }
        return this.assets_;
    }
    get mining() {
        if (this.mining_ === undefined) {
            this.mining_ = new mining_1.Mining(this.agent);
        }
        return this.mining_;
    }
    get wallets() {
        if (this.wallets_ === undefined) {
            this.wallets_ = new wallets_1.Wallets(this.agent);
        }
        return this.wallets_;
    }
    get starbases() {
        if (this.starbases_ === undefined) {
            this.starbases_ = starbases_1.makeStarbases(this.agent);
        }
        return this.starbases_;
    }
    // FIXME add structures()
    /**
     * @esi_route get_corporations_corporation_id_industry_jobs
     *
     * @param includeCompleted Whether or not to include completed jobs, defaults
     *     to false
     * @returns An iterator over all industry jobs
     */
    industryJobs(includeCompleted = false) {
        if (includeCompleted) {
            if (this.industryJobsCompleted_ === undefined) {
                this.industryJobsCompleted_ = r.impl.makePageBasedStreamer(page => this.getIndustryJobPage(page, true), 1000);
            }
            return this.industryJobsCompleted_();
        }
        else {
            if (this.industryJobs_ === undefined) {
                this.industryJobs_ = r.impl.makePageBasedStreamer(page => this.getIndustryJobPage(page, false), 1000);
            }
            return this.industryJobs_();
        }
    }
    getIndustryJobPage(page, includeCompleted) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_industry_jobs', {
            path: { corporation_id: corpID },
            query: { page: page, include_completed: includeCompleted }
        }, this.agent.ssoToken))
            .then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @returns Available titles and their corresponding roles in the corp
     */
    titles() {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_titles', { path: { corporation_id: corpID } }, this.agent.ssoToken));
    }
    /**
     * @esi_route get_corporations_corporation_id_roles_history
     *
     * @returns The history of role assignments and edits for the corp's members
     */
    rolesHistory() {
        if (this.roleHistory_ === undefined) {
            this.roleHistory_ = r.impl.makePageBasedStreamer(page => this.getRolesHistoryPage(page), 1000);
        }
        return this.roleHistory_();
    }
    getRolesHistoryPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_roles_history', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @esi_route get_corporations_corporation_id_contacts
     *
     * @returns An iterator over all of the contacts for the corporation
     */
    contacts() {
        if (this.contacts_ === undefined) {
            this.contacts_ = r.impl.makePageBasedStreamer(page => this.getContactsPage(page), 1000);
        }
        return this.contacts_();
    }
    getContactsPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_contacts', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @esi_route get_corporations_corporation_id_standings
     *
     * @returns An iterator over all set standings for the corporation
     */
    standings() {
        if (this.standings_ === undefined) {
            this.standings_ = r.impl.makePageBasedStreamer(page => this.getStandingsPage(page), 1000);
        }
        return this.standings_();
    }
    getStandingsPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_standings', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @esi_route get_corporations_corporation_id_shareholders
     * @returns An iterator over all shareholders of the corporation
     */
    shareholders() {
        if (this.shareholders_ === undefined) {
            this.shareholders_ = r.impl.makePageBasedStreamer(page => this.getShareholdersPage(page), 1000);
        }
        return this.shareholders_();
    }
    getShareholdersPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_shareholders', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @returns Information on all of the facilities owned by the corporation
     */
    facilities() {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_facilities', { path: { corporation_id: corpID } }, this.agent.ssoToken));
    }
    /**
     * @esi_route get_corporations_corporation_id_customs_offices
     *
     * @returns An iterator over all customs offices owned by the corporation
     */
    customsOffices() {
        if (this.customsOffices_ === undefined) {
            this.customsOffices_ = r.impl.makePageBasedStreamer(page => this.getCustomsOfficesPage(page), 1000);
        }
        return this.customsOffices_();
    }
    getCustomsOfficesPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_customs_offices', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @esi_route get_corporations_corporation_id_orders
     *
     * @returns An iterator over all active market orders for the corporation
     */
    orders() {
        if (this.orders_ === undefined) {
            this.orders_ = r.impl.makePageBasedStreamer(page => this.getOrdersPage(page), 1000);
        }
        return this.orders_();
    }
    getOrdersPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_orders', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @esi_route get_corporations_corporation_id_medals
     *
     * @returns An iterator over all medals declared by the corporation
     */
    medals() {
        if (this.medals_ === undefined) {
            this.medals_ = r.impl.makePageBasedStreamer(page => this.getMedalsPage(page), 1000);
        }
        return this.medals_();
    }
    getMedalsPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_medals', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken))
            .then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @esi_route get_corporations_corporation_id_medals_issued
     *
     * @returns An iterator over all medal issuing events for the corporation
     */
    issuedMedals() {
        if (this.medalsIssued_ === undefined) {
            this.medalsIssued_ = r.impl.makePageBasedStreamer(page => this.getMedalsIssuedPage(page), 1000);
        }
        return this.medalsIssued_();
    }
    getMedalsIssuedPage(page) {
        return this.ids()
            .then(corpID => this.agent.agent.request('get_corporations_corporation_id_medals_issued', { path: { corporation_id: corpID }, query: { page: page } }, this.agent.ssoToken))
            .then(result => ({ result, maxPages: undefined }));
    }
    // The plain un-authenticated corporation API
    details() {
        return this.base.details();
    }
    history() {
        return this.base.history();
    }
    icons() {
        return this.base.icons();
    }
    loyaltyOffers() {
        return this.base.loyaltyOffers();
    }
    names() {
        return this.base.names();
    }
    ids() {
        if (typeof this.agent.id === 'number') {
            return Promise.resolve(this.agent.id);
        }
        else {
            return this.agent.id().then(id => {
                // Switch over to a non-functional id (safe to cast to any and remove
                // read-only status since the SSOAgent was created by this class)
                this.agent.id = id;
                return id;
            });
        }
    }
    get base() {
        if (this.base_ === undefined) {
            this.base_ = new corporations_1.Corporation(this.agent.agent, this.agent.id);
        }
        return this.base_;
    }
}
exports.AuthenticatedCorporation = AuthenticatedCorporation;
//# sourceMappingURL=authenticated-corporation.js.map