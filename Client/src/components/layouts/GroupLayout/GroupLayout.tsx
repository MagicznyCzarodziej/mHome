import React from 'react';

import styles from './GroupLayout.module.sass';
import { GroupTopBar } from 'components/GroupTopBar/GroupTopBar';
import { BottomNavigation } from 'components/BottomNavigation/BottomNavigation';

export const GroupLayout: React.FC = (props) => {
  return (
    <div className={styles.layout}>
      <GroupTopBar />
      <div className={styles['layout__page-content']}>{props.children}</div>
      <BottomNavigation />
    </div>
  );
};
