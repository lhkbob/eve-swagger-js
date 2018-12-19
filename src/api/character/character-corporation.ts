import {
  PaginatedLoader, makePageBasedLoader
} from '../../internal/page-loader';
import { SSOAgent } from '../../internal/esi-agent';
import { Responses, esi } from '../../../gen/esi';
import { Corporation, makeCorporation } from '../corporations';

/**
 * An api adapter that provides functions for accessing various details for a
 * corporation specified by id via functions in the
 * [corporation](https://esi.evetech.net/latest/#/Corporation) ESI endpoints.
 * This sub-interface of {@link Corporation} adds all remaining corporation
 * routes that require authentication. Additionally, the corporation id is
 * automatically inferred from the creating character's member corp.
 */
export interface CharacterCorporation extends Corporation {
  /**
   * @esi_route get_corporations_corporation_id_members
   * @esi_example esi.characters(1, 'token').corporation.members()
   *
   * @returns The array of character ids within the corporation
   */
  members(): Promise<number[]>;

  /**
   * @esi_example esi.characters(1, 'token').corporation.roles()
   *
   * @returns All members and their roles
   */
  roles(): Promise<Responses['get_corporations_corporation_id_roles']>;

  /**
   * @esi_example esi.characters(1, 'token').corporation.structures()
   *
   * @param page If `0`, all structures are returned
   *
   * @returns Structures owned by the corporation
   */
  structures(page?: number): Promise<Responses['get_corporations_corporation_id_structures']>;
}

/**
 * Create a new {@link CharacterCorporation} instance that uses the given
 * `char` to make its HTTP requests to the ESI interface.
 *
 * @param char The character information for making actual requests
 * @returns An CharacterCorporation API instance
 */
export function makeCharacterCorporation(char: SSOAgent): CharacterCorporation {
  return new CharacterCorporationImpl(char);
}

class CharacterCorporationImpl implements CharacterCorporation {
  private corp: Corporation | undefined;
  private allStructs: PaginatedLoader<esi.corporation.Structure>;

  constructor(private char: SSOAgent) {
    this.allStructs = makePageBasedLoader(page => this.structures(page), 250);
  }

  info() {
    return this.base().then(c => c.info());
  }

  history() {
    return this.base().then(c => c.history());
  }

  icon() {
    return this.base().then(c => c.icon());
  }

  loyaltyOffers() {
    return this.base().then(c => c.loyaltyOffers());
  }

  members() {
    return this.id().then(corpId => {
      return this.char.agent.request('get_corporations_corporation_id_members',
          { path: { corporation_id: corpId } }, this.char.ssoToken);
    }).then(result => {
      return result.map(e => e.character_id);
    });
  }

  roles() {
    return this.id().then(corpId => {
      return this.char.agent.request('get_corporations_corporation_id_roles',
          { path: { corporation_id: corpId } }, this.char.ssoToken);
    });
  }

  structures(page?: number) {
    if (page === undefined) {
      return this.allStructs.getAll();
    } else {
      return this.id().then(corpId => {
        return this.char.agent.request(
            'get_corporations_corporation_id_structures',
            { path: { corporation_id: corpId }, query: { page } },
            this.char.ssoToken);
      });
    }
  }

  private base(): Promise<Corporation> {
    if (this.corp !== undefined) {
      return Promise.resolve(this.corp);
    } else {
      return this.char.agent.request('get_characters_character_id',
          { path: { character_id: this.char.id } }).then(result => {
        this.corp = makeCorporation(this.char.agent, result.corporation_id);
        return this.corp;
      });
    }
  }

  id() {
    return this.base().then(c => c.id());
  }
}
