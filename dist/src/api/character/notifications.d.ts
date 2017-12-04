import { SSOAgent } from '../../internal/esi-agent';
import { Responses } from '../../esi';
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's notifications via the
 * [character](https://esi.tech.ccp.is/latest/#/Character) ESI end points.
 */
export declare class Notifications {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * @returns The recent general-purpose notifications sent to the character
     */
    recent(): Promise<Responses['get_characters_character_id_notifications']>;
    /**
     * @returns Recent contact notifications sent to the character, issued when
     *     another character adds them as a contact
     */
    contacts(): Promise<Responses['get_characters_character_id_notifications_contacts']>;
}
