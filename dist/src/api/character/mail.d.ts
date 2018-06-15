import { SSOAgent } from '../../internal/esi-agent';
import * as r from '../../internal/resource-api';
import { Responses, esi } from '../../esi';
/**
 * The API specification for all variants that access information about a
 * character's in-game mail message or messages. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all messages.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple messages are being accessed at once.
 *
 * An api adapter over the end points handling a specific message via functions
 * in the [mail](https://esi.tech.ccp.is/latest/#Mail) ESI endpoints.
 */
export interface MessageAPI {
    details: Responses['get_characters_character_id_mail_mail_id'];
    summary: esi.character.mail.MailHeader;
}
/**
 * An api adapter for accessing various details of a single message,
 * specified by a provided mail id when the api is instantiated.
 */
export declare class Message extends r.impl.SimpleResource implements r.Async<MessageAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, id: number);
    /**
     * @returns The full message content
     */
    details(): Promise<esi.character.mail.Mail>;
    /**
     * @esi_route ~get_characters_character_id_mail_mail_id
     *
     * @returns The summary header for the message
     */
    summary(): Promise<esi.character.mail.MailHeader>;
    /**
     * @esi_route delete_characters_character_id_mail_mail_id
     *
     * @returns An empty promise that resolves after the message has been deleted
     */
    del(): Promise<undefined>;
    /**
     * @esi_route put_characters_character_id_mail_mail_id
     *
     * @param labels The label ids attached to the message
     * @param read Whether or not the message is marked as read, defaults to true
     * @return An empty promise that resolves after the message has been updated
     */
    update(labels: number[], read?: boolean): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of a set of messages,
 * specified by provided mail ids when the api is instantiated.
 */
