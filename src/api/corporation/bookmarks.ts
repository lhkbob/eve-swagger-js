import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';

/**
 * An api adapter that provides functions for accessing an authenticated
 * corporation's bookmarks via the
 * [bookmark](https://esi.tech.ccp.is/latest/#/Bookmarks) ESI end points.
 */
export class Bookmarks {
  private details_?: r.impl.ResourceStreamer<esi.corporation.Bookmark>;
  private folders_?: r.impl.ResourceStreamer<esi.corporation.BookmarksFolder>;

  constructor(private agent: SSOAgent<number | r.impl.IDProvider>) {
  }

  /**
   * @esi_route get_corporations_corporation_id_bookmarks
   *
   * @return All bookmark details for the corporation
   */
  details(): AsyncIterableIterator<esi.corporation.Bookmark> {
    if (this.details_ === undefined) {
      this.details_ = r.impl.makePageBasedStreamer(
          page => this.getDetailsPage(page)
          .then(result => ({ result, maxPages: undefined })));
    }

    return this.details_();
  }

  /**
   * @esi_route get_corporations_corporation_id_bookmarks_folders
   *
   * @returns An iterator over the folders for bookmark management
   */
  folders(): AsyncIterableIterator<esi.corporation.BookmarksFolder> {
    if (this.folders_ === undefined) {
      this.folders_ = r.impl.makePageBasedStreamer(
          page => this.getFoldersPage(page)
          .then(result => ({ result, maxPages: undefined })), 1000);
    }
    return this.folders_();
  }

  private async getDetailsPage(page: number) {
    let corpID: number;
    if (typeof this.agent.id === 'number') {
      corpID = this.agent.id;
    } else {
      corpID = await this.agent.id();
    }

    return this.agent.agent.request('get_corporations_corporation_id_bookmarks',
        {
          path: { corporation_id: corpID }, query: { page: page }
        }, this.agent.ssoToken);
  }

  private async getFoldersPage(page: number) {
    let corpID: number;
    if (typeof this.agent.id === 'number') {
      corpID = this.agent.id;
    } else {
      corpID = await this.agent.id();
    }

    return this.agent.agent.request(
        'get_corporations_corporation_id_bookmarks_folders', {
          path: { corporation_id: corpID }, query: { page: page }
        }, this.agent.ssoToken);
  }
}
