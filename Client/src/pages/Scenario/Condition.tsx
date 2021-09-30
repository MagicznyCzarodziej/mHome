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
          disabled={!editing}
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

  return (
    <div className={styles.condition}>
      {mapCondition(condition)}

      {condition.type &&
        ScenarioConditionSelect[condition.type]?.fields.map((field, index) => {
          return {
            elementId: (
              <div className={styles.field}>
                <div className={styles.field__label}>ID</div>
                <div key={index} className={styles.field__value}>
                  {condition.elementId}
                </div>
              </div>
            ),
            groupId: null, // Action-only field
            value: (
              <div className={styles.field}>
                <div className={styles.field__label}>Stan</div>
                <div key={index} className={styles.field__value}>
                  {condition.value}
                </div>
              </div>
            ),
          }[field];
        })}

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

const conditionOptions = [
  { value: 'REED', label: 'Kontaktron' },
  { value: 'TEMPERATURE', label: 'Temperatura' },
  { value: 'CRON', label: 'CRON' },
  { value: 'TIME', label: 'Czas' },
  { value: 'LIGHT', label: 'Światło' },
  { value: 'BLIND', label: 'Roleta' },
];
