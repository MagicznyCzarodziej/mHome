import React from 'react';

import styles from './DefaultLayout.module.sass';
import { TopBar } from 'components/TopBar/TopBar';
import { BottomNavigation } from 'components/BottomNavigation/BottomNavigation';

export const DefaultLayout: React.FC = (props) => {
  return (
    <div className={styles.layout}>
      <TopBar />
      <div className={styles['layout__page-content']}>{props.children}</div>
      <BottomNavigation />
    </div>
  );
};