"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const r = require("../../internal/resource-api");
const killmails_1 = require("../killmails");
const bookmarks_1 = require("./bookmarks");
const calendar_1 = require("./calendar");
const colonies_1 = require("./colonies");
const contacts_1 = require("./contacts");
const fittings_1 = require("./fittings");
const fleet_1 = require("../fleet");
const mail_1 = require("./mail");
const structures_1 = require("../structures");
const authenticated_corporation_1 = require("../corporation/authenticated-corporation");
const characters_1 = require("./characters");
const contracts_1 = require("./contracts");
const ui_1 = require("./ui");
const assets_1 = require("./assets");
const notifications_1 = require("./notifications");
const skills_1 = require("./skills");
const wallet_1 = require("./wallet");
const authenticated_alliance_1 = require("../alliance/authenticated-alliance");
const KILLMAIL_PAGE_SIZE = 500;
/**
 * An api adapter for accessing various details of a single character,
 * specified by a provided id when the api is instantiated.
 *
 * This API is authenticated by an SSO token provided by the character through
 * an external process. Some functions that are exposed expect the character to
 * have specific in-game roles with respect to their corporation or fleet. If
 * these permissions are not met when a request is made to ESI, then it will
 * respond with an error.
 */
class AuthenticatedCharacter extends r.impl.SimpleResource {
    constructor(agent) {
        super(agent.id);
        this.agent = agent;
    }
    get assets() {
        if (this.assets_ === undefined) {
            this.assets_ = assets_1.makeAssets(this.agent);
        }
        return this.assets_;
    }
    get bookmarks() {
        if (this.bookmarks_ === undefined) {
            this.bookmarks_ = new bookmarks_1.Bookmarks(this.agent);
        }
        return this.bookmarks_;
    }
    get calendar() {
        if (this.calendar_ === undefined) {
            this.calendar_ = calendar_1.makeCalendar(this.agent);
        }
        return this.calendar_;
    }
    get colonies() {
        if (this.colonies_ === undefined) {
            this.colonies_ = colonies_1.makeColonies(this.agent);
        }
        return this.colonies_;
    }
    get contacts() {
        if (this.contacts_ === undefined) {
            this.contacts_ = contacts_1.makeContacts(this.agent);
        }
        return this.contacts_;
    }
    get contracts() {
        if (this.contracts_ === undefined) {
            this.contracts_ = contracts_1.makeContracts(this.agent);
        }
        return this.contracts_;
    }
    get corporation() {
        if (this.corp_ === undefined) {
            this.corp_ = new authenticated_corporation_1.AuthenticatedCorporation(this.agent.agent, this.agent.ssoToken, () => this.details().then(details => details.corporation_id), this.agent.id);
        }
        return this.corp_;
    }
    get alliance() {
        if (this.alliance_ === undefined) {
            this.alliance_ = new authenticated_alliance_1.AuthenticatedAlliance(this.agent.agent, this.agent.ssoToken, () => this.details().then(details => details.alliance_id || 0));
        }
        return this.alliance_;
    }
    get fittings() {
        if (this.fittings_ === undefined) {
            this.fittings_ = fittings_1.makeFittings(this.agent);
        }
        return this.fittings_;
    }
    get fleet() {
        if (this.fleet_ === undefined) {
            this.fleet_ = fleet_1.makeFleet(this.agent, 'character');
        }
        return this.fleet_;
    }
    get mail() {
        if (this.mail_ === undefined) {
            this.mail_ = new mail_1.Mail(this.agent);
        }
        return this.mail_;
    }
    get notifications() {
        if (this.notifications_ === undefined) {
            this.notifications_ = new notifications_1.Notifications(this.agent);
        }
        return this.notifications_;
    }
    get skills() {
        if (this.skills_ === undefined) {
            this.skills_ = new skills_1.Skills(this.agent);
        }
        return this.skills_;
    }
    get structures() {
        if (this.structures_ === undefined) {
            // Do not provide a corporation ID so that it must be determined
            // dynamically
            this.structures_ = structures_1.makeStructures(this.agent.agent, this.agent.ssoToken, this.agent.id, undefined);
        }
        return this.structures_;
    }
    get ui() {
        if (this.ui_ === undefined) {
            this.ui_ = new ui_1.UI(this.agent);
        }
        return this.ui_;
    }
    get wallet() {
        if (this.wallet_ === undefined) {
            this.wallet_ = new wallet_1.Wallet(this.agent);
        }
        return this.wallet_;
    }
    get kills() {
        if (this.kms_ === undefined) {
            this.kms_ = new killmails_1.IteratedKillmails(this.agent.agent, r.impl.makeMaxIDStreamer(fromID => this.recentKillmails(fromID), e => e.killmail_id, KILLMAIL_PAGE_SIZE));
        }
        return this.kms_;
    }
    recentKillmails(maxKillId) {
        return this.agent.agent.request('get_characters_character_id_killmails_recent', {
            path: { character_id: this.agent.id },
            query: { max_kill_id: maxKillId, max_count: KILLMAIL_PAGE_SIZE }
        }, this.agent.ssoToken);
    }
    /**
     * @returns The character's current jump fatigue
     */
    fatigue() {
        return this.agent.agent.request('get_characters_character_id_fatigue', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's titles
     */
    titles() {
        return this.agent.agent.request('get_characters_character_id_titles', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @esi_route get_characters_character_id_mining
     *
     * @returns An iterator over the character's mining ledger
     */
    miningLedger() {
        if (this.mining_ === undefined) {
            this.mining_ = r.impl.makePageBasedStreamer(page => this.getMiningPage(page), 1000);
        }
        return this.mining_();
    }
    getMiningPage(page) {
        return this.agent.agent.request('get_characters_character_id_mining', { path: { character_id: this.agent.id }, query: { page: page } }, this.agent.ssoToken).then(result => ({ result, maxPages: undefined }));
    }
    /**
     * @returns The character's available jump clones
     */
    clones() {
        return this.agent.agent.request('get_characters_character_id_clones', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's loyalty points with the different NPC groups
     */
    loyaltyPoints() {
        return this.agent.agent.request('get_characters_character_id_loyalty_points', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's currently boarded ship
     */
    ship() {
        return this.agent.agent.request('get_characters_character_id_ship', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's location in Eve
     */
    location() {
        return this.agent.agent.request('get_characters_character_id_location', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's online status
     */
    online() {
        return this.agent.agent.request('get_characters_character_id_online', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's current research progress with known agents
     */
    research() {
        return this.agent.agent.request('get_characters_character_id_agents_research', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's current chat channel memberships
     */
    chatChannels() {
        return this.agent.agent.request('get_characters_character_id_chat_channels', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's earned medals
     */
    medals() {
        return this.agent.agent.request('get_characters_character_id_medals', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's corporation standings
     */
    standings() {
        return this.agent.agent.request('get_characters_character_id_standings', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's progress through Eve's opportunities system
     */
    opportunities() {
        return this.agent.agent.request('get_characters_character_id_opportunities', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's active buy and sell market orders
     */
    orders() {
        return this.agent.agent.request('get_characters_character_id_orders', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's assigned roles in their corporation
     */
    roles() {
        return this.agent.agent.request('get_characters_character_id_roles', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @param includeCompleted Whether or not to include completed jobs, defaults
     *     to false
     * @returns List of industry jobs run by the character
     */
    industryJobs(includeCompleted = false) {
        return this.agent.agent.request('get_characters_character_id_industry_jobs', {
            path: { character_id: this.agent.id },
            query: { include_completed: includeCompleted }
        }, this.agent.ssoToken);
    }
    get base() {
        if (this.base_ === undefined) {
            this.base_ = new characters_1.Character(this.agent.agent, this.id_);
        }
        return this.base_;
    }
    details() {
        return this.base.details();
    }
    portraits() {
        return this.base.portraits();
    }
    history() {
        return this.base.history();
    }
    affiliations() {
        return this.base.affiliations();
    }
    names() {
        return this.base.names();
    }
    ids() {
        return Promise.resolve(this.agent.id);
    }
}
exports.AuthenticatedCharacter = AuthenticatedCharacter;
//# sourceMappingURL=authenticated-character.js.map