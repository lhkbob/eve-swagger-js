jest.mock('../../internal/ESIAgent');

const Api = require('../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Sovereignty.campaigns', () => {
  agent.__expectRoute('get_sovereignty_campaigns', {});
  return api.sovereignty.campaigns().then(result => {
    expect(result).toBeDefined();
  });
});

test('Sovereignty.structures', () => {
  agent.__expectRoute('get_sovereignty_structures', {});
  return api.sovereignty.structures().then(result => {
    expect(result).toBeDefined();
  });
});
