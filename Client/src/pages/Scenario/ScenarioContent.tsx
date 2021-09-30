import { useContext } from 'react';

import styles from './Scenario.module.sass';

import { ScenarioContext } from './ScenarioContext';
import { ScenarioControls } from './ScenarioControls';
import { Entries } from './Entries';

export const ScenarioContent = () => {
  const { scenario } = useContext(ScenarioContext);

  if (!scenario) return null;

  return (
    <div className={styles.scenario}>
      <div className={styles.scenario__header}>
        <div className={styles.scenario__labels}>
          <div className={styles.scenario__name}>{scenario.name}</div>
          <div className={styles.scenario__description}>
            {scenario.description}
          </div>
        </div>
        <ScenarioControls />
      </div>
      <div className={styles.scenario__entries}>
        <Entries />
      </div>
    </div>
  );
};
