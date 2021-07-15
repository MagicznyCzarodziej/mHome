import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router';
import { useHistory } from 'react-router';
import cx from 'classnames';

import { scenariosActions } from 'store/reducers/scenariosReducer';
import {
  selectScenario,
  selectScenarioStatus,
} from 'store/reducers/scenariosReducer';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import styles from './Scenario.module.sass';
import Icon from '@mdi/react';
import { mdiDelete, mdiLoading, mdiPencil } from '@mdi/js';
import {
  ScenarioEntry,
  ScenarioEntryAction,
  ScenarioEntryCondition,
} from 'types/Scenario';

export const Scenario = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { id: scenarioId } = useParams<{ id: string }>();

  const scenario = useSelector(selectScenario);
  const status = useSelector(selectScenarioStatus);

  // Fetch scenario and reset view on leave
  useEffect(() => {
    dispatch(scenariosActions.fetchScenarioById(Number.parseInt(scenarioId)));
    return () => {
      dispatch(scenariosActions.clearScenario());
    };
  }, [dispatch, scenarioId]);

  useEffect(() => {
    switch (status) {
      case 'DELETING_SUCCESS':
        history.push('/scenarios');
        break;

      case 'DELETING_ERROR':
        alert('Błąd podczas usuwania!');
        break;
    }
  }, [status, history]);

  const renderEntries = (entries: ScenarioEntry[]) => {
    const rootEntry = entries.find((entry) => entry.parentEntry === null);
    return rootEntry ? renderEntry(rootEntry) : null;
  };

  const renderEntry = (entry: ScenarioEntry, nestingLevel: number = 0) => {
    const { conditions, actions } = entry;

    return (
      <div className={styles.scenario__entry} key={entry.id}>
        {/* {nestingLevel > 0 && <div>Dodatkowo</div>} */}
        {conditions.map((condition, index) => (
          <Condition key={condition.id} condition={condition} index={index} />
        ))}
        {actions.map((action, index) => (
          <Action key={action.id} action={action} index={index} />
        ))}
        {scenario?.entries
          .filter((e) => e.parentEntry === entry.id)
          .map((e) => renderEntry(e, nestingLevel + 1))}
      </div>
    );
  };

  const renderScenario = () => {
    if (!scenario) return null;
    else
      return (
        <div className={styles.scenario}>
          <div className={styles.scenario__header}>
            <div
              className={cx([
                styles.scenario__status,
                { [styles['scenario__status--active']]: scenario.active },
              ])}
              onClick={() => {
                if (status === 'EDITING') return;
                dispatch(
                  scenariosActions.editScenario({
                    id: scenario.id,
                    active: !scenario.active,
                  })
                );
              }}
            >
              {scenario.active ? 'Aktywny' : 'Nieaktywny'}
            </div>
            <div className={styles.scenario__labels}>
              <div className={styles.scenario__name}>{scenario.name}</div>
              <div className={styles.scenario__description}>
                {scenario.description}
              </div>
            </div>
            <div className={styles.scenario__controls}>
              <div className={cx(styles.controls__icon, styles.icon__edit)}>
                <Icon path={mdiPencil} size="1.5rem" />
              </div>
              <div
                className={cx(styles.controls__icon, styles.icon__delete)}
                onClick={() => {
                  if (
                    window.confirm('Na pewno chcesz usunąć ten scenariusz?')
                  ) {
                    dispatch(scenariosActions.deleteScenario(scenario.id));
                  }
                }}
              >
                {status === 'DELETING' ? (
                  <Icon
                    className={styles.icon__deleting}
                    path={mdiLoading}
                    size="1.5rem"
                  />
                ) : (
                  <Icon path={mdiDelete} size="1.5rem" />
                )}
              </div>
            </div>
          </div>
          <div className={styles.scenario__entries}>
            {renderEntries(scenario.entries)}
          </div>
        </div>
      );
  };

  return <DefaultLayout>{renderScenario()}</DefaultLayout>;
};

const Condition = (props: {
  condition: ScenarioEntryCondition;
  index: number;
}) => {
  const { condition, index } = props;

  return (
    <div className={styles.condition}>
      <div className={styles.margin}>{index > 0 ? '' : 'Jeżeli '}</div>
      <span className={styles.condition__type}>{condition.type}</span>
      {condition.elementId !== undefined && (
        <span className={styles.condition__type}>{condition.elementId}</span>
      )}
      <span className={styles.condition__type}>{condition.value}</span>
    </div>
  );
};

const Action = (props: { action: ScenarioEntryAction; index: number }) => {
  const { action, index } = props;

  return (
    <div key={action.id} className={styles.action}>
      <div className={styles.margin}>{index > 0 ? '' : 'Wykonaj '}</div>
      <span className={styles.action__type}>{action.type}</span>
      <span className={styles.action__type}>{action.payload?.elementId}</span>
      {action.payload?.value !== undefined && (
        <span className={styles.action__type}>{action.payload?.value}</span>
      )}
    </div>
  );
};
