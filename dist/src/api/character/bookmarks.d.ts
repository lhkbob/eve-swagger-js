import { SSOAgent } from '../../internal/esi-agent';
import { Responses } from '../../../gen/esi';
/**
 * An api adapter over the end points handling a character's bookmarks via
 * functions in the [bookmarks](https://esi.evetech.net/latest/#/Bookmarks)
 * ESI endpoints.
 */
export interface Bookmarks {
    /**
     * @esi_example esi.characters(id, 'token').bookmarks()
     *
     * @returns Details about the character's bookmarks
     */
    (): Promise<Responses['get_characters_character_id_bookmarks']>;
    /**
     * @esi_example esi.characters(id, 'token').bookmarks.folders()
     *
     * @returns Information about a character's bookmark folders
     */
    folders(): Promise<Responses['get_characters_character_id_bookmarks_folders']>;
}
/**
 * Create a new {@link Bookmarks} instance that uses the given character agent
 * to make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Bookmarks API instance
 */
export declare function makeBookmarks(char: SSOAgent): Bookmarks;
