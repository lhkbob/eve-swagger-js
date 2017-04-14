jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
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
