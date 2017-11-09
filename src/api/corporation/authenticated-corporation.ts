import { ESIAgent, SSOAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';
import { Corporation, CorporationAPI } from './corporations';
import { IteratedKillmails } from '../killmails';
import { Assets, makeAssets } from './assets';
import { Wallets } from './wallets';
import { makeStarbases, Starbases } from './starbases';
import { esi, Responses } from '../../esi';
import { Mining } from './mining';
import { makeMembers, Members } from './members';

/**
 * An api adapter for accessing various details of a single corporation,
 * specified by a provided id when the api is instantiated.
 *
 * This API is authenticated by an SSO token corresponding to a member. Some
 * functions that are exposed expect the member to have specific in-game roles.
 * If these permissions are not met when a request is made to ESI, then it will
 * respond with an error.
 */
export class AuthenticatedCorporation implements r.Async<CorporationAPI>, r.SingleResource {
  private agent: SSOAgent<number | r.impl.IDProvider>;

  private base_?: Corporation;
  private kills_?: IteratedKillmails;
  private assets_?: Assets;
  private wallets_?: Wallets;
  private starbases_?: Starbases;
  private mining_?: Mining;
  private members_?: Members;

  private industryJobs_?: r.impl.ResourceStreamer<esi.corporation.industry.Job>;
  private industryJobsCompleted_?: r.impl.ResourceStreamer<esi.corporation.industry.Job>;
  private roleHistory_?: r.impl.ResourceStreamer<esi.corporation.RolesHistory>;
  private contacts_?: r.impl.ResourceStreamer<esi.corporation.Contact>;
  private standings_?: r.impl.ResourceStreamer<esi.Standing>;
  private shareholders_?: r.impl.ResourceStreamer<esi.corporation.Shareholder>;
  private customsOffices_?: r.impl.ResourceStreamer<esi.corporation.structure.CustomsOffice>;
  private orders_?: r.impl.ResourceStreamer<esi.market.Order>;
  private medals_?: r.impl.ResourceStreamer<esi.corporation.Medal>;
  private medalsIssued_?: r.impl.ResourceStreamer<esi.corporation.MedalsIssued>;

  constructor(agent: ESIAgent, ssoToken: string,
      id: number | r.impl.IDProvider) {
    this.agent = {
      agent, ssoToken, id
    };
  }

  get members(): Members {
    if (this.members_ === undefined) {
      this.members_ = makeMembers(this.agent);
    }
    return this.members_;
  }

  get kills(): IteratedKillmails {
    if (this.kills_ === undefined) {
      this.kills_ = new IteratedKillmails(this.agent.agent,
          r.impl.makeMaxIDStreamer(maxID => this.getKillsPage(maxID),
              e => e.killmail_id, 1000));
    }
    return this.kills_;
  }

  private getKillsPage(maxID?: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_killmails_recent',
        { path: { corporation_id: corpID }, query: { max_kill_id: maxID } },
        this.agent.ssoToken));
  }

  get assets(): Assets {
    if (this.assets_ === undefined) {
      this.assets_ = makeAssets(this.agent);
    }
    return this.assets_;
  }

  get mining(): Mining {
    if (this.mining_ === undefined) {
      this.mining_ = new Mining(this.agent);
    }
    return this.mining_;
  }

  get wallets(): Wallets {
    if (this.wallets_ === undefined) {
      this.wallets_ = new Wallets(this.agent);
    }
    return this.wallets_;
  }

  get starbases(): Starbases {
    if (this.starbases_ === undefined) {
      this.starbases_ = makeStarbases(this.agent);
    }
    return this.starbases_;
  }

  // FIXME add structures() and members()

  /**
   * @esi_route get_corporations_corporation_id_industry_jobs
   *
   * @param includeCompleted Whether or not to include completed jobs, defaults
   *     to false
   * @returns An iterator over all industry jobs
   */
  industryJobs(includeCompleted: boolean = false): AsyncIterableIterator<esi.corporation.industry.Job> {
    if (includeCompleted) {
      if (this.industryJobsCompleted_ === undefined) {
        this.industryJobsCompleted_ = r.impl.makePageBasedStreamer(
            page => this.getIndustryJobPage(page, true), 1000);
      }

      return this.industryJobsCompleted_();
    } else {
      if (this.industryJobs_ === undefined) {
        this.industryJobs_ = r.impl.makePageBasedStreamer(
            page => this.getIndustryJobPage(page, false), 1000);
      }

      return this.industryJobs_();
    }
  }

  private getIndustryJobPage(page: number, includeCompleted: boolean) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_industry_jobs', {
          path: { corporation_id: corpID },
          query: { page: page, include_completed: includeCompleted }
        }, this.agent.ssoToken))
    .then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @returns Available titles and their corresponding roles in the corp
   */
  titles(): Promise<Responses['get_corporations_corporation_id_titles']> {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_titles',
        { path: { corporation_id: corpID } }, this.agent.ssoToken));
  }

  /**
   * @esi_route get_corporations_corporation_id_roles_history
   *
   * @returns The history of role assignments and edits for the corp's members
   */
  rolesHistory(): AsyncIterableIterator<esi.corporation.RolesHistory> {
    if (this.roleHistory_ === undefined) {
      this.roleHistory_ = r.impl.makePageBasedStreamer(
          page => this.getRolesHistoryPage(page), 1000);
    }
    return this.roleHistory_();
  }

  private getRolesHistoryPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_roles_history',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @esi_route get_corporations_corporation_id_contacts
   *
   * @returns An iterator over all of the contacts for the corporation
   */
  contacts(): AsyncIterableIterator<esi.corporation.Contact> {
    if (this.contacts_ === undefined) {
      this.contacts_ = r.impl.makePageBasedStreamer(
          page => this.getContactsPage(page), 1000);
    }
    return this.contacts_();
  }

  private getContactsPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_contacts',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @esi_route get_corporations_corporation_id_standings
   *
   * @returns An iterator over all set standings for the corporation
   */
  standings(): AsyncIterableIterator<esi.Standing> {
    if (this.standings_ === undefined) {
      this.standings_ = r.impl.makePageBasedStreamer(
          page => this.getStandingsPage(page), 1000);
    }
    return this.standings_();
  }

  private getStandingsPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_standings',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @esi_route get_corporations_corporation_id_shareholders
   * @returns An iterator over all shareholders of the corporation
   */
  shareholders(): AsyncIterableIterator<esi.corporation.Shareholder> {
    if (this.shareholders_ === undefined) {
      this.shareholders_ = r.impl.makePageBasedStreamer(
          page => this.getShareholdersPage(page), 1000);
    }
    return this.shareholders_();
  }

  private getShareholdersPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_shareholders',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @returns Information on all of the facilities owned by the corporation
   */
  facilities(): Promise<Responses['get_corporations_corporation_id_facilities']> {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_facilities',
        { path: { corporation_id: corpID } }, this.agent.ssoToken));
  }

  /**
   * @esi_route get_corporations_corporation_id_customs_offices
   *
   * @returns An iterator over all customs offices owned by the corporation
   */
  customsOffices(): AsyncIterableIterator<esi.corporation.structure.CustomsOffice> {
    if (this.customsOffices_ === undefined) {
      this.customsOffices_ = r.impl.makePageBasedStreamer(
          page => this.getCustomsOfficesPage(page), 1000);
    }
    return this.customsOffices_();
  }

  private getCustomsOfficesPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_customs_offices',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @esi_route get_corporations_corporation_id_orders
   *
   * @returns An iterator over all active market orders for the corporation
   */
  orders(): AsyncIterableIterator<esi.market.Order> {
    if (this.orders_ === undefined) {
      this.orders_ = r.impl.makePageBasedStreamer(
          page => this.getOrdersPage(page), 1000);
    }
    return this.orders_();
  }

  private getOrdersPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_orders',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken)).then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @esi_route get_corporations_corporation_id_medals
   *
   * @returns An iterator over all medals declared by the corporation
   */
  medals(): AsyncIterableIterator<esi.corporation.Medal> {
    if (this.medals_ === undefined) {
      this.medals_ = r.impl.makePageBasedStreamer(
          page => this.getMedalsPage(page), 1000);
    }
    return this.medals_();
  }

  private getMedalsPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_medals',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken))
    .then(result => ({ result, maxPages: undefined }));
  }

  /**
   * @esi_route get_corporations_corporation_id_medals_issued
   *
   * @returns An iterator over all medal issuing events for the corporation
   */
  issuedMedals(): AsyncIterableIterator<esi.corporation.MedalsIssued> {
    if (this.medalsIssued_ === undefined) {
      this.medalsIssued_ = r.impl.makePageBasedStreamer(
          page => this.getMedalsIssuedPage(page), 1000);
    }
    return this.medalsIssued_();
  }

  private getMedalsIssuedPage(page: number) {
    return this.ids()
    .then(corpID => this.agent.agent.request(
        'get_corporations_corporation_id_medals_issued',
        { path: { corporation_id: corpID }, query: { page: page } },
        this.agent.ssoToken))
    .then(result => ({ result, maxPages: undefined }));
  }

  // The plain un-authenticated corporation API

  details() {
    return this.base.then(b => b.details());
  }

  history() {
    return this.base.then(b => b.history());
  }

  icons() {
    return this.base.then(b => b.icons());
  }

  loyaltyOffers() {
    return this.base.then(b => b.loyaltyOffers());
  }

  names() {
    return this.base.then(b => b.names());
  }

  ids() {
    if (typeof this.agent.id === 'number') {
      return Promise.resolve(this.agent.id);
    } else {
      return this.agent.id().then(id => {
        // Switch over to a non-functional id (safe to cast to any and remove
        // read-only status since the SSOAgent was created by this class)
        (this.agent as any).id = id;
        return id;
      });
    }
  }

  private get base() {
    if (this.base_ === undefined) {
      return this.ids().then(id => {
        if (this.base_ === undefined) {
          this.base_ = new Corporation(this.agent.agent, id);
        }
        return this.base_;
      });
    } else {
      return Promise.resolve(this.base_);
    }
  }
}