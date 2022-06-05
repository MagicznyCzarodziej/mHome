import React from 'react';
import { NavLink } from 'react-router-dom';

import styles from './SideBar.module.sass';
import Icon from '@mdi/react';
import {
  mdiCog,
  mdiShieldOutline,
  mdiClipboardText,
  mdiViewGridOutline,
  mdiThermometerLow,
} from '@mdi/js';

export const SideBar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <span className={styles['app-name']}>mHome</span>
      </div>
      <div className={styles.navigation}>
        <NavLink exact to="/" activeClassName={styles['link--active']}>
          <Icon path={mdiViewGridOutline} size="1.5rem" /> Dashboard
        </NavLink>
        <NavLink to="/thermometers" activeClassName={styles['link--active']}>
          <Icon path={mdiThermometerLow} size="1.5rem" /> Temperatury
        </NavLink>
        <NavLink to="/scenarios" activeClassName={styles['link--active']}>
          <Icon path={mdiClipboardText} size="1.5rem" /> Scenariusze
        </NavLink>
        <NavLink to="/security" activeClassName={styles['link--active']}>
          <Icon path={mdiShieldOutline} size="1.5rem" /> Zdarzenia
        </NavLink>
        <NavLink to="/settings" activeClassName={styles['link--active']}>
          <Icon path={mdiCog} size="1.5rem" /> Ustawienia
        </NavLink>
      </div>
    </div>
  );
};
