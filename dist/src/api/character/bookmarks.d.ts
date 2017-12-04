import { SSOAgent } from '../../internal/esi-agent';
import { esi } from '../../esi';
/**
 * An api adapter that provides functions for accessing an authenticated
 * character's bookmarks via the
 * [bookmark](https://esi.tech.ccp.is/latest/#/Bookmarks) ESI end points.
 */
export declare class Bookmarks {
    private agent;
    private details_?;
    private folders_?;
    constructor(agent: SSOAgent<number>);
    /**
     * @esi_route get_characters_character_id_bookmarks
     *
     * @return All bookmark details for the character
     */
    details(): AsyncIterableIterator<esi.character.Bookmark>;
    /**
     * @esi_route get_characters_character_id_bookmarks_folders
     *
     * @returns An iterator over the folders for bookmark management
     */
    folders(): AsyncIterableIterator<esi.character.BookmarksFolder>;
    private getDetails();
    private getFolders();
}
