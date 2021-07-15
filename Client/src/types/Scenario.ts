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

export interface ScenarioEntryCondition {
  id: number;
  type: string;
  elementId?: number;
  value: number | string;
}

export interface ScenarioEntryAction {
  id: number;
  type: string;
  payload: {
    elementId?: number;
    value?: number | string;
  };
}
