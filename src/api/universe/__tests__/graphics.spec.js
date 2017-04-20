jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Graphic.info', () => {
  agent.__expectRoute('get_universe_graphics_graphic_id', { 'graphic_id': 1 });
  return api.graphics(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Graphics.all', () => {
  agent.__expectRoute('get_universe_graphics', {});
  return api.graphics().then(result => {
    expect(result).toBeDefined();
  });
});
