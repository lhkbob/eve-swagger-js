import { Corporation, MappedCorporations } from './corporations';
import { ESIAgent } from '../../internal/esi-agent';
import { makeDefaultSearch } from '../../internal/search';
import { esi } from '../../esi';

// TODO add the authenticated corporation
export interface CorporationAPIFactory {
  (id: number): Corporation;

  (ids: number[] | Set<number>): MappedCorporations;

  (query: string, strict?: boolean): MappedCorporations;

  npcs(): MappedCorporations;
}

export function makeCorporationsAPIFactory(agent: ESIAgent): CorporationAPIFactory {
  const corpSearch = makeDefaultSearch(agent, esi.SearchCategory.CORPORATION);

  let factory = <CorporationAPIFactory> function (ids: number | number[] | Set<number> | string,
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