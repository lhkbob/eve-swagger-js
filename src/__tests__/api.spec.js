jest.mock('../internal/esi-agent');

const API = require('../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('API.names', () => {
  agent.__expectRoute('post_universe_names', {'ids': [2]});
  return api.names([2]).then(result => {
    expect(result.length).toBeGreaterThan(0);
    for (let e of result) {
      expect(Object.keys(e)).toEqual(['category', 'id', 'name']);
    }
  });
});

test('API.names long', () => {
  let ids = [...new Array(1030).keys()];

  agent.__expectRoute('post_universe_names', {'ids': ids.slice(0, 500)});
  agent.__expectRoute('post_universe_names', {'ids': ids.slice(500, 1000)});
  agent.__expectRoute('post_universe_names', {'ids': ids.slice(1000, 1030)});

  return api.names(ids).then(result => {
    // Each post_universe_names only returns a single item with the mock agent
    expect(result.length).toEqual(3);
    for (let e of result) {
      expect(Object.keys(e)).toEqual(['category', 'id', 'name']);
    }
  });
});

test('API ctor', () => {
  let newAPI = api();
  expect(newAPI).toBeInstanceOf(API);
  expect(newAPI != api).toBeTruthy();
});
