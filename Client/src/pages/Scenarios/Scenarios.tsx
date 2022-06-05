import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { nanoid } from 'nanoid';
import { Link, useHistory } from 'react-router-dom';
import cx from 'classnames';

import {
  scenariosActions,
  selectCreateScenarioStatus,
  selectScenario,
} from 'store/reducers/scenariosReducer';
import { selectAllScenarios } from 'store/reducers/scenariosReducer';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import { ScenarioItem } from './ScenarioItem';
import styles from './Scenarios.module.sass';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export const Scenarios = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const status = useSelector(selectCreateScenarioStatus);

  const createdScenario = useSelector(selectScenario);
  const allScenarios = useSelector(selectAllScenarios);

  useEffect(() => {
    dispatch(scenariosActions.clearScenario());
    dispatch(scenariosActions.fetchAllScenarios());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'SUCCESS') {
      dispatch(scenariosActions.clearScenario());
      history.push(`/scenarios/${createdScenario!.id}`);
    }
  }, [status, history, createdScenario, dispatch]);

  const createScenario = () => {
    dispatch(
      scenariosActions.createScenario({
        name: 'Nowy scenariusz',
        active: false,
        description: 'Opis scenariusza',
        entries: [
          {
            id: nanoid(),
            parentEntry: null,
            conditions: [],
            actions: [],
          },
        ],
      })
    );
  };

  return (
    <DefaultLayout>
      <div className={styles.scenarios}>
        <div>
          <div className={styles.scenarios__inactive}>Aktywne</div>
          {allScenarios
            .filter((s) => s.active)
            .map((scenario) => (
              <ScenarioItem key={scenario.id} scenario={scenario} />
            ))}
          <div className={styles.scenarios__inactive}>Nieaktywne</div>
          {allScenarios
            .filter((s) => !s.active)
            .map((scenario) => (
              <ScenarioItem key={scenario.id} scenario={scenario} />
            ))}
        </div>

        <div
          className={styles['create-scenario']}
          onClick={() => {
            createScenario();
          }}
        >
          <Icon size="1.7rem" path={mdiPlus} />
        </div>
      </div>
    </DefaultLayout>
  );
};
