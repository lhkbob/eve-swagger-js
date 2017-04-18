jest.mock('../../internal/esi-agent');

const API = require('../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Incursions.all', () => {
  agent.__expectRoute('get_incursions', {});
  return api.incursions().then(result => {
    expect(result).toBeDefined();
  });
});
