import { SSOAgent } from '../../internal/esi-agent';
import { esi, Responses } from '../../esi';
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's skills via the
 * [skills](https://esi.tech.ccp.is/latest/#/Skills) ESI end points.
 */
export declare class Skills {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     *
     * @returns The total amount of skill points learned by the character
     */
    totalSP(): Promise<number>;
    /**
     * @returns The skills known by a character
     */
    known(): Promise<esi.character.Skill[]>;
    /**
     * @returns The character's skill queue
     */
    queue(): Promise<Responses['get_characters_character_id_skillqueue']>;
    /**
     * @returns The character's mental attribute distribution
     */
    attributes(): Promise<Responses['get_characters_character_id_attributes']>;
    private getSkills();
}
