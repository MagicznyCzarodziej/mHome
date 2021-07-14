export interface Scenario {
  id: number;
  name: string;
  description: string;
  active: boolean;
  entries: ScenarioEntry[];
}

export interface ScenarioEntry {
  id: number;
  parentEntry: number | null;
  conditions: ScenarioEntryCondition[];
  actions: ScenarioEntryAction[];
}

export interface ScenarioEntryCondition {
  id: number;
  type: ScenarioConditionType;
  elementId?: number;
  value: number | string;
}

export interface ScenarioEntryAction {
  id: number;
  type: ScenarioActionType;
}

export enum ScenarioConditionType {
  LIGHT_STATE = 'LIGHT_STATE',
  REED = 'REED',
  TEMPERATURE_BELOW = 'TEMPERATURE_BELOW',
  TEMPERATURE_ABOVE = 'TEMPERATURE_ABOVE',
  TIME_BEFORE = 'TIME_BEFORE',
  TIME_AFTER = 'TIME_AFTER',
  TIME = 'TIME',
}

export enum ScenarioActionType {
  SET_LIGHT = 'SET_LIGHT',
}
