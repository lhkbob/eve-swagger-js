jest.mock('../../../internal/ESIAgent');

const Api = require('../../../Api');

let api = new Api();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('Squad.rename', () => {
  agent.__expectRoute('put_fleets_fleet_id_squads_squad_id', {
    'fleet_id': 2,
    'squad_id': 3,
    'naming': { 'name': 'test name' }
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings(4).squads(3)
  .rename('test name').then(result => {
    expect(result).toBeDefined();
  });
});

test('Squad.del', () => {
  agent.__expectRoute('delete_fleets_fleet_id_squads_squad_id', {
    'fleet_id': 2,
    'squad_id': 3
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings(4).squads(3).del()
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('Squads.add', () => {
  agent.__expectRoute('post_fleets_fleet_id_wings_wing_id_squads', {
    'fleet_id': 2,
    'wing_id': 3
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings(3).squads.add()
  .then(result => {
    expect(result instanceof Number || (typeof result) == 'number')
    .toBeTruthy();
    expect(Math.floor(result)).toEqual(result);  });
});

test('Wing.rename', () => {
  agent.__expectRoute('put_fleets_fleet_id_wings_wing_id', {
    'fleet_id': 2,
    'wing_id': 3,
    'naming': { 'name': 'test name' }
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings(3).rename('test name')
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('Wing.del', () => {
  agent.__expectRoute('delete_fleets_fleet_id_wings_wing_id', {
    'fleet_id': 2,
    'wing_id': 3
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings(3).del()
  .then(result => {
    expect(result).toBeDefined();
  });
});

test('Wings.all', () => {
  agent.__expectRoute('get_fleets_fleet_id_wings', {
    'fleet_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings().then(result => {
    expect(result).toBeDefined();
  });
});

test('Wings.add', () => {
  agent.__expectRoute('post_fleets_fleet_id_wings', {
    'fleet_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).wings.add().then(result => {
    expect(result instanceof Number || (typeof result) == 'number')
    .toBeTruthy();
    expect(Math.floor(result)).toEqual(result);  });
});

test('Fleet.info', () => {
  agent.__expectRoute('get_fleets_fleet_id', {
    'fleet_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('Fleet.members', () => {
  agent.__expectRoute('get_fleets_fleet_id_members', {
    'fleet_id': 2
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).members().then(result => {
    expect(result).toBeDefined();
  });
});

test('Fleet.invite', () => {
  let invite = {
    'character_id': 5,
    'role': 'squad_member',
    'squad_id': 6,
    'wing_id': 7
  };

  agent.__expectRoute('post_fleets_fleet_id_members', {
    'fleet_id': 2,
    'invitation': invite
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).invite(invite).then(result => {
    expect(result).toBeDefined();
  });
});

test('Fleet.kick', () => {
  agent.__expectRoute('delete_fleets_fleet_id_members_member_id', {
    'fleet_id': 2,
    'member_id': 3
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).kick(3).then(result => {
    expect(result).toBeDefined();
  });
});

test('Fleet.move', () => {
  let move = {
    'role': 'squad_member',
    'squad_id': 6,
    'wing_id': 7
  };
  agent.__expectRoute('put_fleets_fleet_id_members_member_id', {
    'fleet_id': 2,
    'member_id': 3,
    'movement': move
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).move(3, move).then(result => {
    expect(result).toBeDefined();
  });
});

test('Fleet.update', () => {
  agent.__expectRoute('put_fleets_fleet_id', {
    'fleet_id': 2,
    'new_settings': {
      'is_free_move': true,
      'motd': 'The message of the day!'
    }
  }, { token: 'my token' });
  return api.characters(1, 'my token').fleet(2).update({
    motd: 'The message of the day!',
    isFreeMove: true
  })
  .then(result => {
    expect(result).toBeDefined();
  });
});
