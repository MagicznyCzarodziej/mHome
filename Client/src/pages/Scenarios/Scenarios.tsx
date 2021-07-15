import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { scenariosActions } from 'store/reducers/scenariosReducer';
import { selectAllScenarios } from 'store/reducers/scenariosReducer';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import { ScenarioItem } from './ScenarioItem';
import styles from './Scenarios.module.sass';
import Icon from '@mdi/react';
import { mdiPlus } from '@mdi/js';

export const Scenarios = () => {
  const dispatch = useDispatch();

  const allScenarios = useSelector(selectAllScenarios);

  useEffect(() => {
    dispatch(scenariosActions.fetchAllScenarios());
  }, [dispatch]);

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

        <Link to="/scenarios/new">
          <div className={styles['create-scenario']}>
            <Icon size="1.7rem" path={mdiPlus} />
          </div>
        </Link>
      </div>
    </DefaultLayout>
  );
};
