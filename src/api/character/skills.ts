import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';

// FIXME handle skill and queue merging
// FIXME handle completed queue filtering
// FIXME does completed queue filtering affect totalSP reported?
// FIXME document how known() is affected by alpha status

/**
 * An api adapter that provides functions for accessing an authenticated
 * character's skills via the
 * [skills](https://esi.tech.ccp.is/latest/#/Skills) ESI end points.
 */
export class Skills {
  constructor(private agent: SSOAgent<number>) {
  }

  /**
   *
   * @returns The total amount of skill points learned by the character
   */
  totalSP(): Promise<number> {
    return this.getSkills().then(all => all.total_sp || 0);
  }

  /**
   * @returns The skills known by a character
   */
  known(): Promise<esi.character.Skill[]> {
    return this.getSkills().then(all => all.skills || []);
  }

  /**
   * @returns The character's skill queue
   */
  queue(): Promise<Responses['get_characters_character_id_skillqueue']> {
    return this.agent.agent.request('get_characters_character_id_skillqueue',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's mental attribute distribution
   */
  attributes(): Promise<Responses['get_characters_character_id_attributes']> {
    return this.agent.agent.request('get_characters_character_id_attributes',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  private getSkills() {
    return this.agent.agent.request('get_characters_character_id_skills',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }
}