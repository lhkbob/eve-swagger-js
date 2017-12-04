import { SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { IteratedKillmails } from '../killmails';
import { Bookmarks } from './bookmarks';
import { Calendar } from './calendar';
import { Colonies } from './colonies';
import { Contacts } from './contacts';
import { Fittings } from './fittings';
import { CharacterFleet } from '../fleet';
import { Mail } from './mail';
import { Structures } from '../structures';
import { AuthenticatedCorporation } from '../corporation/authenticated-corporation';
import { CharacterAPI } from './characters';
import { Contracts } from './contracts';
import { UI } from './ui';
import { Assets } from './assets';
import { Notifications } from './notifications';
import { Skills } from './skills';
import { Wallet } from './wallet';
import { AuthenticatedAlliance } from '../alliance/authenticated-alliance';
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
export declare class AuthenticatedCharacter extends r.impl.SimpleResource implements r.Async<CharacterAPI> {
    private agent;
    private base_?;
    private kms_?;
    private mining_?;
    private corp_?;
    private alliance_?;
    private assets_?;
    private bookmarks_?;
    private calendar_?;
    private colonies_?;
    private contacts_?;
    private contracts_?;
    private fittings_?;
    private fleet_?;
    private mail_?;
    private notifications_?;
    private skills_?;
    private structures_?;
    private ui_?;
    private wallet_?;
    constructor(agent: SSOAgent<number>);
    readonly assets: Assets;
    readonly bookmarks: Bookmarks;
    readonly calendar: Calendar;
    readonly colonies: Colonies;
    readonly contacts: Contacts;
    readonly contracts: Contracts;
    readonly corporation: AuthenticatedCorporation;
    readonly alliance: AuthenticatedAlliance;
    readonly fittings: Fittings;
    readonly fleet: CharacterFleet;
    readonly mail: Mail;
    readonly notifications: Notifications;
    readonly skills: Skills;
    readonly structures: Structures;
    readonly ui: UI;
    readonly wallet: Wallet;
    readonly kills: IteratedKillmails;
    private recentKillmails(maxKillId?);
    /**
     * @returns The character's current jump fatigue
     */
    fatigue(): Promise<Responses['get_characters_character_id_fatigue']>;
    /**
     * @returns The character's titles
     */
    titles(): Promise<Responses['get_characters_character_id_titles']>;
    /**
     * @esi_route get_characters_character_id_mining
     *
     * @returns An iterator over the character's mining ledger
     */
    miningLedger(): AsyncIterableIterator<esi.character.MiningRecord>;
    private getMiningPage(page);
    /**
     * @returns The character's available jump clones
     */
    clones(): Promise<Responses['get_characters_character_id_clones']>;
    /**
     * @returns The character's loyalty points with the different NPC groups
     */
    loyaltyPoints(): Promise<Responses['get_characters_character_id_loyalty_points']>;
    /**
     * @returns The character's currently boarded ship
     */
    ship(): Promise<Responses['get_characters_character_id_ship']>;
    /**
     * @returns The character's location in Eve
     */
    location(): Promise<Responses['get_characters_character_id_location']>;
    /**
     * @returns The character's online status
     */
    online(): Promise<Responses['get_characters_character_id_online']>;
    /**
     * @returns The character's current research progress with known agents
     */
    research(): Promise<Responses['get_characters_character_id_agents_research']>;
    /**
     * @returns The character's current chat channel memberships
     */
    chatChannels(): Promise<Responses['get_characters_character_id_chat_channels']>;
    /**
     * @returns The character's earned medals
     */
    medals(): Promise<Responses['get_characters_character_id_medals']>;
    /**
     * @returns The character's corporation standings
     */
    standings(): Promise<Responses['get_characters_character_id_standings']>;
    /**
     * @returns The character's progress through Eve's opportunities system
     */
    opportunities(): Promise<Responses['get_characters_character_id_opportunities']>;
    /**
     * @returns The character's active buy and sell market orders
     */
    orders(): Promise<Responses['get_characters_character_id_orders']>;
    /**
     * @returns The character's assigned roles in their corporation
     */
    roles(): Promise<Responses['get_characters_character_id_roles']>;
    /**
     * @param includeCompleted Whether or not to include completed jobs, defaults
     *     to false
     * @returns List of industry jobs run by the character
     */
    industryJobs(includeCompleted?: boolean): Promise<Responses['get_characters_character_id_industry_jobs']>;
    private readonly base;
    details(): Promise<esi.character.Character>;
    portraits(): Promise<esi.character.Portrait>;
    history(): Promise<esi.character.CorporationHistory[]>;
    affiliations(): Promise<{
        character_id: number;
        faction_id: number | undefined;
        alliance_id: number | undefined;
        corporation_id: number;
    }>;
    names(): Promise<string>;
    ids(): Promise<number>;
}
