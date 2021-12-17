import { createContext } from 'react';
import { Scenario, ScenarioStatus } from 'types/Scenario';
import { Updater } from 'use-immer';

interface IScenarioContext {
  scenario: Scenario | null;
  updatedScenario: Scenario | null;
  setUpdatedScenario: Updater<Scenario | null>;
  editing: boolean;
  setEditing: (state: boolean) => void;
  status: ScenarioStatus;
  saveScenario: () => void;
  deleteScenario: () => void;
  openConditionEdit: Function;
}

export const ScenarioContext = createContext<IScenarioContext>({
  scenario: null,
  updatedScenario: null,
  setUpdatedScenario: () => void 0,
  editing: false,
  setEditing: () => void 0,
  status: 'IDLE',
  saveScenario: () => void 0,
  deleteScenario: () => void 0,
  openConditionEdit: () => void 0,
});

export const ScenarioProvider = ScenarioContext.Provider;
