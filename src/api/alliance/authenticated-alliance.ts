import { ESIAgent, SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';

import { Alliance, AllianceAPI } from './alliances';

/**
 * An api adapter for accessing various details of a single alliance,
 * specified by a provided id when the api is instantiated.
 *
 * This API is authenticated by an SSO token corresponding to a member. Some
 * functions that are exposed expect the member to have specific in-game roles.
 * If these permissions are not met when a request is made to ESI, then it will
 * respond with an error.
 */
export class AuthenticatedAlliance implements r.Async<AllianceAPI>, r.SingleResource {
  private agent: SSOAgent<number | r.impl.IDProvider>;

  private base_?: Alliance;
  private contacts_?:r.impl.ResourceStreamer<esi.alliance.Contact>;

  constructor(agent: ESIAgent, ssoToken: string,
      id: number | r.impl.IDProvider) {
    this.agent = { agent, ssoToken, id };
  }

  /**
   * @esi_route get_alliances_alliance_id_contacts
   *
   * @returns Get an iterator over the contacts of the alliance
   */
  contacts(): AsyncIterableIterator<esi.alliance.Contact> {
    if (this.contacts_ === undefined) {
      this.contacts_ = r.impl.makePageBasedStreamer(page => this.getContactsPage(page), 1000);
    }
    return this.contacts_();
  }

  private async getContactsPage(page: number) {
    return this.agent.agent.request('get_alliances_alliance_id_contacts',
        { path: { alliance_id: await this.ids() }, query: { page: page } },
        this.agent.ssoToken).then(result => ({ result, maxPages: undefined }));
  }

  private get base(): Alliance {
    if (this.base_ === undefined) {
      this.base_ = new Alliance(this.agent.agent, this.agent.id);
    }
    return this.base_;
  }

  details() {
    return this.base.details();
  }

  corporations() {
    return this.base.corporations();
  }

  icons() {
    return this.base.icons();
  }

  names() {
    return this.base.names();
  }

  ids() {
    if (typeof this.agent.id === 'number') {
      return Promise.resolve(this.agent.id);
    } else {
      return this.agent.id();
    }
  }
}