import { Corporation, MappedCorporations } from './corporations';
import { ESIAgent } from '../../internal/esi-agent';
import { makeDefaultSearch } from '../../internal/search';
import { esi } from '../../esi';

// TODO add the authenticated corporation
export interface Corporations {
  (id: number): Corporation;

  (ids: number[] | Set<number>): MappedCorporations;

  /**
   * @esi_route ids get_search [corporation]
   *
   * @param {string} query
   * @param {boolean} strict
   * @returns {MappedCorporations}
   */
  (query: string, strict?: boolean): MappedCorporations;

  /**
   * @esi_route ids get_corporations_npccorps
   * @returns {MappedCorporations}
   */
  npcs(): MappedCorporations;
}

export function makeCorporations(agent: ESIAgent): Corporations {
  const corpSearch = makeDefaultSearch(agent, esi.SearchCategory.CORPORATION);

  let factory = <Corporations> function (ids: number | number[] | Set<number> | string,
      strict: boolean = false) {
    if (typeof ids === 'number') {
      // Single id variant
      return new Corporation(agent, ids);
    } else if (typeof ids === 'string') {
      // Search variant
      return new MappedCorporations(agent, () => corpSearch(ids, strict));
    } else {
      // ids is a set or array so just a plain mapped corp
      return new MappedCorporations(agent, ids);
    }
  };

  // Add npcs() function
  factory.npcs = function () {
    return new MappedCorporations(agent,
        () => agent.request('get_corporations_npccorps', undefined));
  };

  return factory;
}