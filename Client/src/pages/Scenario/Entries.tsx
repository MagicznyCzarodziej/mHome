import { useContext } from 'react';
import { ScenarioContext } from './ScenarioContext';

import { Entry } from './Entry';

export const Entries = () => {
  const { scenario, updatedScenario } = useContext(ScenarioContext);

  if (!updatedScenario) return null;
  const { entries } = updatedScenario;

  const rootEntry = entries.find((entry) => entry.parentEntry === null);
  return rootEntry ? <Entry entry={rootEntry} /> : null;
};
