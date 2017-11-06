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

  constructor(private agent: SSOAgent) {
  }

  /**
   * @esi_route get_corporations_corporation_id_bookmarks
   *
   * @return All bookmark details for the corporation
   */
  details(): AsyncIterableIterator<esi.corporation.Bookmark> {
    if (this.details_ === undefined) {
      this.details_ = r.impl.makePageBasedStreamer(
          page => this.agent.agent.request(
              'get_corporations_corporation_id_bookmarks', {
                path: { corporation_id: this.agent.id }, query: { page: page }
              }, this.agent.ssoToken)
          .then(result => ({ result, maxPages: undefined })));
    }

    return this.details_();
  }

  /**
   * @esi_route get_corporations_corporation_id_bookmarks_folders
   *
   * @returns An iterator over the folders for bookmark management
   */
  folders() {
    if (this.folders_ === undefined) {
      this.folders_ = r.impl.makePageBasedStreamer(
          page => this.agent.agent.request(
              'get_corporations_corporation_id_bookmarks_folders', {
                path: { corporation_id: this.agent.id }, query: { page: page }
              }, this.agent.ssoToken)
          .then(result => ({ result, maxPages: undefined })), 1000);
    }
    return this.folders_();
  }
}
