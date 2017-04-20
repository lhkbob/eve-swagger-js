jest.mock('../../../internal/esi-agent');

const API = require('../../../api');

let api = new API();
let agent = api._esiAgent;

afterEach(() => {
  agent.__reset();
});

test('OpportunityGroup.info', () => {
  agent.__expectRoute('get_opportunities_groups_group_id', {'group_id': 1});
  return api.opportunities.groups(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('OpportunityGroups.all', () => {
  agent.__expectRoute('get_opportunities_groups', {});
  return api.opportunities.groups().then(result => {
    expect(result).toBeDefined();
  });
});

test('OpportunityTask.info', () => {
  agent.__expectRoute('get_opportunities_tasks_task_id', {'task_id': 1});
  return api.opportunities.tasks(1).info().then(result => {
    expect(result).toBeDefined();
  });
});

test('OpportunityTasks.all', () => {
  agent.__expectRoute('get_opportunities_tasks', {});
  return api.opportunities.tasks().then(result => {
    expect(result).toBeDefined();
  });
});
