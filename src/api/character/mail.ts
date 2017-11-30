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
export class Message extends r.impl.SimpleResource implements r.Async<MessageAPI> {
  constructor(private agent: SSOAgent<number>, id: number) {
    super(id);
  }

  /**
   * @returns The full message content
   */
  details() {
    return getMessage(this.agent, this.id_);
  }

  /**
   * @esi_route ~get_characters_character_id_mail_mail_id
   *
   * @returns The summary header for the message
   */
  summary() {
    return this.details().then(msg => getSummaryFromMessage(this.id_, msg));
  }

  /**
   * @esi_route delete_characters_character_id_mail_mail_id
   *
   * @returns An empty promise that resolves after the message has been deleted
   */
  del(): Promise<undefined> {
    return deleteMessage(this.agent, this.id_);
  }

  /**
   * @esi_route put_characters_character_id_mail_mail_id
   *
   * @param labels The label ids attached to the message
   * @param read Whether or not the message is marked as read, defaults to true
   * @return An empty promise that resolves after the message has been updated
   */
  update(labels: number[], read: boolean = true): Promise<undefined> {
    return updateMessage(this.agent, this.id_, labels, read);
  }
}

/**
 * An api adapter for accessing various details of a set of messages,
 * specified by provided mail ids when the api is instantiated.
 */
export class MappedMessages extends r.impl.SimpleMappedResource implements r.Mapped<MessageAPI> {
  private headers_?: r.impl.ResourceStreamer<esi.character.mail.MailHeader>;

  constructor(private agent: SSOAgent<number>, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns The full message content, mapped by id
   */
  details() {
    return this.getResource(id => getMessage(this.agent, id));
  }

  /**
   * @esi_route ~get_characters_character_id_mail_mail_id
   * @esi_route ~get_characters_character_id_mail
   *
   * @returns The summary header for the message, mapped by id
   */
  summary() {
    return this.arrayIDs().then(ids => {
      if (ids.length > 20) {
        // Instead of making 20+ detail requests, just filter through the
        // actual header responses
        if (this.headers_ === undefined) {
          this.headers_ = getHeaders(this.agent, []);
        }
        return r.impl.filterIteratedToMap(this.headers_(), ids,
            e => e.mail_id || 0);
      } else {
        // Make individual details requests and rebuild
        return this.getResource(id => getMessage(this.agent, id)
        .then(msg => getSummaryFromMessage(id, msg)));
      }
    });
  }

  /**
   * @esi_route delete_characters_character_id_mail_mail_id
   *
   * @returns An empty promise that resolves after messages have been deleted
   */
  del(): Promise<undefined> {
    // Discard the map afterwards
    return this.getResource(id => deleteMessage(this.agent, id))
    .then(map => undefined);
  }

  /**
   * @esi_route put_characters_character_id_mail_mail_id
   *
   * @param labels The label ids attached to the messages
   * @param read Whether or not the messages are marked as read, defaults to
   *     true
   * @return An empty promise that resolves after the messages have been
   *     updated
   */
  update(labels: number[], read: boolean = true): Promise<undefined> {
    // Discard the map afterwards
    return this.getResource(id => updateMessage(this.agent, id, labels, read))
    .then(map => undefined);
  }
}

/**
 * An api adapter for accessing various details about every mail in the
 * character's inbox, possibly constrained by a set of labels specified at
 * construction.
 */
export class IteratedMessages extends r.impl.SimpleIteratedResource<esi.character.mail.MailHeader> implements r.Iterated<MessageAPI> {
  constructor(private agent: SSOAgent<number>,
      labels: number[] | Set<number> | r.impl.IDSetProvider) {
    super(getHeaders(agent, labels), e => e.mail_id || 0);
  }

  /**
   * @returns The message details for every mail in the character's inbox,
   *    possibly constrained by a label set
   */
  details() {
    return this.getResource(id => getMessage(this.agent, id));
  }

  /**
   * @returns The message summaries for every mail in the character's inbox,
   *    possibly constrained by a label set
   */
  summary() {
    return this.getPaginatedResource();
  }
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
export class Label extends r.impl.SimpleResource implements r.Async<LabelAPI> {
  private messages_?: IteratedMessages;

  constructor(private agent: SSOAgent<number>, id: number) {
    super(id);
  }

