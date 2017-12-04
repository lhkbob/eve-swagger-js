jest.mock('../../../internal/esi-agent');

import { API, makeAPI } from '../../../index';
import { ESIAgent } from '../../../internal/esi-agent';

let api: API = makeAPI();
// Cast to any to get the private agent property
let agent: ESIAgent = (api as any).agent;

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
