"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// FIXME handle skill and queue merging
// FIXME handle completed queue filtering
// FIXME does completed queue filtering affect totalSP reported?
// FIXME document how known() is affected by alpha status
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's skills via the
 * [skills](https://esi.tech.ccp.is/latest/#/Skills) ESI end points.
 */
class Skills {
    constructor(agent) {
        this.agent = agent;
    }
    /**
     *
     * @returns The total amount of skill points learned by the character
     */
    totalSP() {
        return this.getSkills().then(all => all.total_sp || 0);
    }
    /**
     * @returns The skills known by a character
     */
    known() {
        return this.getSkills().then(all => all.skills || []);
    }
    /**
     * @returns The character's skill queue
     */
    queue() {
        return this.agent.agent.request('get_characters_character_id_skillqueue', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    /**
     * @returns The character's mental attribute distribution
     */
    attributes() {
        return this.agent.agent.request('get_characters_character_id_attributes', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
    getSkills() {
        return this.agent.agent.request('get_characters_character_id_skills', { path: { character_id: this.agent.id } }, this.agent.ssoToken);
    }
}
exports.Skills = Skills;
//# sourceMappingURL=skills.js.map