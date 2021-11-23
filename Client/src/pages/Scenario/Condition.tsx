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
  const { setUpdatedScenario, editing } = useContext(ScenarioContext);

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
  if (!condition.type) return null;

  return (
    <div
      className={styles.condition__summary}
      onClick={() => {
        openConditionEdit(condition);
      }}
    >
      {typeToLabel(condition.type)}
      {elementIdToLabel(condition.type, condition.elementId)}
      {valueToLabel(condition.type, condition.value)}
    </div>
  );
};

const typeToLabel = (type: ScenarioConditionType) => {
  return (
    <div>
      {
        {
          REED: 'Kontaktron',
          TEMPERATURE_ABOVE: 'Temperatura >',
          TEMPERATURE_BELOW: 'Temperatura <',
          CRON: 'CRON',
          TIME: 'Czas',
          TIME_BEFORE: 'Czas przed',
          TIME_AFTER: 'Czas po',
          LIGHT: 'Światło',
          BLIND_ABOVE: 'Roleta >',
          BLIND_BELOW: 'Roleta <',
        }[type]
      }
    </div>
  );
};

const elementIdToLabel = (
  type: ScenarioConditionType,
  elementId: number | null | undefined
) => {
  if (elementId === null || elementId === undefined) return null;
  else return <div>#{elementId}</div>;
};

const valueToLabel = (
  type: ScenarioConditionType,
  value: string | number | null
) => {
  if (value === null) return '';

  switch (type) {
    case 'REED': {
      if (value === 'OPEN') return <div>OTWARTY</div>;
      else return <div>ZAMKNIĘTY</div>;
    }

    case 'BLIND_ABOVE':
    case 'BLIND_BELOW': {
      return <div>{value}%</div>;
    }

    default: {
      return <div>{value}</div>;
    }
  }
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
