import React from 'react';
import { useMediaQuery } from '@react-hook/media-query';

import styles from './DefaultLayout.module.sass';
import { TopBar } from 'components/TopBar/TopBar';
import { SideBar } from 'components/SideBar/SideBar';
import { BottomNavigation } from 'components/BottomNavigation/BottomNavigation';

export const DefaultLayout: React.FC = (props) => {
  const isDesktop = useMediaQuery('(min-width: 600px)');

  if (isDesktop) {
    return (
      <div className={styles['layout--desktop']}>
        <SideBar />
        <div className={styles['layout__page-content']}>{props.children}</div>
      </div>
    );
  } else {
    return (
      <div className={styles.layout}>
        <TopBar />
        <div className={styles['layout__page-content']}>{props.children}</div>
        <BottomNavigation />
      </div>
    );
  }
};
