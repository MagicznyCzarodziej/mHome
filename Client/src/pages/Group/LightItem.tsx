import { useDispatch } from 'react-redux';
import cx from 'classnames';

import { Light } from 'types/Light';
import { lightsActions } from 'store/reducers/lightsReducer';

import styles from './Group.module.sass';

import { Icon } from '@mdi/react';
import { mdiLightbulbOutline, mdiLightbulb } from '@mdi/js';

interface Props {
  light: Light;
}

export const LightItem = (props: Props) => {
  const { light } = props;

  const dispatch = useDispatch();

  const handleSwitchLight = () => {
    const newState = light.state === 'ON' ? 'OFF' : 'ON';
    dispatch(
      lightsActions.lightStateRequest({ id: light.id, state: newState })
    );
    navigator.vibrate(50);
  };

  return (
    <div key={light.id} className={styles.element}>
      <div className={styles.element__name}>{light.name}</div>
      <div className={styles.element__control} onClick={handleSwitchLight}>
        <Icon
          className={cx({
            [styles['light--on']]: light.state === 'ON',
            [styles['light--off']]: light.state === 'OFF',
          })}
          path={light.state === 'ON' ? mdiLightbulb : mdiLightbulbOutline}
          size={1.5}
        />
      </div>
    </div>
  );
};
