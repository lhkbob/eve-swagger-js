jest.mock('../../internal/ESIAgent');

const Api = require('../../Api');

let api = new Api();
let agent = api._esiAgent;

test('Alliance.info', () => {
  agent.__expectRoute('get_alliances_alliance_id', { 'alliance_id': 1 });
  return api.alliances(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliance.corporations', () => {
  agent.__expectRoute('get_alliances_alliance_id_corporations',
      { 'alliance_id': 1 });
  return api.alliances(1).corporations().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliance.icon', () => {
  agent.__expectRoute('get_alliances_alliance_id_icons', { 'alliance_id': 1 });
  return api.alliances(1).icon().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliances.all', () => {
  agent.__expectRoute('get_alliances', {});
  return api.alliances().then(result => {
    expect(result).toBeDefined();
  });
});

test('Alliances.names empty', () => {
  agent.__expectRoute('get_alliances', {});
  agent.__expectRoute('get_alliances_names', { 'alliance_ids': [99000001] });
  return api.alliances.names().then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('Alliances.names small', () => {
  agent.__expectRoute('get_alliances_names', { 'alliance_ids': [2] });
  return api.alliances.names([2]).then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('Alliances.names large', () => {
  let ids = [...new Array(30).keys()];
  agent.__expectRoute('post_universe_names', { 'ids': ids }, {
    returns: [
      {
        'id': 1,
        'name': 'Test',
        'category': 'alliance'
      }
    ]
  });
  return api.alliances.names(ids).then(result => {
    // Expect the results to be renamed
    expect(result.length).toBeGreaterThan(0);
    for (let n of result) {
      expect(Object.keys(n)).toEqual(['id', 'name']);
    }
  });
});

test('Alliances.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['alliance'],
    'strict': false
  });
  return api.alliances.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});

test('Alliances.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['alliance'],
    'strict': true
  });
  return api.alliances.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});
