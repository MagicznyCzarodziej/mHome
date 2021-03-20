import React from 'react';
import { NavLink } from 'react-router-dom';

import { useBreadCrumbs } from 'hooks/useBreadcrumbs';

import styles from './TopBar.module.sass';
import Icon from '@mdi/react';
import { mdiCog, mdiShieldOutline } from '@mdi/js';

interface Props {}

export const TopBar: React.FC<Props> = (props) => {
  const breadcrumbs = useBreadCrumbs();

  return (
    <div className={styles.topbar}>
      <div className={styles.header}>
        <span className={styles['app-name']}>mHome</span>
        <span className={styles.breadcrumbs}> {breadcrumbs}</span>
      </div>
      <div className={styles.buttons}>
        <NavLink to="/security" activeClassName={styles['link--active']}>
          <Icon path={mdiShieldOutline} size="1.5rem" />
        </NavLink>
        <NavLink to="/settings" activeClassName={styles['link--active']}>
          <Icon path={mdiCog} size="1.5rem" />
        </NavLink>
      </div>
    </div>
  );
};