  /**
   * @returns An IteratedMessages API restricted to this specific label
   */
  get messages(): IteratedMessages {
    if (this.messages_ === undefined) {
      this.messages_ = new IteratedMessages(this.agent, [this.id_]);
    }
    return this.messages_;
  }

  /**
   * @esi_route ~get_characters_character_id_mail_labels
   *
   * @returns The full label details
   */
  details() {
    return getLabels(this.agent)
    .then(all => r.impl.filterArray(all.labels || [], this.id_,
        e => e.label_id || 0));
  }

  /**
   * @esi_route ~get_characters_character_id_mail_labels
   *
   * @returns The number of unread messages with this label
   */
  unreadCount() {
    return this.details().then(details => details.unread_count || 0);
  }

  /**
   * @esi_route delete_characters_character_id_mail_labels_label_id
   *
   * @returns An empty promise that resolves after the label has been deleted
   */
  del(): Promise<undefined> {
    return deleteLabel(this.agent, this.id_);
  }
}

/**
 * An api adapter for accessing various details of a set of labels,
 * specified by provided label ids when the api is instantiated.
 */
export class MappedLabels extends r.impl.SimpleMappedResource implements r.Mapped<LabelAPI> {
  private messages_?: IteratedMessages;

  constructor(private agent: SSOAgent<number>, ids: number[] | Set<number>) {
    super(ids);
  }

  /**
   * @returns An IteratedMessages API restricted to the label set
   */
  get messages(): IteratedMessages {
    if (this.messages_ === undefined) {
      this.messages_ = new IteratedMessages(this.agent, () => this.arrayIDs());
    }
    return this.messages_;
  }

  /**
   * @esi_route ~get_characters_character_id_mail_labels
   *
   * @returns The full label details, mapped by label id
   */
  details() {
    return this.arrayIDs()
    .then(ids => getLabels(this.agent)
    .then(all => r.impl.filterArrayToMap(all.labels || [], ids,
        e => e.label_id || 0)));
  }

  /**
   * @esi_route ~get_characters_character_id_mail_labels
   *
   * @returns The number of unread messages for each label, mapped by id
   */
  unreadCount() {
    return this.details().then(map => {
      let remap = new Map();
      for (let [k, v] of map.entries()) {
        remap.set(k, v.unread_count || 0);
      }
      return remap;
    });
  }

  /**
   * @esi_route delete_characters_character_id_mail_labels_label_id
   *
   * @returns An empty promise that resolves after all specified labels have
   *     been deleted
   */
  del(): Promise<undefined> {
    // Discard the map
    return this.getResource(id => deleteLabel(this.agent, id))
    .then(map => undefined);
  }
}

/**
 * An api adapter for accessing various details about every label in the
 * character's inbox.
 */
export class IteratedLabels extends r.impl.SimpleIteratedResource<esi.character.mail.Label> implements r.Iterated<LabelAPI> {
  constructor(private agent: SSOAgent<number>) {
    super(r.impl.makeArrayStreamer(
        () => getLabels(agent).then(all => all.labels || [])),
        e => e.label_id || 0);
  }

  /**
   * @returns The label details for every defined label defined by the character
   */
  details() {
    return this.getPaginatedResource();
  }

  /**
   * @returns The unread message count within each label
   */
  async * unreadCount(): AsyncIterableIterator<[number, number]> {
    for await (let [id, label] of this.details()) {
      yield <[number, number]> [id, label.unread_count];
    }
  }
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
   * Create a new label end point targeting the particular fitting by `id`.
   *
   * @param id The label's id
   * @returns An Label API wrapper for the id
   */
  (id: number): Label;

  /**
   * Create a new labels api targeting the multiple fittings ids. If an array
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
export class Mail {
  private labels_?: Labels;

  constructor(private agent: SSOAgent<number>) {
  }

  get labels(): Labels {
    if (this.labels_ === undefined) {
      this.labels_ = makeLabels(this.agent);
    }
    return this.labels_;
  }

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

  messages(ids?: number | number[] | Set<number>) {
    if (ids === undefined) {
      return new IteratedMessages(this.agent, []);
    } else if (typeof ids === 'number') {
      return new Message(this.agent, ids);
    } else {
      return new MappedMessages(this.agent, ids);
    }
  }

  /**
   * @esi_route ~get_characters_character_id_mail_labels
   *
   * @returns The total number of unread messages in a character's inbox
   */
  unreadCount(): Promise<number> {
    return this.agent.agent.request('get_characters_character_id_mail_labels',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken)
    .then(result => result.total_unread_count || 0);
  }

