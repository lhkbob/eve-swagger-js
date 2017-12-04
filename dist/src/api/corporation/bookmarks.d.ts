import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
import * as r from '../../internal/resource-api';
/**
 * An api adapter that provides functions for accessing an authenticated
 * corporation's bookmarks via the
 * [bookmark](https://esi.tech.ccp.is/latest/#/Bookmarks) ESI end points.
 */
export declare class Bookmarks {
    private agent;
    private details_?;
    private folders_?;
    constructor(agent: SSOAgent<number | r.impl.IDProvider>);
    /**
     * @esi_route get_corporations_corporation_id_bookmarks
     *
     * @return All bookmark details for the corporation
     */
    details(): AsyncIterableIterator<esi.corporation.Bookmark>;
    /**
     * @esi_route get_corporations_corporation_id_bookmarks_folders
     *
     * @returns An iterator over the folders for bookmark management
     */
    folders(): AsyncIterableIterator<esi.corporation.BookmarksFolder>;
    private getDetailsPage(page);
    private getFoldersPage(page);
}
