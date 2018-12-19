import { Search } from '../../internal/search';
import { ESIAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';
import { Autopilot } from './ui/autopilot';
import { Bookmarks } from './bookmarks';
import { Calendar } from './calendar';
import { Colonies } from './colonies';
import { Contacts } from './contacts';
import { CharacterCorporation } from './character-corporation';
import { Fittings } from './fittings';
import { Fleet } from './fleet';
import { Mail } from './mail';
import { Structures } from './structures';
import { Window } from './ui/window';
/**
 * An api adapter that provides functions for viewing public (non-authenticated)
 * information about a specific character  via functions in the
 * [character](https://esi.evetech.net/latest/#/Character) ESI endpoints.
 */
export interface CharacterInfo {
    /**
     * @esi_example esi.characters(1).info()
     *
     * @returns Public information about the specified character
     */
    info(): Promise<Responses['get_characters_character_id']>;
    /**
     * @esi_example esi.characters(1).portrait()
     *
     * @returns Image URLs for the character's portrait
     */
    portrait(): Promise<Responses['get_characters_character_id_portrait']>;
    /**
     * @esi_example esi.characters(1).history()
     *
     * @returns The character's corporation history
     */
    history(): Promise<Responses['get_characters_character_id_corporationhistory']>;
    /**
     * @returns The character id
     */
    id(): Promise<number>;
}
/**
 * An extension of {@link CharacterInfo} that adds the remaining
 * character-linked, authenticated from the
 * [character](https://esi.evetech.net/latest/#/Character) and related ESI end
 * points.
 *
 * @see https://esi.evetech.net/latest/#/Character
 * @see https://esi.tech.cpp.is/latest/#/Assets
 * @see https://esi.tech.cpp.is/latest/#/Bookmarks
 * @see https://esi.tech.cpp.is/latest/#/Clones
 * @see https://esi.tech.cpp.is/latest/#/Fittings
 * @see https://esi.tech.cpp.is/latest/#/Killmails
 * @see https://esi.tech.cpp.is/latest/#/Location
 * @see https://esi.evetech.net/latest/#/Planetary_Interaction
 * @see https://esi.evetech.net/latest/#/Skills
 * @see https://esi.evetech.net/latest/#/Wallet
 */
export interface Character extends CharacterInfo {
    /**
     * An Autopilot instance linked to this Character.
     */
    autopilot: Autopilot;
    /**
     * A Bookmarks instance linked to this Character.
     */
    bookmarks: Bookmarks;
    /**
     * A Calendar instance linked to this Character.
     */
    calendar: Calendar;
    /**
     * A Colonies instance linked to this Character.
     */
    colonies: Colonies;
    /**
     * A Contacts instance linked to this Character.
     */
    contacts: Contacts;
    /**
     * A CharacterCorporation instance linked to this Character.
     */
    corporation: CharacterCorporation;
    /**
     * A Fittings instance linked to this Character.
     */
    fittings: Fittings;
    /**
     * A Mail instance linked to this Character.
     */
    mail: Mail;
    /**
     * A Structures instance linked to this Character.
     */
    structures: Structures;
    /**
     * A Window instance linked to this Character.
     */
    window: Window;
    /**
     * Get a Fleet instance for the given fleet `id`.
     *
     * @param id The fleet id this character belongs to.
     * @returns Fleet API wrapper
     */
    fleet(id: number): Fleet;
    /**
     * @esi_example esi.characters(1, 'token').assets()
     *
     * @returns List of the character's assets
     */
    assets(): Promise<Responses['get_characters_character_id_assets']>;
    /**
     * @esi_example esi.characters(1, 'token').clones()
     *
     * @returns The character's available jump clones
     */
    clones(): Promise<Responses['get_characters_character_id_clones']>;
    /**
     * Get the kill details for the recent {@link Character#recentKillmails
     * recentKillmails} and then uses {@link Killmail#get} to map the details.
     * The request resolves to an array, each containing a killmail detail.
     *
     * @esi_route get_characters_character_id_killmails_recent
     * @esi_example esi.characters(1, 'token').recentKills()
     *
     * @param maxKillId  Optional; the mail id that limits which mails
     *   can be returned. If provided recent mails older than the id are returned,
     *   otherwise the most recent kills are returned
     * @returns A page of recent kill details for the character
     */
    recentKills(maxKillId?: number): Promise<esi.killmail.Killmail[]>;
    /**
     * Get all kill, over all of history, for the given character. This makes
     * multiple calls to {@link Character#recentKills recentKills}. This
     * should be used with caution as some characters may have a very large number
     * of kills.
     *
     * @esi_route get_characters_character_id_killmails_recent
     *
     * @returns All of the details of the character's kills
     */
    kills(): Promise<esi.killmail.Killmail[]>;
    /**
     * @esi_example esi.characters(1, 'token').recentKillmails()
     *
     * @param maxKillId If not provided the most recent killmails are returned.
     * @returns Recent killmail links for the character
     */
    recentKillmails(maxKillId?: number): Promise<Responses['get_characters_character_id_killmails_recent']>;
    /**
     * Get all killmails, over all of history, for the given character. This makes
     * multiple calls to {@link Character#recentKillmails recentKillmails}. This
     * should be used with caution as some characters may have a very large number
     * of kills.
     *
     * @esi_route get_characters_character_id_killmails_recent
     * @returns All killmail links for the character
     */
    killmails(): Promise<esi.killmail.KillmailLink[]>;
    /**
     * @esi_example esi.characters(1, 'token').loyaltyPoints()
     *
     * @returns The character's loyalty points with the different NPC groups
     */
    loyaltyPoints(): Promise<Responses['get_characters_character_id_loyalty_points']>;
    /**
     * @esi_example esi.characters(1, 'token').ship()
     *
     * @returns The character's currently boarded ship
     */
    ship(): Promise<Responses['get_characters_character_id_ship']>;
    /**
     * @esi_example esi.characters(1, 'token').location()
     *
     * @returns The character's location in Eve
     */
    location(): Promise<Responses['get_characters_character_id_location']>;
    /**
     * @esi_example esi.characters(1, 'token').online()
     *
     * @returns The character's online status
     */
    online(): Promise<Responses['get_characters_character_id_online']>;
    /**
     * @esi_example esi.characters(1, 'token').wallets()
     *
     * @returns The character's wallet state
     */
    wallets(): Promise<Responses['get_characters_character_id_wallets']>;
    /**
     * @esi_example esi.characters(1, 'token').skills()
     *
     * @returns The character's known skills
     */
    skills(): Promise<Responses['get_characters_character_id_skills']>;
    /**
     * @esi_example esi.characters(1, 'token').skillqueue()
     *
     * @returns The character's current skill queue
     */
    skillqueue(): Promise<Responses['get_characters_character_id_skillqueue']>;
    /**
     * @esi_example esi.characters(1, 'token').agentResearch()
     *
     * @returns The character's current research progress with known agents
     */
    agentResearch(): Promise<Responses['get_characters_character_id_agents_research']>;
    /**
     * @esi_example esi.characters(1, 'token').chatChannels()
     *
     * @returns The character's current chat channel memberships
     */
    chatChannels(): Promise<Responses['get_characters_character_id_chat_channels']>;
    /**
     * @esi_example esi.characters(1, 'token').medals()
     *
     * @returns The character's earned medals
     */
    medals(): Promise<Responses['get_characters_character_id_medals']>;
    /**
     * @esi_example esi.characters(1, 'token').standings()
     *
     * @returns The character's corporation standings
     */
    standings(): Promise<Responses['get_characters_character_id_standings']>;
    /**
     * @esi_example esi.characters(1, 'token').opportunities()
     *
     * @returns The character's progress through Eve's opportunities system
     */
    opportunities(): Promise<Responses['get_characters_character_id_opportunities']>;
    /**
     * @esi_example esi.characters(1, 'token').orders()
     *
     * @returns The character's active buy and sell market orders
     */
    orders(): Promise<Responses['get_characters_character_id_orders']>;
    /**
     * @esi_example esi.characters(1, 'token').blueprints()
     *
     * @returns The character's owned blueprints
     */
    blueprints(): Promise<Responses['get_characters_character_id_blueprints']>;
    /**
     * @esi_example esi.characters(1, 'token').roles()
     *
     * @returns The character's assigned roles in their corporation
     */
    roles(): Promise<Responses['get_characters_character_id_roles']>;
    /**
     * @esi_example esi.characters(1, 'token').industryJobs()
     *
     * @param includeCompleted Whether or not to include completed jobs, defaults
     *     to false
     * @returns List of industry jobs run by the character
     */
    industryJobs(includeCompleted?: boolean): Promise<Responses['get_characters_character_id_industry_jobs']>;
}
/**
 * An api adapter over the end points handling multiple characters via functions
 * in the [character](https://esi.evetech.net/latest/#/Character) ESI
 * endpoints.
 */
export interface Characters {
    /**
     * Create a new CharacterInfo end point targeting the particular
     * character by `id`.
     *
     * @param id The character id
     * @returns The unauthenticated API for the specific character
     */
    (id: number): CharacterInfo;
    /**
     * Create a new Character end point targeting the particular
     * character by `id`, authenticated with the given access `token`.
     *
     * @param id The character id
     * @param token The SSO access token for the character
     * @returns The authenticated API for the specific character
     */
    (id: number, token: string): Character;
    /**
     * A Search module instance configured to search over the `'character'`
     * type.
     *
     * @esi_route get_search [character]
     * @esi_example esi.characters.search('name')
     */
    search: Search;
    /**
     * @esi_example esi.characters.affiliations(ids)
     *
     * @param ids The character ids to query
     * @returns Bulk retrieve the affiliations for the given character ids
     */
    affiliations(ids: number[]): Promise<Responses['post_characters_affiliation']>;
    /**
     * @esi_route get_characters_names
     * @esi_route post_universe_names [character]
     * @esi_example esi.characters.names(ids)
     *
     * @param ids The character ids to lookup
     * @returns A map from character id to name
     */
    names(ids: number[]): Promise<Map<number, string>>;
}
/**
 * Create a new {@link Characters} instance that uses the given `agent` to
 * make its HTTP requests to the ESI interface.
 *
 * @param agent The agent making actual requests
 * @returns A Characters API instance
 */
export declare function makeCharacters(agent: ESIAgent): Characters;
