import { SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';
/**
 * An api adapter over the end points handling a specific message in a
 * character's inbox via functions in the
 * [mail](https://esi.evetech.net/latest/#/Mail) ESI endpoints.
 */
export interface Message {
    /**
     * @esi_example esi.characters(1, 'token').mail(2).info()
     *
     * @returns The full message content
     */
    info(): Promise<Responses['get_characters_character_id_mail_mail_id']>;
    /**
     * @esi_example esi.characters(1, 'token').mail(2).del()
     *
     * @returns An empty promise that resolves after the message has been deleted
     */
    del(): Promise<Responses['delete_characters_character_id_mail_mail_id']>;
    /**
     * @esi_example esi.characters(1, 'token').mail(2).update({...})
     *
     * @param state The new labels and read status for the message
     * @return An empty promise that resolves after the message has been updated
     */
    update(state: esi.character.mail.MailUpdate): Promise<Responses['put_characters_character_id_mail_mail_id']>;
    /**
     * @returns The message id
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling a specific label in a
 * character's inbox via functions in the
 * [mail](https://esi.evetech.net/latest/#/Mail) ESI endpoints.
 */
export interface Label {
    /**
     * @esi_example esi.characters(1, 'token').mail.labels(2).del()
     *
     * @returns An empty promise that resolves after the label has been deleted
     */
    del(): Promise<Responses['delete_characters_character_id_mail_labels_label_id']>;
    /**
     * @returns The label's id
     */
    id(): Promise<number>;
}
/**
 * An api adapter over the end points handling all labels in the character's
 * inbox via functions in the [mail](https://esi.evetech.net/latest/#/Mail) ESI
 * endpoints.
 */
export interface Labels {
    /**
     * Get a Label instance corresponding to the given label `id`.
     * @param id The label id
     * @returns A Label API wrapper
     */
    (id: number): Label;
    /**
     * @esi_route get_characters_character_id_mail_labels [labels]
     * @esi_example esi.characters(1, 'token').mail.labels()
     *
     * @returns Details for all of a character's mail labels
     */
    (): Promise<esi.character.mail.Label[]>;
    /**
     * @esi_example esi.characters(1, 'token').mail.labels.add({...})
     *
     * @param settings The initial state of the new label
     * @returns The new label's id
     */
    add(settings: esi.character.mail.NewLabel): Promise<Responses['post_characters_character_id_mail_labels']>;
}
/**
 * An api adapter over the end points handling the mail inbox for a character
 * via functions in the [mail](https://esi.evetech.net/latest/#/Mail) ESI
 * endpoints.
 */
export interface Mail {
    /**
     * @esi_example esi.characters(1, 'token').mail()
     *
     * @param labelIds If empty, no filtering is performed, otherwise the set
     * of labels the returned message headers are restricted to
     * @param lastMailId {Number} If not provided, the most recent mails are
     *     returned, otherwise only messages older than the given id are returned
     * @returns List of message headers in the character's inbox
     */
    (labelIds?: number[], lastMailId?: number): Promise<Responses['get_characters_character_id_mail']>;
    /**
     * Get a Message instance for the given message or mail id.
     *
     * @param id The message id
     * @returns An API wrapper providing access to the given message
     */
    (id: number): Message;
    /**
     * A Labels instance for this character, allowing access to the labels they
     * have created.
     */
    labels: Labels;
    /**
     * This makes a request to the `labels` route and then filters the result
     * to just return the total unread count.
     *
     * @esi_route get_characters_character_id_mail_labels [total_unread_count]
     * @esi_returns total_unread_count
     * @esi_example esi.characters(1, 'token').mail.unreadCount()
     *
     * @returns The total number of unread messages in a character's inbox
     */
    unreadCount(): Promise<number>;
    /**
     * @esi_route post_characters_character_id_cspa
     * @esi_example esi.characters(1, 'token').mail.cspaCost()
     *
     * @param toIds Array of entities to potentially send a mail to
     * @returns The cspa cost for sending a message to the given entities
     */
    cspaCost(toIds: number[]): Promise<number>;
    /**
     * Fetch all mails for the character as a single array. Use with caution as
     * certain characters could have substantial amounts of mail.
     *
     * @returns All message headers in the character's inbox
     */
    all(): Promise<Responses['get_characters_character_id_mail']>;
    /**
     * @esi_example esi.characters(1, 'token').mail.send({...})
     *
     * @param mail The mail specification
     * @return The sent mail's id
     */
    send(mail: esi.character.mail.NewMail): Promise<Responses['post_characters_character_id_mail']>;
    /**
     * @esi_example esi.characters(1, 'token').mail.lists()
     *
     * @returns List of details for a character's mailing list memberships
     */
    lists(): Promise<Responses['get_characters_character_id_mail_lists']>;
}
/**
 * Create a new {@link Mail} instance that uses the given character agent to
 * make its HTTP requests to the ESI interface.
 *
 * @param char The character access information
 * @returns An Mail API instance
 */
export declare function makeMail(char: SSOAgent): Mail;
