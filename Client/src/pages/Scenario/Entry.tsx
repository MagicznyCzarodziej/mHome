import { useContext } from 'react';
import { nanoid } from 'nanoid';
import { ScenarioContext } from './ScenarioContext';

import styles from './Scenario.module.sass';
import { ScenarioEntry } from 'types/Scenario';

import { Condition } from './Condition';
import { Action } from './Action';

interface Props {
  entry: ScenarioEntry;
  nestingLevel?: number;
}

export const Entry = (props: Props) => {
  const { entry, nestingLevel = 0 } = props;
  const { updatedScenario, setUpdatedScenario, editing } = useContext(
    ScenarioContext
  );
  const { conditions, actions } = entry;

  return (
    <div className={styles.scenario__entry} key={entry.id}>
      {/* {nestingLevel > 0 && <div>Dodatkowo</div>} */}
      <div className={styles.margin}>Jeżeli</div>

      {conditions.map((condition, index) => (
        <Condition key={condition.id} condition={condition} index={index} />
      ))}

      {editing && (
        <button
          className={styles['add-row']}
          onClick={() => {
            setUpdatedScenario((draft) => {
              draft?.entries
                .find((e) => e.id === entry.id)
                ?.conditions.push({
                  id: nanoid(),
                  type: null,
                  value: null,
                });
            });
          }}
        >
          Dodaj warunek
        </button>
      )}

      <div className={styles.margin}>Wykonaj</div>

      {actions.map((action, index) => (
        <Action key={action.id} action={action} index={index} />
      ))}
      {editing && (
        <button
          className={styles['add-row']}
          onClick={() => {
            setUpdatedScenario((draft) => {
              draft?.entries
                .find((e) => e.id === entry.id)
                ?.actions.push({
                  id: nanoid(),
                  type: null,
                  payload: null,
                });
            });
          }}
        >
          Dodaj akcję
        </button>
      )}
      {updatedScenario?.entries
        .filter((e) => e.parentEntry === entry.id)
        .map((e) => (
          <Entry entry={e} nestingLevel={nestingLevel + 1} />
        ))}

      {editing && (
        <button
          className={styles['add-row']}
          onClick={() => {
            setUpdatedScenario((draft) => {
              draft?.entries.push({
                id: nanoid(),
                actions: [],
                conditions: [],
                parentEntry: entry.id,
              });
            });
          }}
        >
          Dodaj zagnieżdżenie
        </button>
      )}
    </div>
  );
};
