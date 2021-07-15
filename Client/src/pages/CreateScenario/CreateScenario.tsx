import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useImmer } from 'use-immer';

import styles from './CreateScenario.module.sass';
import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import {
  scenariosActions,
  selectCreateScenarioStatus,
} from 'store/reducers/scenariosReducer';

const createCondition = () => {
  return {
    id: Math.random() * 99999,
    type: null,
    elementId: null,
    value: null,
  };
};

const createAction = () => {
  return {
    id: Math.random() * 99999,
    type: null,
    payload: {
      elementId: null,
      value: null,
    },
  };
};

export const CreateScenario = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const status = useSelector(selectCreateScenarioStatus);

  const [name, setName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [entries, setEntries] = useImmer<any>([
    {
      id: 1,
      parentEntry: null,
      conditions: [createCondition()],
      actions: [createAction()],
    },
  ]);

  useEffect(() => {
    if (status === 'SUCCESS') {
      history.push('/scenarios');
    }
    return () => {
      dispatch(scenariosActions.setCreateScenarioStatus('IDLE'));
    };
  }, [dispatch, status, history]);

  const createScenario = () => {
    dispatch(
      scenariosActions.createScenario({
        name: name.trim(),
        active: true,
        description: description.trim(),
        entries: entries,
      })
    );
  };

  const showEntry = (entry: any, level: number = 1) => {
    return (
      <div
        style={{
          // backgroundColor: `hsl(100, 0%, ${level * 10}%)`,
          padding: 10,
          marginTop: 10,
        }}
      >
        {entry.conditions.map((condition: any) => (
          <Condition
            key={condition.id}
            condition={condition}
            handleChangeType={(type: string) => {
              setEntries((draft: any) => {
                const entryToUpdate = draft.find((e: any) => e.id === entry.id);
                const conditionToUpdate = entryToUpdate.conditions.find(
                  (a: any) => a.id === condition.id
                );
                conditionToUpdate.type = type;
              });
            }}
          />
        ))}
        <button
          onClick={() => {
            setEntries((draft: any) => {
              const entryToUpdate = draft.find((e: any) => e.id === entry.id);
              entryToUpdate.conditions.push(createCondition());
            });
          }}
        >
          Dodaj warunek
        </button>
        <br />
        Wykonaj{' '}
        {entry.actions.map((action: any) => (
          <Action
            key={action.id}
            action={action}
            handleChangeType={(type: string) => {
              setEntries((draft: any) => {
                const entryToUpdate = draft.find((e: any) => e.id === entry.id);
                const actionToUpdate = entryToUpdate.actions.find(
                  (a: any) => a.id === action.id
                );
                actionToUpdate.type = type;
              });
            }}
          />
        ))}
        {entry.conditions.length > 0 && (
          <button
            onClick={() => {
              setEntries((draft: any) => {
                const entryToUpdate = draft.find((e: any) => e.id === entry.id);
                entryToUpdate.actions.push(createAction());
              });
            }}
          >
            Dodaj akcję
          </button>
        )}
        <div
          style={{
            // marginLeft: 20,
            marginTop: 10,
            borderLeft: '1px solid grey',
            paddingLeft: 5,
          }}
        >
          {/* Dodatkowo: */}
          {entries
            .filter((e: any) => e.parentEntry === entry.id)
            .map((e: any) => showEntry(e, level + 1))}
        </div>
        {entry.conditions.length > 0 && (
          <button
            onClick={() => {
              const newEntry = {
                id: Math.floor(Math.random() * 99999),
                parentEntry: entry.id,
                conditions: [createCondition()],
                actions: [createAction()],
              };

              setEntries((draft: any) => {
                draft.push(newEntry);
              });
            }}
          >
            Dodaj zagnieżdżoną akcję
          </button>
        )}
      </div>
    );
  };

  const rootEntry = entries.find((entry: any) => entry.parentEntry === null);

  return (
    <>
      <DefaultLayout>
        <div className={styles['create-scenario']}>
          <div className={styles.scenario__name}>
            <span className={styles.name__label}>Nazwa</span>
            <div className={styles.name__control}>
              <input
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                }}
              />
            </div>
          </div>

          <div>{rootEntry !== undefined && showEntry(rootEntry)}</div>
          <button
            onClick={() => {
              createScenario();
            }}
          >
            Zapisz
          </button>
        </div>
      </DefaultLayout>
    </>
  );
};

const Condition = (props: any) => {
  const { condition, handleChangeType } = props;
  return (
    <div>
      Jeśli{' '}
      <select
        value={condition.type}
        onChange={(event) => {
          handleChangeType(event.target.value);
        }}
      >
        <option disabled hidden selected>
          Wybierz warunek
        </option>
        <option value="TEMPERATURE_ABOVE">Temperatura {'>'}</option>
        <option value="TEMPERATURE_BELOW">Temperatura {'<'}</option>
        <option value="REED">Kontaktron</option>
        <option value="TIME">Czas</option>
      </select>{' '}
      {condition.value}
    </div>
  );
};

const Action = (props: any) => {
  const { action, handleChangeType } = props;
  return (
    <div>
      <select
        value={action.type}
        onChange={(event) => {
          const { value } = event.target;
          handleChangeType(value);
        }}
      >
        <option disabled hidden selected>
          Wybierz akcję
        </option>
        <option value="SET_BLINDS">Ustaw roletę</option>
        <option value="SET_LIGHT">Ustaw światło</option>
      </select>
    </div>
  );
};
