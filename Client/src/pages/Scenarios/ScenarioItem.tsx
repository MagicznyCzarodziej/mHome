import cx from 'classnames';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { scenariosActions } from 'store/reducers/scenariosReducer';

import styles from './Scenarios.module.sass';
import { Scenario } from 'types/Scenario';
import { Icon } from '@mdi/react';
import { mdiPause, mdiPlayCircleOutline } from '@mdi/js';

interface Props {
  scenario: Scenario;
}

export const ScenarioItem = (props: Props) => {
  const { scenario } = props;

  const dispatch = useDispatch();

  return (
    <div
      className={cx([
        styles.scenario,
        { [styles[`scenario--active`]]: scenario.active },
      ])}
    >
      <div
        className={styles.scenario__status}
        onClick={() => {
          dispatch(
            scenariosActions.editScenario({
              id: scenario.id,
              active: !scenario.active,
            })
          );
        }}
      >
        <Icon
          path={scenario.active ? mdiPause : mdiPlayCircleOutline}
          size={1.2}
        />
      </div>
      <Link
        className={styles.scenario__labels}
        to={`/scenarios/${scenario.id}`}
      >
        <div className={styles.scenario__name}>{scenario.name}</div>
        <div className={styles.scenario__description}>
          {scenario.description}
        </div>
      </Link>
    </div>
  );
};
