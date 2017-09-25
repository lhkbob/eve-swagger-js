jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

afterEach(() => {
  agent.__reset();
});

test('Region.info', () => {
  agent.__expectRoute('get_universe_regions_region_id', {'region_id': 1});
  return api.regions(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Region.history', () => {
  agent.__expectRoute('get_markets_region_id_history', {'region_id': 1, 'type_id': 2});
  return api.regions(1).history(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('Region.orders', () => {
  agent.__expectRoute('get_markets_region_id_orders', { 'region_id': 1, 'type_id': undefined, 'order_type': 'all', 'page': 1});
  return api.regions(1).orders(1).then(result => {
    expect(result).toBeDefined();
  });
});

test('Region.orders all', () => {
  agent.__expectRoute('get_markets_region_id_orders', { 'region_id': 1, 'type_id': undefined, 'order_type': 'all', 'page': 1});
  agent.__expectRoute('get_markets_region_id_orders', { 'region_id': 1, 'type_id': undefined, 'order_type': 'all', 'page': 2}, {returns: []});
  return api.regions(1).orders().then(result => {
    expect(result).toBeDefined();
  });
});

test('Region.buyOrdersFor', () => {
  agent.__expectRoute('get_markets_region_id_orders', { 'region_id': 1, 'type_id': 2, 'order_type': 'buy', 'page': undefined});
  return api.regions(1).buyOrdersFor(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('Region.sellOrdersFor', () => {
  agent.__expectRoute('get_markets_region_id_orders', { 'region_id': 1, 'type_id': 2, 'order_type': 'sell', 'page': undefined});
  return api.regions(1).sellOrdersFor(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('Region.ordersFor', () => {
  agent.__expectRoute('get_markets_region_id_orders', { 'region_id': 1, 'type_id': 2, 'order_type': 'all', 'page': undefined});
  return api.regions(1).ordersFor(2).then(result => {
    expect(result).toBeDefined();
  });
});

test('Regions.all', () => {
  agent.__expectRoute('get_universe_regions', {});
  return api.regions().then(result => {
    expect(result).toBeDefined();
  });
});

test('Regions.names empty', () => {
  agent.__expectRoute('get_universe_regions', {});
  agent.__expectRoute('post_universe_names', { 'ids': [11000001, 11000002] }, {
    returns: [
      {
        'id': 1,
        'name': 'Test',
        'category': 'region'
      }
    ]
  });
  return api.regions.names().then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Regions.names', () => {
  let ids = [...new Array(30).keys()];
  agent.__expectRoute('post_universe_names', { 'ids': ids }, {
    returns: [
      {
        'id': 1,
        'name': 'Test',
        'category': 'region'
      }
    ]
  });
  return api.regions.names(ids).then(result => {
    // Expect the results to be a Map with the keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Regions.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['region'],
    'strict': false
  });
  return api.regions.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});

test('Regions.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['region'],
    'strict': true
  });
  return api.regions.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});