import { ESIAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';
import { AllianceAPI } from './alliances';
/**
 * An api adapter for accessing various details of a single alliance,
 * specified by a provided id when the api is instantiated.
 *
 * This API is authenticated by an SSO token corresponding to a member. Some
 * functions that are exposed expect the member to have specific in-game roles.
 * If these permissions are not met when a request is made to ESI, then it will
 * respond with an error.
 */
export declare class AuthenticatedAlliance implements r.Async<AllianceAPI>, r.SingleResource {
    private agent;
    private base_?;
    private contacts_?;
    constructor(agent: ESIAgent, ssoToken: string, id: number | r.impl.IDProvider);
    /**
     * @esi_route get_alliances_alliance_id_contacts
     *
     * @returns Get an iterator over the contacts of the alliance
     */
    contacts(): AsyncIterableIterator<esi.alliance.Contact>;
    private getContactsPage(page);
    private readonly base;
    details(): Promise<esi.alliance.Alliance>;
    corporations(): Promise<number[]>;
    icons(): Promise<esi.alliance.Icons>;
    names(): Promise<string>;
    ids(): Promise<number>;
}
