export interface Scenario {
  id: number;
  name: string;
  description: string;
  active: boolean;
  entries: ScenarioEntry[];
}

export type CreateScenario = Omit<Scenario, 'id'>;
export type EditScenario = { id: number } & Partial<Scenario>;

export interface ScenarioEntry {
  id: string;
  parentEntry: string | null;
  conditions: ScenarioEntryCondition[];
  actions: ScenarioEntryAction[];
}

export type ScenarioConditionType =
  | 'REED'
  | 'TEMPERATURE_ABOVE'
  | 'TEMPERATURE_BELOW'
  | 'CRON'
  | 'TIME'
  | 'TIME_BEFORE'
  | 'TIME_AFTER'
  | 'LIGHT'
  | 'BLIND_ABOVE'
  | 'BLIND_BELOW';

export interface ScenarioEntryCondition {
  id: string;
  type: ScenarioConditionType | null;
  elementId?: number | null;
  groupId?: string | null;
  value: number | string | null;
}

export type ScenarioActionType =
  | 'SET_LIGHT'
  | 'SET_GROUP_LIGHTS'
  | 'SET_ALL_LIGHTS'
  | 'SET_BLIND'
  | 'SET_GROUP_BLINDS'
  | 'SET_ALL_BLINDS';

export interface ScenarioEntryAction {
  id: string;
  type: ScenarioActionType | null;
  payload: {
    elementId?: number;
    groupId?: string | null;
    value?: number | string;
  } | null;
}

export type CreateScenarioStatus = 'IDLE' | 'IN_PROGRESS' | 'SUCCESS' | 'ERROR';
export type ScenarioStatus =
  | 'IDLE'
  | 'DELETING'
  | 'DELETING_SUCCESS'
  | 'DELETING_ERROR'
  | 'EDITING'
  | 'EDITING_SUCCESS'
  | 'EDITING_ERROR';
