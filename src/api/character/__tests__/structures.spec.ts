jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

function createOrderEntry(typeId, isBuyOrder) {
  return {
    'duration': 90,
    'is_buy_order': isBuyOrder,
    'issued': '2016-09-03T05:12:25Z',
    'location_id': 60005599,
    'min_volume': 1,
    'order_id': 4623824223,
    'price': 9.9,
    'range': 'region',
    'type_id': typeId,
    'volume_remain': 1296000,
    'volume_total': 2000000
  };
}

// Returns 3 buy orders for type 2, 2 sell orders for type 2, plus
// some buy and sell orders for other types
function createOrderResponse() {
  return [
    createOrderEntry(2, true),
    createOrderEntry(2, true),
    createOrderEntry(3, false),
    createOrderEntry(2, true),
    createOrderEntry(2, false),
    createOrderEntry(4, true),
    createOrderEntry(2, false),
  ];
}

afterEach(() => {
  agent.__reset();
});

test('Structure.info', () => {
  agent.__expectRoute('get_universe_structures_structure_id', {
    'structure_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').structures(2).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Structure.vulnerability', () => {
  let schedule = [{ hour: 0, day: 0 }];
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  agent.__expectRoute('put_corporations_corporation_id_structures_structure_id',
      {
        'corporation_id': 109299958, 'structure_id': 2, 'new_schedule': schedule
      }, { token: 'my token' });
  return api.characters(1, 'my token').structures(2).vulnerability(schedule)
  .then(result => {
    expect(result).not.toBeDefined();
  });
});

test('Structure.orders', () => {
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 1
  }, { token: 'my token' });
  return api.characters(1, 'my token').structures(2).orders(1).then(result => {
    expect(result).toBeDefined();
  });
});

test('Structure.orders all', () => {
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 1
  }, {
    token: 'my token', returns: createOrderResponse()
  });
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 2
  }, {
    token: 'my token', returns: []
  });
  return api.characters(1, 'my token').structures(2).orders().then(result => {
    expect(result.length).toEqual(7);
  });
});

test('Structure.ordersFor', () => {
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 1
  }, {
    token: 'my token', returns: createOrderResponse()
  });
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 2
  }, {
    token: 'my token', returns: []
  });
  return api.characters(1, 'my token').structures(2).ordersFor(2)
  .then(result => {
    expect(result.length).toEqual(5);
  });
});

test('Structure.buyOrdersFor', () => {
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 1
  }, {
    token: 'my token', returns: createOrderResponse()
  });
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 2
  }, {
    token: 'my token', returns: []
  });
  return api.characters(1, 'my token').structures(2).buyOrdersFor(2)
  .then(result => {
    expect(result.length).toEqual(3);
  });
});

test('Structure.sellOrdersFor', () => {
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 1
  }, {
    token: 'my token', returns: createOrderResponse()
  });
  agent.__expectRoute('get_markets_structures_structure_id', {
    'structure_id': 2, 'page': 2
  }, {
    token: 'my token', returns: []
  });
  return api.characters(1, 'my token').structures(2).sellOrdersFor(2)
  .then(result => {
    expect(result.length).toEqual(2);
  });
});

test('Structures.search', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1,
    'search': 'search text',
    'categories': ['structure'],
    'strict': false
  }, { token: 'my token' });
  return api.characters(1, 'my token').structures.search('search text')
  .then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

test('Structures.search.strict', () => {
  agent.__expectRoute('get_characters_character_id_search', {
    'character_id': 1,
    'search': 'search text',
    'categories': ['structure'],
    'strict': true
  }, { token: 'my token' });
  return api.characters(1, 'my token').structures.search.strict('search text')
  .then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  });
});

