jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Industry.facilities', () => {
  agent.__expectRoute('get_industry_facilities', { });
  return api.industry.facilities().then(result => {
    expect(result).toBeDefined();
  });
});

test('Industry.systems', () => {
  agent.__expectRoute('get_industry_systems', { });
  return api.industry.systemCosts().then(result => {
    expect(result).toBeDefined();
  });
});
