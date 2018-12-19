import { ESIAgent } from '../../../internal/esi-agent';
import { Responses, esi } from '../../../../gen/esi';

/**
 * An api adapter that provides functions for modifying the character's in-game
 * windows via functions in the [user
 * interface](https://esi.evetech.net/latest/#/User_Interface) ESI endpoints.
 */
export interface Window {
  /**
   * @esi_example esi.characters(1, 'token').window.info(2)
   *
   * @param id The target item or entity id to show in the window
   * @return An empty promise that resolves when the window is opened
   */
  info(id: number): Promise<Responses['post_ui_openwindow_information']>;

  /**
   * @esi_example esi.characters(1, 'token').window.market(2)
   *
   * @param id The market item's type id to display
   * @return An empty promise that resolves when the window is opened
   */
  market(id: number): Promise<Responses['post_ui_openwindow_marketdetails']>;

  /**
   * @esi_example esi.characters(1, 'token').window.contract(2)
   *
   * @param id The id of the contract
   * @return An empty promise that resolves when the window is opened
   */
  contract(id: number): Promise<Responses['post_ui_openwindow_contract']>;

  /**
   * @esi_example esi.characters(1, 'token').window.newMail({...})
   *
   * @param settings Content specification for the new window
   * @return An empty promise that resolves when the window is opened
   */
  newMail(settings: esi.character.mail.NewMailWindow): Promise<Responses['post_ui_openwindow_newmail']>;
}

/**
 * Create a new {@link Window} instance that uses the given `agent` to make
 * its HTTP requests to the ESI interface. The character whose UI is updated is
 * automatically determined from the token.
 *
 * @param agent The agent making actual requests
 * @param token The SSO token to authenticate requests
 * @returns An Window API instance
 */
export function makeWindow(agent: ESIAgent, token: string): Window {
  return new WindowImpl(agent, token);
}

class WindowImpl implements Window {
  constructor(private agent: ESIAgent, private token: string) {
  }

  info(id: number) {
    return this.agent.request('post_ui_openwindow_information',
        { query: { target_id: id } }, this.token);
  }

  market(id: number) {
    return this.agent.request('post_ui_openwindow_marketdetails',
        { query: { type_id: id } }, this.token);
  }

  contract(id: number) {
    return this.agent.request('post_ui_openwindow_contract',
        { query: { contract_id: id } }, this.token);
  }

  newMail(settings: esi.character.mail.NewMailWindow) {
    return this.agent.request('post_ui_openwindow_newmail', { body: settings },
        this.token);
  }
}
