import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Icon from '@mdi/react';

import { mapIconNameToPath } from 'utils/helpers';
import { selectGroupById } from 'store/reducers/groupsReducer';

import styles from './GroupTopBar.module.sass';

export const GroupTopBar = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const group = useSelector(selectGroupById(groupId));
  const icon = mapIconNameToPath(group?.icon);

  return (
    <div className={styles['group-topbar']}>
      <div className={styles['group-name']}>{group?.name || ''}</div>
      <div className={styles['group-icon']}>
        <Icon path={icon} size={1.5} />
      </div>
    </div>
  );
};
