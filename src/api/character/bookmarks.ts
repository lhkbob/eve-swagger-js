import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';

/**
 * An api adapter that provides functions for accessing an authenticated
 * character's bookmarks via the
 * [bookmark](https://esi.tech.ccp.is/latest/#/Bookmarks) ESI end points.
 */
export class Bookmarks {
  private details_?: r.impl.ResourceStreamer<esi.character.Bookmark>;
  private folders_?: r.impl.ResourceStreamer<esi.character.BookmarksFolder>;

  constructor(private agent: SSOAgent<number>) {
  }

  /**
   * @esi_route get_characters_character_id_bookmarks
   *
   * @return All bookmark details for the character
   */
  details(): AsyncIterableIterator<esi.character.Bookmark> {
    if (this.details_ === undefined) {
      this.details_ = r.impl.makeArrayStreamer(() => this.getDetails());
    }

    return this.details_();
  }

  /**
   * @esi_route get_characters_character_id_bookmarks_folders
   *
   * @returns An iterator over the folders for bookmark management
   */
  folders(): AsyncIterableIterator<esi.character.BookmarksFolder> {
    if (this.folders_ === undefined) {
      this.folders_ = r.impl.makeArrayStreamer(() => this.getFolders());
    }
    return this.folders_();
  }

  private getDetails() {
    return this.agent.agent.request('get_characters_character_id_bookmarks', {
      path: { character_id: this.agent.id },
    }, this.agent.ssoToken);
  }

  private getFolders() {
    return this.agent.agent.request(
        'get_characters_character_id_bookmarks_folders', {
          path: { character_id: this.agent.id },
        }, this.agent.ssoToken);
  }
}