  /**
   * @esi_route post_characters_character_id_cspa
   *
   * @param toIds Array of entities to potentially send a mail to
   * @returns The cspa cost for sending a message to the given entities
   */
  cspaCost(toIds: number[]): Promise<number> {
    return this.agent.agent.request('post_characters_character_id_cspa',
        { path: { character_id: this.agent.id }, body: { characters: toIds } },
        this.agent.ssoToken).then(result => result.cost || 0);
  }

  /**
   * @esi_route post_characters_character_id_mail
   *
   * @param mail The mail specification
   * @return The sent mail's id
   */
  send(mail: esi.character.mail.NewMail): Promise<number> {
    return this.agent.agent.request('post_characters_character_id_mail',
        { path: { character_id: this.agent.id }, body: mail },
        this.agent.ssoToken);
  }

  /**
   * @returns List of details for a character's mailing list memberships
   */
  lists(): Promise<Responses['get_characters_character_id_mail_lists']> {
    return this.agent.agent.request('get_characters_character_id_mail_lists',
        { path: { character_id: this.agent.id } }, this.agent.ssoToken);
  }
}

function makeLabels(agent: SSOAgent<number>): Labels {
  let labels = <Labels> function (ids: number | number[] | Set<number> | undefined) {
    if (ids === undefined) {
      // All labels
      return new IteratedLabels(agent);
    } else if (typeof ids === 'number') {
      // Single label
      return new Label(agent, ids);
    } else {
      // Multiple labels
      return new MappedLabels(agent, ids);
    }
  };

  labels.add = function (settings: esi.character.mail.NewLabel) {
    return agent.agent.request('post_characters_character_id_mail_labels',
        { path: { character_id: agent.id }, body: settings }, agent.ssoToken);
  };
  return labels;
}

function getLabels(agent: SSOAgent<number>) {
  return agent.agent.request('get_characters_character_id_mail_labels',
      { path: { character_id: agent.id } }, agent.ssoToken);
}

function deleteLabel(agent: SSOAgent<number>, id: number) {
  return agent.agent.request(
      'delete_characters_character_id_mail_labels_label_id',
      { path: { character_id: agent.id, label_id: id } }, agent.ssoToken);
}

function getSummaryFromMessage(id: number, message: esi.character.mail.Mail) {
  return {
    from: message.from,
    is_read: message.read,
    labels: message.labels,
    mail_id: id,
    recipients: message.recipients,
    subject: message.subject,
    timestamp: message.timestamp
  };
}

async function getHeaders(agent: SSOAgent<number>,
    labels: number[] | Set<number> | r.impl.IDSetProvider): r.impl.ResourceStreamer<esi.character.mail.MailHeader> {
  let labelIDS: number[];
  if (Array.isArray(labels)) {
    labelIDS = labels;
  } else if (labels instanceof Set) {
    labelIDS = Array.from(labels);
  } else {
    labelIDS = await labels();
  }
  return r.impl.makeMaxIDStreamer(
      fromID => getHeaderPage(agent, labelIDS, fromID), e => e.mail_id || 0,
      50);
}

function getHeaderPage(agent: SSOAgent<number>, labels: number[],
    fromID?: number) {
  return agent.agent.request('get_characters_character_id_mail', {
    path: { character_id: agent.id },
    query: { labels: labels, last_mail_id: fromID }
  }, agent.ssoToken);
}

function getMessage(agent: SSOAgent<number>, id: number) {
  return agent.agent.request('get_characters_character_id_mail_mail_id',
      { path: { character_id: agent.id, mail_id: id } }, agent.ssoToken);
}

function deleteMessage(agent: SSOAgent<number>, id: number) {
  return agent.agent.request('delete_characters_character_id_mail_mail_id',
      { path: { character_id: agent.id, mail_id: id } }, agent.ssoToken);
}

function updateMessage(agent: SSOAgent<number>, id: number, labels: number[],
    read: boolean) {
  return agent.agent.request('put_characters_character_id_mail_mail_id',
      { path: { character_id: agent.id, mail_id: id }, body: { labels, read } },
      agent.ssoToken);
}
