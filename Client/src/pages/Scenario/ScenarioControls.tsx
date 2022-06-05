import { useContext } from 'react';
import cx from 'classnames';

import { ScenarioContext } from './ScenarioContext';
import styles from './Scenario.module.sass';
import Icon from '@mdi/react';
import { mdiDelete, mdiLoading, mdiPencil, mdiCheck } from '@mdi/js';

export const ScenarioControls = () => {
  const {
    scenario,
    setUpdatedScenario,
    editing,
    setEditing,
    status,
    saveScenario,
    deleteScenario,
  } = useContext(ScenarioContext);

  if (!scenario) return null;

  return (
    <div className={styles.scenario__controls}>
      <div
        className={cx(styles.controls__icon, styles.icon__edit)}
        onClick={() => {
          if (!editing) {
            setUpdatedScenario(scenario);
            setEditing(true);
          } else {
            saveScenario();
          }
        }}
      >
        {editing ? (
          status === 'EDITING' ? (
            <Icon
              className={styles.icon__processing}
              path={mdiLoading}
              size="1.5rem"
            />
          ) : (
            <Icon path={mdiCheck} size="1.5rem" />
          )
        ) : (
          <Icon path={mdiPencil} size="1.5rem" />
        )}
      </div>
      <div
        className={cx(styles.controls__icon, styles.icon__delete)}
        onClick={() => {
          if (window.confirm('Na pewno chcesz usunąć ten scenariusz?')) {
            deleteScenario();
          }
        }}
      >
        {status === 'DELETING' ? (
          <Icon
            className={styles.icon__processing}
            path={mdiLoading}
            size="1.5rem"
          />
        ) : (
          <Icon path={mdiDelete} size="1.5rem" />
        )}
      </div>
    </div>
  );
};
