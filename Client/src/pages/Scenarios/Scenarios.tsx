import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { selectAllScenarios } from 'store/reducers/scenariosReducer';

import styles from './Scenarios.module.sass';
import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';

import { scenariosActions } from 'store/reducers/scenariosReducer';

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
          {allScenarios.map((scenario) => (
            <NavLink to={`/scenarios/${scenario.id}`} key={scenario.id}>
              <div>{scenario.name}</div>
            </NavLink>
          ))}
        </div>
        <div>
          <NavLink to="/scenarios/new">Dodaj scenariusz</NavLink>
        </div>
      </div>
    </DefaultLayout>
  );
};
