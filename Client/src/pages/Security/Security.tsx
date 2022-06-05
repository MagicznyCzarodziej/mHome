import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import { History } from './History';
import styles from './Security.module.sass';
import {
  selectConnections,
  securityActions,
} from 'store/reducers/securityReducer';

export const Security = () => {
  const dispatch = useDispatch();

  const connections = useSelector(selectConnections);

  useEffect(() => {
    dispatch(securityActions.fetchConnections());

    return () => {
      dispatch(securityActions.resetSecurity());
    };
  }, [dispatch]);

  return (
    <DefaultLayout>
      <div className={styles.security}>
        <div className={styles.topBar}>
          Aktywne połączenia: {connections.connectionsCount ?? '-'}
          {connections.ipAddresses.map((ip) => (
            <div>{ip}</div>
          ))}
        </div>
        <History />
      </div>
    </DefaultLayout>
  );
};
