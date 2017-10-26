jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Group.info', () => {
  agent.__expectRoute('get_universe_groups_group_id', { 'group_id': 1 });
  return api.types.groups(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Groups.all', () => {
  agent.__expectRoute('get_universe_groups', { 'page': 1 },
      { returns: [1, 2] });
  agent.__expectRoute('get_universe_groups', { 'page': 2 },
      { returns: [3, 4] });
  agent.__expectRoute('get_universe_groups', { 'page': 3 }, { returns: [] });

  return api.types.groups().then(result => {
    expect(result).toEqual([1, 2, 3, 4]);
  });
});

test('MarketGroup.info', () => {
  agent.__expectRoute('get_markets_groups_market_group_id',
      { 'market_group_id': 1 });
  return api.types.marketGroups(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('MarketGroups.all', () => {
  agent.__expectRoute('get_markets_groups', {});

  return api.types.marketGroups().then(result => {
    expect(result).toBeDefined();
  });
});

test('Category.info', () => {
  agent.__expectRoute('get_universe_categories_category_id',
      { 'category_id': 1 });
  return api.types.categories(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Categories.all', () => {
  agent.__expectRoute('get_universe_categories', {});

  return api.types.categories().then(result => {
    expect(result).toBeDefined();
  });
});

test('Type.info', () => {
  agent.__expectRoute('get_universe_types_type_id', { 'type_id': 1 });
  return api.types(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Types.prices', () => {
  agent.__expectRoute('get_markets_prices', {});
  return api.types.prices().then(result => {
    expect(result).toBeDefined();
  });
});

test('Types.all', () => {
  agent.__expectRoute('get_universe_types', { 'page': 1 },
      { returns: [1, 2, 3] });
  agent.__expectRoute('get_universe_types', { 'page': 2 },
      { returns: [4, 5, 6] });
  agent.__expectRoute('get_universe_types', { 'page': 3 }, { returns: [] });
  return api.types().then(result => {
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });
});


test('Types.names empty', () => {
  agent.__expectRoute('get_universe_types', { 'page': 1 });
  agent.__expectRoute('get_universe_types', { 'page': 2 }, { returns: [] });
  agent.__expectRoute('post_universe_names', { 'ids': [1, 2, 3] }, {
    returns: [
      {
        'id': 1,
        'name': 'Test',
        'category': 'inventory_type'
      }
    ]
  });
  return api.types.names().then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Types.names', () => {
  agent.__expectRoute('post_universe_names', { 'ids': [2] }, {
    returns: [
      {
        'id': 2,
        'name': 'Test',
        'category': 'inventory_type'
      }
    ]
  });
  return api.types.names([2]).then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Types.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['inventorytype'],
    'strict': false
  });
  return api.types.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Types.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['inventorytype'],
    'strict': true
  });
  return api.types.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});
