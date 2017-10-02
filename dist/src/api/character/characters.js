"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const page_loader_1 = require("../../internal/page-loader");
const names_1 = require("../../internal/names");
const search_1 = require("../../internal/search");
const killmail_1 = require("../killmail");
const autopilot_1 = require("./ui/autopilot");
const bookmarks_1 = require("./bookmarks");
const calendar_1 = require("./calendar");
const colonies_1 = require("./colonies");
const contacts_1 = require("./contacts");
const character_corporation_1 = require("./character-corporation");
const fittings_1 = require("./fittings");
const fleet_1 = require("./fleet");
const mail_1 = require("./mail");
const structures_1 = require("./structures");
const window_1 = require("./ui/window");
/**
 * Create a new {@link Characters} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Characters API instance
 */
function makeCharacters(agent) {
    let characters = function (id, ssoToken) {
        if (ssoToken === undefined) {
            return new CharacterInfoImpl(agent, id);
        }
        else {
            return new CharacterImpl({ agent, id, ssoToken });
        }
    };
    characters.search = search_1.makeDefaultSearch(agent, "character" /* CHARACTER */);
    characters.affiliations = function (ids) {
        return agent.request('post_characters_affiliation', { body: ids });
    };
    characters.names = function (ids) {
        if (ids.length > 100) {
            // Use universe/names end point since the /characters one breaks if
            // the URL gets too long.
            return names_1.getNames(agent, "character" /* CHARACTER */, ids);
        }
        else {
            // Use character/names end point
            return agent.request('get_characters_names', { query: { character_ids: ids } })
                .then(result => {
                let map = new Map();
                for (let c of result) {
                    map.set(c.character_id, c.character_name);
                }
                return map;
            });
        }
    };
    return characters;
}
exports.makeCharacters = makeCharacters;
class CharacterInfoImpl {
    constructor(agent, id_) {
        this.agent = agent;
        this.id_ = id_;
    }
    info() {
        return this.agent.request('get_characters_character_id', { path: { character_id: this.id_ } });
    }
    portrait() {
        return this.agent.request('get_characters_character_id_portrait', { path: { character_id: this.id_ } });
    }
    history() {
        return this.agent.request('get_characters_character_id_corporationhistory', { path: { character_id: this.id_ } });
    }
    id() {
        return Promise.resolve(this.id_);
    }
}
class CharacterImpl {
    constructor(char) {
        this.char = char;
        this.base = new CharacterInfoImpl(char.agent, char.id);
        this.allKills = page_loader_1.makeIDBasedLoader(id => this.recentKills(id), km => km.killmail_id, 50);
        this.allMails = page_loader_1.makeIDBasedLoader(id => this.recentKillmails(id), km => km.killmail_id, 50);
    }
    get autopilot() {
        if (this.autopilot_ === undefined) {
            this.autopilot_ = autopilot_1.makeAutopilot(this.char.agent, this.char.ssoToken);
        }
        return this.autopilot_;
    }
    get bookmarks() {
        if (this.bookmarks_ === undefined) {
            this.bookmarks_ = bookmarks_1.makeBookmarks(this.char);
        }
        return this.bookmarks_;
    }
    get calendar() {
        if (this.calendar_ === undefined) {
            this.calendar_ = calendar_1.makeCalendar(this.char);
        }
        return this.calendar_;
    }
    get colonies() {
        if (this.colonies_ === undefined) {
            this.colonies_ = colonies_1.makeColonies(this.char);
        }
        return this.colonies_;
    }
    get contacts() {
        if (this.contacts_ === undefined) {
            this.contacts_ = contacts_1.makeContacts(this.char);
        }
        return this.contacts_;
    }
    get corporation() {
        if (this.corp_ === undefined) {
            this.corp_ = character_corporation_1.makeCharacterCorporation(this.char);
        }
        return this.corp_;
    }
    get fittings() {
        if (this.fittings_ === undefined) {
            this.fittings_ = fittings_1.makeFittings(this.char);
        }
        return this.fittings_;
    }
    get mail() {
        if (this.mail_ === undefined) {
            this.mail_ = mail_1.makeMail(this.char);
        }
        return this.mail_;
    }
    get structures() {
        if (this.structures_ === undefined) {
            this.structures_ = structures_1.makeStructures(this.char);
        }
        return this.structures_;
    }
    get window() {
        if (this.window_ === undefined) {
            this.window_ = window_1.makeWindow(this.char.agent, this.char.ssoToken);
        }
        return this.window_;
    }
    fleet(id) {
        return fleet_1.makeFleet({ agent: this.char.agent, id: id, ssoToken: this.char.ssoToken });
    }
    assets() {
        return this.char.agent.request('get_characters_character_id_assets', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    clones() {
        return this.char.agent.request('get_characters_character_id_clones', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    recentKills(maxKillId) {
        if (this.kms_ === undefined) {
            this.kms_ = killmail_1.makeKillmail(this.char.agent);
        }
        return this.recentKillmails(maxKillId).then(kms => {
            return Promise.all(kms.map(km => this.kms_(km.killmail_id, km.killmail_hash)));
        });
    }
    kills() {
        return this.allKills.getAll();
    }
    recentKillmails(maxKillId) {
        return this.char.agent.request('get_characters_character_id_killmails_recent', {
            path: { character_id: this.char.id },
            query: { max_kill_id: maxKillId, max_count: 50 }
        }, this.char.ssoToken);
    }
    killmails() {
        return this.allMails.getAll();
    }
    loyaltyPoints() {
        return this.char.agent.request('get_characters_character_id_loyalty_points', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    ship() {
        return this.char.agent.request('get_characters_character_id_ship', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    location() {
        return this.char.agent.request('get_characters_character_id_location', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    online() {
        return this.char.agent.request('get_characters_character_id_online', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    wallets() {
        return this.char.agent.request('get_characters_character_id_wallets', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    skills() {
        return this.char.agent.request('get_characters_character_id_skills', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    skillqueue() {
        return this.char.agent.request('get_characters_character_id_skillqueue', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    agentResearch() {
        return this.char.agent.request('get_characters_character_id_agents_research', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    chatChannels() {
        return this.char.agent.request('get_characters_character_id_chat_channels', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    medals() {
        return this.char.agent.request('get_characters_character_id_medals', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    standings() {
        return this.char.agent.request('get_characters_character_id_standings', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    opportunities() {
        return this.char.agent.request('get_characters_character_id_opportunities', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    orders() {
        return this.char.agent.request('get_characters_character_id_orders', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    blueprints() {
        return this.char.agent.request('get_characters_character_id_blueprints', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    roles() {
        return this.char.agent.request('get_characters_character_id_roles', { path: { character_id: this.char.id } }, this.char.ssoToken);
    }
    industryJobs(includeCompleted = false) {
        return this.char.agent.request('get_characters_character_id_industry_jobs', {
            path: { character_id: this.char.id },
            query: { include_completed: includeCompleted }
        }, this.char.ssoToken);
    }
    info() {
        return this.base.info();
    }
    history() {
        return this.base.history();
    }
    portrait() {
        return this.base.portrait();
    }
    id() {
        return Promise.resolve(this.char.id);
    }
}
//# sourceMappingURL=characters.js.map