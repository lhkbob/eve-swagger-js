jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Races.all', () => {
  agent.__expectRoute('get_universe_races', { });
  return api.races().then(result => {
    expect(result).toBeDefined();
  });
});
