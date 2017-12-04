import { ESIAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';
import { CorporationAPI } from './corporations';
import { IteratedKillmails } from '../killmails';
import { Structures } from '../structures';
import { Assets } from './assets';
import { Wallets } from './wallets';
import { Starbases } from './starbases';
import { esi, Responses } from '../../esi';
import { Mining } from './mining';
import { Members } from './members';
/**
 * An api adapter for accessing various details of a single corporation,
 * specified by a provided id when the api is instantiated.
 *
 * This API is authenticated by an SSO token corresponding to a member. Some
 * functions that are exposed expect the member to have specific in-game roles.
 * If these permissions are not met when a request is made to ESI, then it will
 * respond with an error.
 */
export declare class AuthenticatedCorporation implements r.Async<CorporationAPI>, r.SingleResource {
    private charID;
    private agent;
    private base_?;
    private kills_?;
    private assets_?;
    private wallets_?;
    private starbases_?;
    private mining_?;
    private members_?;
    private structures_?;
    private industryJobs_?;
    private industryJobsCompleted_?;
    private roleHistory_?;
    private contacts_?;
    private standings_?;
    private shareholders_?;
    private customsOffices_?;
    private orders_?;
    private medals_?;
    private medalsIssued_?;
    constructor(agent: ESIAgent, ssoToken: string, id: number | r.impl.IDProvider, charID?: number | undefined);
    readonly structures: Structures;
    readonly members: Members;
    readonly kills: IteratedKillmails;
    private getKillsPage(maxID?);
    readonly assets: Assets;
    readonly mining: Mining;
    readonly wallets: Wallets;
    readonly starbases: Starbases;
    /**
     * @esi_route get_corporations_corporation_id_industry_jobs
     *
     * @param includeCompleted Whether or not to include completed jobs, defaults
     *     to false
     * @returns An iterator over all industry jobs
     */
    industryJobs(includeCompleted?: boolean): AsyncIterableIterator<esi.corporation.industry.Job>;
    private getIndustryJobPage(page, includeCompleted);
    /**
     * @returns Available titles and their corresponding roles in the corp
     */
    titles(): Promise<Responses['get_corporations_corporation_id_titles']>;
    /**
     * @esi_route get_corporations_corporation_id_roles_history
     *
     * @returns The history of role assignments and edits for the corp's members
     */
    rolesHistory(): AsyncIterableIterator<esi.corporation.RolesHistory>;
    private getRolesHistoryPage(page);
    /**
     * @esi_route get_corporations_corporation_id_contacts
     *
     * @returns An iterator over all of the contacts for the corporation
     */
    contacts(): AsyncIterableIterator<esi.corporation.Contact>;
    private getContactsPage(page);
    /**
     * @esi_route get_corporations_corporation_id_standings
     *
     * @returns An iterator over all set standings for the corporation
     */
    standings(): AsyncIterableIterator<esi.Standing>;
    private getStandingsPage(page);
    /**
     * @esi_route get_corporations_corporation_id_shareholders
     * @returns An iterator over all shareholders of the corporation
     */
    shareholders(): AsyncIterableIterator<esi.corporation.Shareholder>;
    private getShareholdersPage(page);
    /**
     * @returns Information on all of the facilities owned by the corporation
     */
    facilities(): Promise<Responses['get_corporations_corporation_id_facilities']>;
    /**
     * @esi_route get_corporations_corporation_id_customs_offices
     *
     * @returns An iterator over all customs offices owned by the corporation
     */
    customsOffices(): AsyncIterableIterator<esi.corporation.structure.CustomsOffice>;
    private getCustomsOfficesPage(page);
    /**
     * @esi_route get_corporations_corporation_id_orders
     *
     * @returns An iterator over all active market orders for the corporation
     */
    orders(): AsyncIterableIterator<esi.market.Order>;
    private getOrdersPage(page);
    /**
     * @esi_route get_corporations_corporation_id_medals
     *
     * @returns An iterator over all medals declared by the corporation
     */
    medals(): AsyncIterableIterator<esi.corporation.Medal>;
    private getMedalsPage(page);
    /**
     * @esi_route get_corporations_corporation_id_medals_issued
     *
     * @returns An iterator over all medal issuing events for the corporation
     */
    issuedMedals(): AsyncIterableIterator<esi.corporation.MedalsIssued>;
    private getMedalsIssuedPage(page);
    details(): Promise<esi.corporation.Corporation>;
    history(): Promise<esi.corporation.AllianceHistory[]>;
    icons(): Promise<esi.corporation.Icons>;
    loyaltyOffers(): Promise<esi.corporation.LoyaltyStoreOffer[]>;
    names(): Promise<string>;
    ids(): Promise<number>;
    private readonly base;
}
