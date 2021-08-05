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
  id: number;
  parentEntry: number | null;
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
  id: number;
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
  id: number;
  type: ScenarioActionType | null;
  payload: {
    elementId?: number;
    groupId?: string | null;
    value?: number | string;
  } | null;
}
