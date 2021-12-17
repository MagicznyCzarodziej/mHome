import { useContext } from 'react';
import cx from 'classnames';
import { ScenarioContext } from './ScenarioContext';

import styles from './Scenario.module.sass';
import { ScenarioEntryAction, ScenarioActionType } from 'types/Scenario';
import { ScenarioActionSelect } from 'utils/constants';
import { Select } from 'components/Select/Select';

import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import { useSelector } from 'react-redux';
import { selectAllGroups } from 'store/reducers/groupsReducer';

export const Action = (props: {
  action: ScenarioEntryAction;
  index: number;
}) => {
  const { action, index } = props;
  const { setUpdatedScenario, editing } = useContext(ScenarioContext);

  const groups = useSelector(selectAllGroups);

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
          <option key={type} value={type}>
            {label}
          </option>
        ))}
      </Select>

      {action.type &&
        ScenarioActionSelect[action.type].fields.map((field) => {
          return {
            elementId: (
              <div className={styles.field} key={field}>
                <div className={styles.field__label}>ID</div>
                <div
                  key={index}
                  className={styles.field__value}
                  onClick={() => {
                    if (!editing) return;
                    setUpdatedScenario((draft) => {
                      draft?.entries.forEach((entry) => {
                        const act = entry.actions.find(
                          (a) => a.id === action.id
                        );
                        if (act) {
                          const val = prompt(
                            'Wartość',
                            act.payload!.value?.toString() ?? ''
                          ) as string;
                          act.payload!.elementId = Number.parseInt(val);
                        }
                      });
                    });
                  }}
                >
                  {action.payload?.elementId}
                </div>
              </div>
            ),
            groupId: (
              <div className={styles.field} key={field}>
                <div className={styles.field__label}>Grupa</div>
                <div
                  className={cx([
                    styles.field__value,
                    styles['field__value--select'],
                  ])}
                >
                  <Select
                    placeholder="Wybierz grupę"
                    disabled={!editing}
                    value={action.payload?.groupId?.toString() || ''}
                    handleChange={(value: string) => {
                      setUpdatedScenario((draft) => {
                        draft?.entries.forEach((entry) => {
                          const act = entry.actions.find(
                            (a) => a.id === action.id
                          );
                          if (act) act.payload!.groupId = value;
                        });
                      });
                    }}
                  >
                    {groups.map((group) => (
                      <option key={group.id} value={group.id}>
                        {group.name}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>
            ),
            value: (
              <div className={styles.field} key={field}>
                <div className={styles.field__label}>Wartość</div>
                <div
                  key={index}
                  className={styles.field__value}
                  onClick={() => {
                    if (!editing) return;
                    setUpdatedScenario((draft) => {
                      draft?.entries.forEach((entry) => {
                        const act = entry.actions.find(
                          (a) => a.id === action.id
                        );
                        if (act) {
                          const val = prompt(
                            'Wartość',
                            act.payload!.value?.toString() ?? ''
                          ) as string;
                          act.payload!.value = val;
                        }
                      });
                    });
                  }}
                >
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
