jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../api';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

function createKillIDs(count) {
  let mails = [];
  for (let i = 0; i < count; i++) {
    mails.push({
      'killmail_id': i,
      'killmail_hash': 'hash' + i
    });
  }
  return mails;
}

function expectMailsSinglePage(charId, maxKillId, token, mails) {
  agent.__expectRoute('get_characters_character_id_killmails_recent', {
    'character_id': charId,
    'max_kill_id': maxKillId,
    'max_count': 50
  }, {
    returns: mails,
    token: token
  });
}

function expectKillsSinglePage(charId, maxKillId, token, mails) {
  expectMailsSinglePage(charId, maxKillId, token, mails);
  for (let i = 0; i < mails.length; i++) {
    agent.__expectRoute('get_killmails_killmail_id_killmail_hash', {
      'killmail_id': mails[i].killmail_id,
      'killmail_hash': mails[i].killmail_hash
    }, { overrides: { 'killmail_id': mails[i].killmail_id } });
  }
}

function expectKills(charId, token, mails) {
  let maxKillId = undefined;
  for (let offset = 0; offset < mails.length; offset += 50) {
    let end = offset + 50;
    if (mails.length < end) {
      end = mails.length;
    }

    let pageMails = mails.slice(offset, end);
    expectKillsSinglePage(charId, maxKillId, token, pageMails);
    maxKillId = pageMails[pageMails.length - 1].killmail_id;
  }
}

function expectMails(charId, token, mails) {
  let maxKillId = undefined;
  for (let offset = 0; offset < mails.length; offset += 50) {
    let end = offset + 50;
    if (mails.length < end) {
      end = mails.length;
    }

    let pageMails = mails.slice(offset, end);
    expectMailsSinglePage(charId, maxKillId, token, pageMails);
    maxKillId = pageMails[pageMails.length - 1].killmail_id;
  }
}

afterEach(() => {
  agent.__reset();
});

