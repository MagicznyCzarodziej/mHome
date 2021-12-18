import { useContext } from 'react';
import { ScenarioContext } from './ScenarioContext';

import styles from './Scenario.module.sass';
import { ScenarioConditionSelect } from 'utils/constants';
import { ScenarioEntryCondition, ScenarioConditionType } from 'types/Scenario';
import { Select } from 'components/Select/Select';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

export const Condition = (props: {
  condition: ScenarioEntryCondition;
  index: number;
}) => {
  const { condition, index } = props;
  const { setUpdatedScenario, updatedScenario, editing } = useContext(
    ScenarioContext
  );

  return (
    <div className={styles.condition}>
      <ConditionSummary condition={condition} />
      {editing && (
        <div
          className={styles['delete-row']}
          onClick={() => {
            setUpdatedScenario((draft) => {
              draft?.entries.forEach((entry) => {
                entry.conditions = entry.conditions.filter(
                  (a) => a.id !== condition.id
                );
              });
            });
          }}
        >
          <Icon
            path={mdiClose}
            size="1.2rem"
            className={styles['icon__delete']}
          />
        </div>
      )}
    </div>
  );
};

const ConditionSummary = (props: { condition: ScenarioEntryCondition }) => {
  const { condition } = props;
  const { openConditionEdit } = useContext(ScenarioContext);

  return (
    <div
      className={styles.condition__summary}
      onClick={() => {
        // openConditionEdit(condition);
      }}
    >
      <ConditionType condition={condition} />
      <ElementId condition={condition} />
      <ConditionValue condition={condition} />
    </div>
  );
};

const ConditionType = (props: { condition: ScenarioEntryCondition }) => {
  const { condition } = props;
  const { setUpdatedScenario, editing } = useContext(ScenarioContext);

  return (
    <div
      onClick={() => {
        if (!editing) return;
        setUpdatedScenario((draft) => {
          draft?.entries.forEach((entry) => {
            const cond = entry.conditions.find((c) => c.id === condition.id);
            if (cond) {
              const val = prompt(
                'Wartość',
                cond.type?.toString() ?? ''
              ) as string;
              cond.type = val as ScenarioConditionType;
            }
          });
        });
      }}
    >
      {condition.type
        ? {
            REED: 'Kontaktron',
            TEMPERATURE_ABOVE: 'Temperatura >',
            TEMPERATURE_BELOW: 'Temperatura <',
            CRON: 'CRON',
            TIME: 'Czas',
            TIME_BEFORE: 'Czas przed',
            TIME_AFTER: 'Czas po',
            LIGHT_STATE: 'Światło',
            BLIND_ABOVE: 'Roleta >',
            BLIND_BELOW: 'Roleta <',
          }[condition.type]
        : '[TYP]'}
    </div>
  );
};

const ElementId = (props: { condition: ScenarioEntryCondition }) => {
  const { condition } = props;
  const { setUpdatedScenario, editing } = useContext(ScenarioContext);

  if (condition.type?.includes('CRON') || condition.type?.includes('TIME'))
    return null;

  return (
    <div
      onClick={() => {
        if (!editing) return;
        setUpdatedScenario((draft) => {
          draft?.entries.forEach((entry) => {
            const cond = entry.conditions.find((c) => c.id === condition.id);
            if (cond) {
              const val = prompt(
                'Wartość',
                cond.elementId?.toString() ?? ''
              ) as string;
              cond.elementId = Number.parseInt(val);
            }
          });
        });
      }}
    >
      #{condition.elementId ?? '[ELEMENT]'}
    </div>
  );
};

const ConditionValue = (props: { condition: ScenarioEntryCondition }) => {
  const { condition } = props;
  const { setUpdatedScenario, editing } = useContext(ScenarioContext);
  let displayValue;

  switch (condition.type) {
    case 'REED': {
      if (condition.value === 'OPEN') displayValue = 'OTWARTY';
      else displayValue = 'ZAMKNIĘTY';
      break;
    }

    case 'BLIND_ABOVE':
    case 'BLIND_BELOW': {
      displayValue = condition.value + '%';
      break;
    }

    case 'LIGHT_STATE': {
      if (condition.value === 'ON') displayValue = 'WŁĄCZONE';
      else displayValue = 'WYŁĄCZONE';
      break;
    }

    default: {
      displayValue = condition.value;
      break;
    }
  }
  if (condition.value === null) displayValue = '[WARTOŚĆ]';

  return (
    <div
      onClick={() => {
        if (!editing) return;
        setUpdatedScenario((draft) => {
          draft?.entries.forEach((entry) => {
            const cond = entry.conditions.find((c) => c.id === condition.id);
            if (cond) {
              const val =
                (prompt('Wartość', cond.value?.toString() ?? '') as string) ||
                null;
              cond.value = val;
            }
          });
        });
      }}
    >
      {displayValue}
    </div>
  );
};

const conditionOptions = [
  { value: 'REED', label: 'Kontaktron' },
  { value: 'TEMPERATURE', label: 'Temperatura' },
  { value: 'CRON', label: 'CRON' },
  { value: 'TIME', label: 'Czas' },
  { value: 'LIGHT', label: 'Światło' },
  { value: 'BLIND', label: 'Roleta' },
];

export const ConditionEdit = (props: any) => {
  const { condition } = props;
  const { updatedScenario, setUpdatedScenario, saveScenario } = useContext(
    ScenarioContext
  );
  return (
    <div>
      {condition.type} <button onClick={() => {}}>save</button>
    </div>
  );
};
