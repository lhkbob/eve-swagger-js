jest.mock('../../internal/ESIAgent');

const Api = require('../../Api');

let api = new Api();
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
