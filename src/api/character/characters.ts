import {
  PaginatedLoader, makeIDBasedLoader
} from '../../internal/page-loader';
import { getNames } from '../../internal/names';
import { Search, makeDefaultSearch } from '../../internal/search';
import { ESIAgent, SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';

import { Killmail, makeKillmail } from '../killmail';

import { Autopilot, makeAutopilot } from './ui/autopilot';
import { Bookmarks, makeBookmarks } from './bookmarks';
import { Calendar, makeCalendar } from './calendar';
import { Colonies, makeColonies } from './colonies';
import { Contacts, makeContacts } from './contacts';
import {
  CharacterCorporation,
  makeCharacterCorporation
} from './character-corporation';
import { Fittings, makeFittings } from './fittings';
import { Fleet, makeFleet } from './fleet';
import { Mail, makeMail } from './mail';
import { Structures, makeStructures } from './structures';
import { Window, makeWindow } from './ui/window';


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
  industryJobs(includeCompleted?:boolean): Promise<Responses['get_characters_character_id_industry_jobs']>;
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
export function makeCharacters(agent: ESIAgent): Characters {
  let characters = <Characters> <any> function (id: number, ssoToken?: string) {
    if (ssoToken === undefined) {
      return new CharacterInfoImpl(agent, id);
    } else {
      return new CharacterImpl({ agent, id, ssoToken });
    }
  };

  characters.search = makeDefaultSearch(agent, esi.SearchCategory.CHARACTER);
  characters.affiliations = function (ids: number[]) {
    return agent.request('post_characters_affiliation', { body: ids });
  };
  characters.names = function (ids: number[]) {
    if (ids.length > 100) {
      // Use universe/names end point since the /characters one breaks if
      // the URL gets too long.
      return getNames(agent, esi.universe.NameCategory.CHARACTER, ids);
    } else {
      // Use character/names end point
      return agent.request('get_characters_names',
          { query: { character_ids: ids } })
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

class CharacterInfoImpl implements CharacterInfo {
  constructor(private agent: ESIAgent, private id_: number) {
  }

  info() {
    return this.agent.request('get_characters_character_id',
        { path: { character_id: this.id_ } });
  }

  portrait() {
    return this.agent.request('get_characters_character_id_portrait',
        { path: { character_id: this.id_ } });
  }

  history() {
    return this.agent.request('get_characters_character_id_corporationhistory',
        { path: { character_id: this.id_ } });
  }

  id() {
    return Promise.resolve(this.id_);
  }
}

class CharacterImpl implements Character {
  private base: CharacterInfo;

  private allKills: PaginatedLoader<esi.killmail.Killmail>;
  private allMails: PaginatedLoader<esi.killmail.KillmailLink>;
  private kms_?: Killmail;

  private autopilot_?: Autopilot;
  private bookmarks_?: Bookmarks;
  private calendar_?: Calendar;
  private contacts_?: Contacts;
  private corp_?: CharacterCorporation;
  private fittings_?: Fittings;
  private mail_?: Mail;
  private colonies_?: Colonies;
  private structures_?: Structures;
  private window_?: Window;

  constructor(private char: SSOAgent) {
    this.base = new CharacterInfoImpl(char.agent, char.id);

    this.allKills = makeIDBasedLoader(id => this.recentKills(id),
        km => km.killmail_id, 50);
    this.allMails = makeIDBasedLoader(id => this.recentKillmails(id),
        km => km.killmail_id, 50);
  }

  get autopilot() {
    if (this.autopilot_ === undefined) {
      this.autopilot_ = makeAutopilot(this.char.agent, this.char.ssoToken);
    }
    return this.autopilot_;
  }

  get bookmarks() {
    if (this.bookmarks_ === undefined) {
      this.bookmarks_ = makeBookmarks(this.char);
    }
    return this.bookmarks_;
  }

  get calendar() {
    if (this.calendar_ === undefined) {
      this.calendar_ = makeCalendar(this.char);
    }
    return this.calendar_;
  }

  get colonies() {
    if (this.colonies_ === undefined) {
      this.colonies_ = makeColonies(this.char);
    }
    return this.colonies_;
  }

  get contacts() {
    if (this.contacts_ === undefined) {
      this.contacts_ = makeContacts(this.char);
    }
    return this.contacts_;
  }

  get corporation() {
    if (this.corp_ === undefined) {
      this.corp_ = makeCharacterCorporation(this.char);
    }
    return this.corp_;
  }

  get fittings() {
    if (this.fittings_ === undefined) {
      this.fittings_ = makeFittings(this.char);
    }
    return this.fittings_;
  }

  get mail() {
    if (this.mail_ === undefined) {
      this.mail_ = makeMail(this.char);
    }
    return this.mail_;
  }

  get structures() {
    if (this.structures_ === undefined) {
      this.structures_ = makeStructures(this.char);
    }
    return this.structures_;
  }

  get window() {
    if (this.window_ === undefined) {
      this.window_ = makeWindow(this.char.agent, this.char.ssoToken);
    }
    return this.window_;
  }

  fleet(id: number) {
    return makeFleet(
        { agent: this.char.agent, id: id, ssoToken: this.char.ssoToken });
  }

  assets() {
    return this.char.agent.request('get_characters_character_id_assets',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  clones() {
    return this.char.agent.request('get_characters_character_id_clones',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  recentKills(maxKillId?: number) {
    if (this.kms_ === undefined) {
      this.kms_ = makeKillmail(this.char.agent);
    }

    return this.recentKillmails(maxKillId).then(kms => {
      return Promise.all(
          kms.map(km => this.kms_!(km.killmail_id, km.killmail_hash)));
    });
  }

  kills() {
    return this.allKills.getAll();
  }

  recentKillmails(maxKillId?: number) {
    return this.char.agent.request(
        'get_characters_character_id_killmails_recent', {
          path: { character_id: this.char.id },
          query: { max_kill_id: maxKillId, max_count: 50 }
        }, this.char.ssoToken);
  }

  killmails() {
    return this.allMails.getAll();
  }

  loyaltyPoints() {
    return this.char.agent.request('get_characters_character_id_loyalty_points',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  ship() {
    return this.char.agent.request('get_characters_character_id_ship',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  location() {
    return this.char.agent.request('get_characters_character_id_location',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  online() {
    return this.char.agent.request('get_characters_character_id_online',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  wallets() {
    return this.char.agent.request('get_characters_character_id_wallets',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  skills() {
    return this.char.agent.request('get_characters_character_id_skills',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  skillqueue() {
    return this.char.agent.request('get_characters_character_id_skillqueue',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  agentResearch() {
    return this.char.agent.request(
        'get_characters_character_id_agents_research',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  chatChannels() {
    return this.char.agent.request('get_characters_character_id_chat_channels',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  medals() {
    return this.char.agent.request('get_characters_character_id_medals',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  standings() {
    return this.char.agent.request('get_characters_character_id_standings',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  opportunities() {
    return this.char.agent.request('get_characters_character_id_opportunities',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  orders() {
    return this.char.agent.request('get_characters_character_id_orders',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  blueprints() {
    return this.char.agent.request('get_characters_character_id_blueprints',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  roles() {
    return this.char.agent.request('get_characters_character_id_roles',
        { path: { character_id: this.char.id } }, this.char.ssoToken);
  }

  industryJobs(includeCompleted = false) {
    return this.char.agent.request('get_characters_character_id_industry_jobs',
        {
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
