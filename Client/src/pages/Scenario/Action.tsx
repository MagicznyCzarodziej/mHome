import { useContext } from 'react';
import { ScenarioContext } from './ScenarioContext';

import styles from './Scenario.module.sass';
import { ScenarioEntryAction, ScenarioActionType } from 'types/Scenario';
import { ScenarioActionSelect } from 'utils/constants';
import { Select } from 'components/Select/Select';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';

export const Action = (props: {
  action: ScenarioEntryAction;
  index: number;
}) => {
  const { action, index } = props;
  const { setUpdatedScenario, editing } = useContext(ScenarioContext);

  return (
    <div key={action.id} className={styles.action}>
      <Select
        disabled={!editing}
        placeholder="Wybierz akcję"
        value={action.type || ''}
        handleChange={(value: ScenarioActionType) => {
          setUpdatedScenario((draft) => {
            draft?.entries.forEach((entry) => {
              const act = entry.actions.find((a) => a.id === action.id);
              if (act) act.type = value;
            });
          });
        }}
      >
        <option disabled hidden selected>
          Wybierz akcję
        </option>
        {Object.entries(ScenarioActionSelect).map(([type, { label }]) => (
          <option value={type}>{label}</option>
        ))}
      </Select>

      {action.type &&
        ScenarioActionSelect[action.type].fields.map((field) => {
          return {
            elementId: (
              <div className={styles.field}>
                <div className={styles.field__label}>ID</div>
                <div key={index} className={styles.field__value}>
                  {action.payload?.elementId}
                </div>
              </div>
            ),
            groupId: (
              <div className={styles.field}>
                <div className={styles.field__label}>Grupa</div>
                <div key={index} className={styles.field__value}>
                  {action.payload?.groupId}
                </div>
              </div>
            ),
            value: (
              <div className={styles.field}>
                <div className={styles.field__label}>Wartość</div>
                <div key={index} className={styles.field__value}>
                  {action.payload?.value}
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
                entry.actions = entry.actions.filter((a) => a.id !== action.id);
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
