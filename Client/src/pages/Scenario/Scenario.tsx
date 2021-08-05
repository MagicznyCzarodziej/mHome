import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
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
import { mdiDelete, mdiLoading, mdiPencil, mdiCheck } from '@mdi/js';
import {
  Scenario as IScenario,
  ScenarioEntry,
  ScenarioEntryAction,
  ScenarioEntryCondition,
  ScenarioConditionType,
} from 'types/Scenario';
import { ScenarioConditionSelect } from 'utils/constants';
import { ScenarioActionSelect } from './../../utils/constants';
import { Select } from 'components/Select/Select';

export const Scenario = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { id: scenarioId } = useParams<{ id: string }>();

  const scenario = useSelector(selectScenario);
  const status = useSelector(selectScenarioStatus);

  const [editing, setEditing] = useState(false);
  const [updatedScenario, setUpdatedScenario] = useImmer<IScenario | null>(
    null
  );

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

      case 'EDITING_SUCCESS':
        setEditing(false);
        break;

      case 'EDITING_ERROR':
        alert('Błąd podczas zapisu!');
        break;
    }
  }, [status, history]);

  const saveScenario = () => {
    if (updatedScenario !== null)
      dispatch(scenariosActions.editScenario(updatedScenario));
  };

  const mapCondition = (condition: ScenarioEntryCondition) => {
    const mapTypeToValue = (type: ScenarioConditionType | null) => {
      if (type === null) return '';
      if (type.includes('TEMPERATURE')) return 'TEMPERATURE';
      else if (type.includes('TIME')) return 'TIME';
      else if (type.includes('BLIND')) return 'BLIND';
      else return type;
    };

    return (
      <>
        <Select
          value={mapTypeToValue(condition.type)}
          handleChange={(value: ScenarioConditionType) => {
            setUpdatedScenario((draft) => {
              draft?.entries.forEach((entry) => {
                const cond = entry.conditions.find(
                  (c) => c.id === condition.id
                );
                if (cond) cond.type = value;
              });
            });
          }}
          placeholder="Wybierz warunek"
        >
          {conditionOptions.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>

        {}
      </>
    );
  };

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
          <Condition
            key={condition.id}
            condition={condition}
            index={index}
            mapCondition={mapCondition}
          />
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
            <div className={styles.scenario__labels}>
              <div className={styles.scenario__name}>{scenario.name}</div>
              <div className={styles.scenario__description}>
                {scenario.description}
              </div>
            </div>
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
                  <Icon path={mdiCheck} size="1.5rem" />
                ) : (
                  <Icon path={mdiPencil} size="1.5rem" />
                )}
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

const conditionOptions = [
  { value: 'REED', label: 'Kontaktron' },
  { value: 'TEMPERATURE', label: 'Temperatura' },
  { value: 'CRON', label: 'CRON' },
  { value: 'TIME', label: 'Czas' },
  { value: 'LIGHT', label: 'Światło' },
  { value: 'BLIND', label: 'Roleta' },
];

const Condition = (props: {
  condition: ScenarioEntryCondition;
  index: number;
  mapCondition: Function;
}) => {
  const { condition, index, mapCondition } = props;

  return (
    <div className={styles.condition}>
      <div className={styles.margin}>{index > 0 ? '' : 'Jeżeli '}</div>

      {mapCondition(condition)}

      {condition.type &&
        ScenarioConditionSelect[condition.type]?.fields.map((field, index) => {
          return {
            elementId: (
              <span key={index} className={styles.condition__type}>
                {condition.elementId}
              </span>
            ),
            groupId: (
              <span key={index} className={styles.condition__type}>
                {condition.groupId}
              </span>
            ),
            value: (
              <span key={index} className={styles.condition__type}>
                {condition.value}
              </span>
            ),
          }[field];
        })}
    </div>
  );
};

const Action = (props: { action: ScenarioEntryAction; index: number }) => {
  const { action, index } = props;

  return (
    <div key={action.id} className={styles.action}>
      <div className={styles.margin}>{index > 0 ? '' : 'Wykonaj '}</div>
      <Select
        placeholder="Wybierz akcję"
        value={action.type || ''}
        handleChange={(value: string) => {
          // handleChangeType(value);
        }}
      >
        {Object.entries(ScenarioActionSelect).map(([type, { label }]) => (
          <option value={type}>{label}</option>
        ))}
      </Select>
      {/* <select
        className={styles.action__type}
        value={action.type || ''}
        onChange={(event) => {
          const { value } = event.target;
          // handleChangeType(value);
        }}
      >
        <option disabled hidden selected>
          Wybierz akcję
        </option>

      </select> */}
      {action.type &&
        ScenarioActionSelect[action.type].fields.map((field) => {
          return {
            elementId: (
              <span className={styles.action__type}>
                {action.payload?.elementId}
              </span>
            ),
            groupId: (
              <span className={styles.action__type}>
                {action.payload?.groupId}
              </span>
            ),
            value: (
              <span className={styles.action__type}>
                {action.payload?.value}
              </span>
            ),
          }[field];
        })}
    </div>
  );
};
