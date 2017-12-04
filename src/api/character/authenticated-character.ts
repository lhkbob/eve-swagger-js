import { SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../esi';
import * as r from '../../internal/resource-api';

import { IteratedKillmails } from '../killmails';

import { Bookmarks } from './bookmarks';
import { Calendar, makeCalendar } from './calendar';
import { Colonies, makeColonies } from './colonies';
import { Contacts, makeContacts } from './contacts';
import { Fittings, makeFittings } from './fittings';
import { CharacterFleet, makeFleet } from '../fleet';
import { Mail } from './mail';
import { Structures, makeStructures } from '../structures';

import { AuthenticatedCorporation } from '../corporation/authenticated-corporation';
import { Character, CharacterAPI } from './characters';
import { Contracts, makeContracts } from './contracts';
import { UI } from './ui';
import { Assets, makeAssets } from './assets';
import { Notifications } from './notifications';
import { Skills } from './skills';
import { Wallet } from './wallet';

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
export class AuthenticatedCharacter extends r.impl.SimpleResource implements r.Async<CharacterAPI> {
  private base_?: Character;

  private kms_?: IteratedKillmails;
  private mining_?: r.impl.ResourceStreamer<esi.character.MiningRecord>;

  private assets_?: Assets;
  private bookmarks_?: Bookmarks;
  private calendar_?: Calendar;
  private colonies_?: Colonies;
  private contacts_?: Contacts;
  private contracts_?: Contracts;
  private corp_?: AuthenticatedCorporation;
  private fittings_?: Fittings;
  private fleet_?: CharacterFleet;
  private mail_?: Mail;
  private notifications_?: Notifications;
  private skills_?: Skills;
  private structures_?: Structures;
  private ui_?: UI;
  private wallet_?: Wallet;

  constructor(private agent: SSOAgent<number>) {
    super(agent.id);
  }

  get assets(): Assets {
    if (this.assets_ === undefined) {
      this.assets_ = makeAssets(this.agent);
    }
    return this.assets_;
  }

  get bookmarks(): Bookmarks {
    if (this.bookmarks_ === undefined) {
      this.bookmarks_ = new Bookmarks(this.agent);
    }
    return this.bookmarks_;
  }

  get calendar(): Calendar {
    if (this.calendar_ === undefined) {
      this.calendar_ = makeCalendar(this.agent);
    }
    return this.calendar_;
  }

  get colonies(): Colonies {
    if (this.colonies_ === undefined) {
      this.colonies_ = makeColonies(this.agent);
    }
    return this.colonies_;
  }

  get contacts(): Contacts {
    if (this.contacts_ === undefined) {
      this.contacts_ = makeContacts(this.agent);
    }
    return this.contacts_;
  }

  get contracts(): Contracts {
    if (this.contracts_ === undefined) {
      this.contracts_ = makeContracts(this.agent);
    }
    return this.contracts_;
  }

  get corporation(): AuthenticatedCorporation {
    if (this.corp_ === undefined) {
      this.corp_ = new AuthenticatedCorporation(this.agent.agent,
          this.agent.ssoToken,
          () => this.details().then(details => details.corporation_id),
          this.agent.id);
    }
    return this.corp_;
  }

  get fittings(): Fittings {
    if (this.fittings_ === undefined) {
      this.fittings_ = makeFittings(this.agent);
    }
    return this.fittings_;
  }

  get fleet(): CharacterFleet {
    if (this.fleet_ === undefined) {
      this.fleet_ = makeFleet(this.agent, 'character');
    }
    return this.fleet_;
  }

  get mail(): Mail {
    if (this.mail_ === undefined) {
      this.mail_ = new Mail(this.agent);
    }
    return this.mail_;
  }

  get notifications(): Notifications {
    if (this.notifications_ === undefined) {
      this.notifications_ = new Notifications(this.agent);
    }
    return this.notifications_;
  }

  get skills(): Skills {
    if (this.skills_ === undefined) {
      this.skills_ = new Skills(this.agent);
    }
    return this.skills_;
  }

  get structures(): Structures {
    if (this.structures_ === undefined) {
      // Do not provide a corporation ID so that it must be determined
      // dynamically
      this.structures_ = makeStructures(this.agent.agent, this.agent.ssoToken,
          this.agent.id, undefined);
    }
    return this.structures_;
  }

  get ui(): UI {
    if (this.ui_ === undefined) {
      this.ui_ = new UI(this.agent);
    }
    return this.ui_;
  }

  get wallet(): Wallet {
    if (this.wallet_ === undefined) {
      this.wallet_ = new Wallet(this.agent);
    }
    return this.wallet_;
  }

  get kills(): IteratedKillmails {
    if (this.kms_ === undefined) {
      this.kms_ = new IteratedKillmails(this.agent.agent,
          r.impl.makeMaxIDStreamer(fromID => this.recentKillmails(fromID),
              e => e.killmail_id, KILLMAIL_PAGE_SIZE));
    }
    return this.kms_;
  }

  private recentKillmails(maxKillId?: number) {
    return this.agent.agent.request(
        'get_characters_character_id_killmails_recent', {
          path: { character_id: this.agent.id },
          query: { max_kill_id: maxKillId, max_count: KILLMAIL_PAGE_SIZE }
        }, this.agent.ssoToken);
  }

  /**
   * @returns The character's current jump fatigue
   */
  fatigue(): Promise<Responses['get_characters_character_id_fatigue']> {
    return this.agent.agent.request('get_characters_character_id_fatigue',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's titles
   */
  titles(): Promise<Responses['get_characters_character_id_titles']> {
    return this.agent.agent.request('get_characters_character_id_titles',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @esi_route get_characters_character_id_mining
   *
   * @returns An iterator over the character's mining ledger
   */
  miningLedger(): AsyncIterableIterator<esi.character.MiningRecord> {
    if (this.mining_ === undefined) {
      this.mining_ = r.impl.makePageBasedStreamer(
          page => this.getMiningPage(page), 1000);
    }

    return this.mining_();
  }

  private getMiningPage(page: number) {
    return this.agent.agent.request('get_characters_character_id_mining',
        { path: { character_id: this.agent.id }, query: { page: page } },
        this.agent.ssoToken).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @returns The character's available jump clones
   */
  clones(): Promise<Responses['get_characters_character_id_clones']> {
    return this.agent.agent.request('get_characters_character_id_clones',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's loyalty points with the different NPC groups
   */
  loyaltyPoints(): Promise<Responses['get_characters_character_id_loyalty_points']> {
    return this.agent.agent.request(
        'get_characters_character_id_loyalty_points',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's currently boarded ship
   */
  ship(): Promise<Responses['get_characters_character_id_ship']> {
    return this.agent.agent.request('get_characters_character_id_ship',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's location in Eve
   */
  location(): Promise<Responses['get_characters_character_id_location']> {
    return this.agent.agent.request('get_characters_character_id_location',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's online status
   */
  online(): Promise<Responses['get_characters_character_id_online']> {
    return this.agent.agent.request('get_characters_character_id_online',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's current research progress with known agents
   */
  research(): Promise<Responses['get_characters_character_id_agents_research']> {
    return this.agent.agent.request(
        'get_characters_character_id_agents_research',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's current chat channel memberships
   */
  chatChannels(): Promise<Responses['get_characters_character_id_chat_channels']> {
    return this.agent.agent.request('get_characters_character_id_chat_channels',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's earned medals
   */
  medals(): Promise<Responses['get_characters_character_id_medals']> {
    return this.agent.agent.request('get_characters_character_id_medals',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's corporation standings
   */
  standings(): Promise<Responses['get_characters_character_id_standings']> {
    return this.agent.agent.request('get_characters_character_id_standings',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's progress through Eve's opportunities system
   */
  opportunities(): Promise<Responses['get_characters_character_id_opportunities']> {
    return this.agent.agent.request('get_characters_character_id_opportunities',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's active buy and sell market orders
   */
  orders(): Promise<Responses['get_characters_character_id_orders']> {
    return this.agent.agent.request('get_characters_character_id_orders',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @returns The character's assigned roles in their corporation
   */
  roles(): Promise<Responses['get_characters_character_id_roles']> {
    return this.agent.agent.request('get_characters_character_id_roles',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }

  /**
   * @param includeCompleted Whether or not to include completed jobs, defaults
   *     to false
   * @returns List of industry jobs run by the character
   */
  industryJobs(includeCompleted: boolean = false): Promise<Responses['get_characters_character_id_industry_jobs']> {
    return this.agent.agent.request('get_characters_character_id_industry_jobs',
        {
          path: { character_id: this.agent.id },
          query: { include_completed: includeCompleted }
        }, this.agent.ssoToken);
  }

  private get base(): Character {
    if (this.base_ === undefined) {
      this.base_ = new Character(this.agent.agent, this.id_);
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
