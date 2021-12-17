import { useContext, useState } from 'react';

import styles from './Scenario.module.sass';

import { ScenarioContext } from './ScenarioContext';
import { ScenarioControls } from './ScenarioControls';
import { Entries } from './Entries';

export const ScenarioContent = () => {
  const { scenario, updatedScenario, setUpdatedScenario, editing } = useContext(
    ScenarioContext
  );

  if (!scenario) return null;

  return (
    <div className={styles.scenario}>
      <div className={styles.scenario__header}>
        <div className={styles.scenario__labels}>
          <div className={styles.scenario__name}>
            {editing ? (
              <div className={styles.name__control}>
                <input
                  value={updatedScenario?.name}
                  onChange={(event) => {
                    setUpdatedScenario((draft) => {
                      draft!.name = event.target.value;
                    });
                  }}
                />
              </div>
            ) : (
              scenario.name
            )}
          </div>
          <div className={styles.scenario__description}>
            {editing ? (
              <div className={styles.name__control}>
                <input
                  value={scenario.description}
                  onChange={(event) => {
                    setUpdatedScenario((draft) => {
                      draft!.description = event.target.value;
                    });
                  }}
                />
              </div>
            ) : (
              scenario.description
            )}
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
