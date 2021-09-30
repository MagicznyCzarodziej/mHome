import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';

import styles from './Security.module.sass';
import { selectHistory, securityActions } from 'store/reducers/securityReducer';

export const History = () => {
  const dispatch = useDispatch();

  const history = useSelector(selectHistory);

  useEffect(() => {
    dispatch(securityActions.fetchHistory());
  }, [dispatch]);

  return (
    <>
      <div className={styles.history}>
        Historia:
        <div>
          Od
          <input type="date" />
          Do <input type="date" max={DateTime.now().toISODate()} /> Zdarzenie
          <input />
          Źródło
          <input />
          Sortuj rosnąco/malejąco
          <input />
        </div>
        {history.data.map((entry) => (
          <div className={styles.history__entry} key={entry.id}>
            {DateTime.fromISO(entry.timestamp).toFormat('dd.MM.yyyy HH:mm:ss')}{' '}
            {entry.eventType}
          </div>
        ))}
      </div>
      {history.hasNextPage && !history.loading && (
        <div
          className={styles.loadMore}
          onClick={() => {
            dispatch(securityActions.fetchHistoryNextPage());
          }}
        >
          Załaduj więcej...
        </div>
      )}
    </>
  );
};
