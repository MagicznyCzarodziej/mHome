import React from 'react';

import styles from './GroupLayout.module.sass';
import { GroupTopBar } from 'components/GroupTopBar/GroupTopBar';
import { BottomNavigation } from 'components/BottomNavigation/BottomNavigation';
import { SideBar } from 'components/SideBar/SideBar';
import { useMediaQuery } from '@react-hook/media-query';

export const GroupLayout: React.FC = (props) => {
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
        <GroupTopBar />
        <div className={styles['layout__page-content']}>{props.children}</div>
        <BottomNavigation />
      </div>
    );
  }
};