export declare class MappedMessages extends r.impl.SimpleMappedResource implements r.Mapped<MessageAPI> {
    private agent;
    private headers_?;
    constructor(agent: SSOAgent<number>, ids: number[] | Set<number>);
    /**
     * @returns The full message content, mapped by id
     */
    details(): Promise<Map<number, esi.character.mail.Mail>>;
    /**
     * @esi_route ~get_characters_character_id_mail_mail_id
     * @esi_route ~get_characters_character_id_mail
     *
     * @returns The summary header for the message, mapped by id
     */
    summary(): Promise<Map<number, esi.character.mail.MailHeader>>;
    /**
     * @esi_route delete_characters_character_id_mail_mail_id
     *
     * @returns An empty promise that resolves after messages have been deleted
     */
    del(): Promise<undefined>;
    /**
     * @esi_route put_characters_character_id_mail_mail_id
     *
     * @param labels The label ids attached to the messages
     * @param read Whether or not the messages are marked as read, defaults to
     *     true
     * @return An empty promise that resolves after the messages have been
     *     updated
     */
    update(labels: number[], read?: boolean): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every mail in the
 * character's inbox, possibly constrained by a set of labels specified at
 * construction.
 */
export declare class IteratedMessages extends r.impl.SimpleIteratedResource<esi.character.mail.MailHeader> implements r.Iterated<MessageAPI> {
    private agent;
    constructor(agent: SSOAgent<number>, labels: number[] | Set<number> | r.impl.IDSetProvider);
    /**
     * @returns The message details for every mail in the character's inbox,
     *    possibly constrained by a label set
     */
    details(): AsyncIterableIterator<[number, esi.character.mail.Mail]>;
    /**
     * @returns The message summaries for every mail in the character's inbox,
     *    possibly constrained by a label set
     */
    summary(): AsyncIterableIterator<[number, esi.character.mail.MailHeader]>;
}
/**
 * The API specification for all variants that access information about a
 * character's in-game mail label or labels. This interface will not be used
 * directly, but will be filtered through some mapper, such as {@link Async} or
 * {@link Mapped} depending on what types of ids are being accessed. However,
 * this allows for a concise and consistent specification for all variants:
 * single, multiple, and all labels.
 *
 * When mapped, each key defined in this interface becomes a function that
 * returns a Promise resolving to the key's member, or a collection related to
 * the key's member if multiple labels are being accessed at once.
 *
 * An api adapter over the end points handling a specific message via functions
 * in the [mail](https://esi.tech.ccp.is/latest/#Mail) ESI endpoints.
 */
export interface LabelAPI {
    details: esi.character.mail.Label;
    unreadCount: number;
}
/**
 * An api adapter for accessing various details of a single mail label,
 * specified by a provided label id when the api is instantiated.
 */
export declare class Label extends r.impl.SimpleResource implements r.Async<LabelAPI> {
    private agent;
    private messages_?;
    constructor(agent: SSOAgent<number>, id: number);
    /**
     * @returns An IteratedMessages API restricted to this specific label
     */
    readonly messages: IteratedMessages;
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The full label details
     */
    details(): Promise<esi.character.mail.Label>;
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The number of unread messages with this label
     */
    unreadCount(): Promise<number>;
    /**
     * @esi_route delete_characters_character_id_mail_labels_label_id
     *
     * @returns An empty promise that resolves after the label has been deleted
     */
    del(): Promise<undefined>;
}
/**
 * An api adapter for accessing various details of a set of labels,
 * specified by provided label ids when the api is instantiated.
 */
export declare class MappedLabels extends r.impl.SimpleMappedResource implements r.Mapped<LabelAPI> {
    private agent;
    private messages_?;
    constructor(agent: SSOAgent<number>, ids: number[] | Set<number>);
    /**
     * @returns An IteratedMessages API restricted to the label set
     */
    readonly messages: IteratedMessages;
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The full label details, mapped by label id
     */
    details(): Promise<Map<number, esi.character.mail.Label>>;
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The number of unread messages for each label, mapped by id
     */
    unreadCount(): Promise<Map<any, any>>;
    /**
     * @esi_route delete_characters_character_id_mail_labels_label_id
     *
     * @returns An empty promise that resolves after all specified labels have
     *     been deleted
     */
    del(): Promise<undefined>;
}
/**
 * An api adapter for accessing various details about every label in the
 * character's inbox.
 */
export declare class IteratedLabels extends r.impl.SimpleIteratedResource<esi.character.mail.Label> implements r.Iterated<LabelAPI> {
    private agent;
    constructor(agent: SSOAgent<number>);
    /**
     * @returns The label details for every defined label defined by the character
     */
    details(): AsyncIterableIterator<[number, esi.character.mail.Label]>;
    /**
     * @returns The unread message count within each label
     */
    unreadCount(): AsyncIterableIterator<[number, number]>;
}
/**
 * A functional interface for creating APIs to access a single label, a
 * specific set of labels, or every label registered to a character. It
 * additionally has members for adding new labels.
 */
export interface Labels {
    /**
     * Create a new labels api targeting every label of the character.
     *
     * @returns An IteratedLabels API wrapper
     */
    (): IteratedLabels;
    /**
     * Create a new label end point targeting the particular label by `id`.
     *
     * @param id The label's id
     * @returns An Label API wrapper for the id
     */
    (id: number): Label;
    /**
     * Create a new labels api targeting the multiple label ids. If an array
     * is provided, duplicates are removed (although the input array is not
     * modified).
     *
     * @param ids The label ids
     * @returns A MappedLabels API wrapper
     */
    (ids: number[] | Set<number>): MappedLabels;
    /**
     * Create a new label based on the specification provided.
     *
     * @esi_route post_characters_character_id_mail_labels
     *
     * @param label The label specification
     *
     * @returns The id of the newly created label
     */
    add(label: esi.character.mail.NewLabel): Promise<number>;
}
/**
 * An api adapter over the end points handling the mail inbox for a character
 * via functions in the [mail](https://esi.tech.ccp.is/latest/#/Mail) ESI
 * endpoints.
 */
export declare class Mail {
    private agent;
    private labels_?;
    constructor(agent: SSOAgent<number>);
    readonly labels: Labels;
    /**
     * Create a new messages api targeting every single mail of
     * the character's inbox. This iterator is not constrained by any labels.
     *
     * @returns An IteratedMessages API wrapper
     */
    messages(): IteratedMessages;
    /**
     * Create a new messages api targeting the multiple mail
     * ids. If an array is provided, duplicates are removed (although the input
     * array is not modified).
     *
     * @param ids The mail ids
     * @returns A MappedMessages API wrapper for the given ids
     */
    messages(ids: number[] | Set<number>): MappedMessages;
    /**
     * Create a new message api targeting the particular mail
     * by `id`.
     *
     * @param id The mail id
     * @returns An Message API wrapper for the given id
     */
    messages(id: number): Message;
    /**
     * @esi_route ~get_characters_character_id_mail_labels
     *
     * @returns The total number of unread messages in a character's inbox
     */
    unreadCount(): Promise<number>;
    /**
     * @esi_route post_characters_character_id_cspa
     *
     * @param toIds Array of entities to potentially send a mail to
     * @returns The cspa cost for sending a message to the given entities
     */
    cspaCost(toIds: number[]): Promise<number>;
    /**
     * @esi_route post_characters_character_id_mail
     *
     * @param mail The mail specification
     * @return The sent mail's id
     */
    send(mail: esi.character.mail.NewMail): Promise<number>;
    /**
     * @returns List of details for a character's mailing list memberships
     */
    lists(): Promise<Responses['get_characters_character_id_mail_lists']>;
}