test('CharacterInfo.info', () => {
  agent.__expectRoute('get_characters_character_id', { 'character_id': 1 });
  return api.characters(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterInfo.portrait', () => {
  agent.__expectRoute('get_characters_character_id_portrait',
      { 'character_id': 1 });
  return api.characters(1).portrait().then(result => {
    expect(result).toBeDefined();
  });
});

test('CharacterInfo.history', () => {
  agent.__expectRoute('get_characters_character_id_corporationhistory',
      { 'character_id': 1 });
  return api.characters(1).history().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.assets', () => {
  agent.__expectRoute('get_characters_character_id_assets',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').assets().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.clones', () => {
  agent.__expectRoute('get_characters_character_id_clones',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').clones().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.recentKills maxKillId', () => {
  expectKillsSinglePage(1, 2, 'my_token', createKillIDs(2));
  return api.characters(1, 'my_token').recentKills(2).then(result => {
    expect(result.length).toEqual(2);
  });
});

test('Character.recentKills', () => {
  expectKillsSinglePage(1, undefined, 'my_token', createKillIDs(2));
  return api.characters(1, 'my_token').recentKills().then(result => {
    expect(result.length).toEqual(2);
  });
});

test('Character.kills', () => {
  expectKills(1, 'my_token', createKillIDs(153));
  return api.characters(1, 'my_token').kills().then(result => {
    expect(result.length).toEqual(153);
  });
});

test('Character.recentKillmailss maxKillId', () => {
  expectMailsSinglePage(1, 2, 'my_token', createKillIDs(2));
  return api.characters(1, 'my_token').recentKillmails(2).then(result => {
    expect(result.length).toEqual(2);
  });
});

test('Character.recentKillmails', () => {
  expectMailsSinglePage(1, undefined, 'my_token', createKillIDs(2));
  return api.characters(1, 'my_token').recentKillmails().then(result => {
    expect(result.length).toEqual(2);
  });
});

test('Character.killmails', () => {
  expectMails(1, 'my_token', createKillIDs(153));
  return api.characters(1, 'my_token').killmails().then(result => {
    expect(result.length).toEqual(153);
  });
});

test('Character.loyaltyPoints', () => {
  agent.__expectRoute('get_characters_character_id_loyalty_points',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').loyaltyPoints().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.ship', () => {
  agent.__expectRoute('get_characters_character_id_ship', { 'character_id': 1 },
      { token: 'my_token' });
  return api.characters(1, 'my_token').ship().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.location', () => {
  agent.__expectRoute('get_characters_character_id_location',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').location().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.online', () => {
  agent.__expectRoute('get_characters_character_id_online',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').online().then(result => {
    expect(result).toBeTruthy();
  });
});

test('Character.wallets', () => {
  agent.__expectRoute('get_characters_character_id_wallets',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').wallets().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.skills', () => {
  agent.__expectRoute('get_characters_character_id_skills',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').skills().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.skillqueue', () => {
  agent.__expectRoute('get_characters_character_id_skillqueue',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').skillqueue().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.agentResearch', () => {
  agent.__expectRoute('get_characters_character_id_agents_research',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').agentResearch().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.chatChannels', () => {
  agent.__expectRoute('get_characters_character_id_chat_channels',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').chatChannels().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.medals', () => {
  agent.__expectRoute('get_characters_character_id_medals',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').medals().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.opportunities', () => {
  agent.__expectRoute('get_characters_character_id_opportunities',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').opportunities().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.standings', () => {
  agent.__expectRoute('get_characters_character_id_standings',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').standings().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.blueprints', () => {
  agent.__expectRoute('get_characters_character_id_blueprints',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').blueprints().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.roles', () => {
  agent.__expectRoute('get_characters_character_id_roles',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').roles().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.industryJobs', () => {
  agent.__expectRoute('get_characters_character_id_industry_jobs',
      { 'character_id': 1, 'include_completed': false }, { token: 'my_token' });
  return api.characters(1, 'my_token').industryJobs().then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.industryJobs completed', () => {
  agent.__expectRoute('get_characters_character_id_industry_jobs',
      { 'character_id': 1, 'include_completed': true }, { token: 'my_token' });
  return api.characters(1, 'my_token').industryJobs(true).then(result => {
    expect(result).toBeDefined();
  });
});

test('Character.orders', () => {
  agent.__expectRoute('get_characters_character_id_orders',
      { 'character_id': 1 }, { token: 'my_token' });
  return api.characters(1, 'my_token').orders().then(result => {
    expect(result).toBeDefined();
  });
});

test('Characters.affiliation', () => {
  agent.__expectRoute('post_characters_affiliation', { 'characters': [2] });
  return api.characters.affiliations([2]).then(result => {
    expect(result).toBeDefined();
  });
});

test('Characters.names small', () => {
  agent.__expectRoute('get_characters_names', { 'character_ids': [2] });
  return api.characters.names([2]).then(result => {
    // Expect the results to be a Map with keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Characters.names large', () => {
  let ids = [...new Array(30).keys()];
  agent.__expectRoute('post_universe_names', { 'ids': ids }, {
    returns: [
      {
        'id': 1,
        'name': 'Test',
        'category': 'character'
      }
    ]
  });
  return api.characters.names(ids).then(result => {
    // Expect the results to be a Map with keys
    expect(result).toBeInstanceOf(Map);
    expect(result.size).toBeGreaterThan(0);
  });
});

test('Characters.search', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['character'],
    'strict': false
  });
  return api.characters.search('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});

test('Characters.search.strict', () => {
  agent.__expectRoute('get_search', {
    'search': 'search text',
    'categories': ['character'],
    'strict': true
  });
  return api.characters.search.strict('search text').then(result => {
    // Expect the results to be an array
    expect(Array.isArray(result)).toBeTruthy();
  })
});
