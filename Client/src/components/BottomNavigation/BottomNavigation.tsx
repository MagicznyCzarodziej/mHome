import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './BottomNavigation.module.sass';
import Icon from '@mdi/react';
import {
  mdiClipboardText,
  mdiViewGridOutline,
  mdiThermometerLow,
} from '@mdi/js';

interface Props {}

export const BottomNavigation: React.FC<Props> = (props) => {
  return (
    <div className={styles.menu}>
      <NavLink
        to="/scenarios"
        activeClassName={styles['menu__item--active']}
        className={styles.menu__item}
      >
        <Icon size="1.7rem" path={mdiClipboardText} />
      </NavLink>
      <NavLink
        exact
        to="/"
        activeClassName={styles['menu__item--active']}
        className={styles.menu__item}
      >
        <Icon size="1.7rem" path={mdiViewGridOutline} />
      </NavLink>
      <NavLink
        to="/thermometers"
        activeClassName={styles['menu__item--active']}
        className={styles.menu__item}
      >
        <Icon size="1.7rem" path={mdiThermometerLow} />
      </NavLink>
    </div>
  );
};
