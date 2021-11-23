import React from 'react';

import styles from './DefaultLayout.module.sass';
import { SideBar } from 'components/SideBar/SideBar';

export const DesktopLayout: React.FC = (props) => {
  return (
    <div className={styles.layout}>
      <SideBar />
      <div className={styles['layout__page-content']}>{props.children}</div>
    </div>
  );
};
