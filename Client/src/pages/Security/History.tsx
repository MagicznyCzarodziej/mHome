import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DateTime } from 'luxon';
import { useMediaQuery } from '@react-hook/media-query';

import styles from './Security.module.sass';
import { selectHistory, securityActions } from 'store/reducers/securityReducer';
import { Select } from 'components/Select/Select';

export const History = () => {
  const dispatch = useDispatch();
  const isDesktop = useMediaQuery('(min-width: 600px)');

  const history = useSelector(selectHistory);

  const [eventType, setEventType] = useState<string>('ALL');
  const [timeFrom, setTimeFrom] = useState<number>(0);
  const [timeTo, setTimeTo] = useState<number>(Date.now());

  useEffect(() => {
    dispatch(
      securityActions.fetchHistory({
        eventType,
        timeFrom,
        timeTo: timeTo + 86400000,
      })
    );
  }, [dispatch, eventType, timeFrom, timeTo]);

  return (
    <>
      <div className={styles.history}>
        <div className={styles.history__label}>Historia:</div>
        <div>
          <div className={isDesktop ? styles['history--desktop'] : ''}>
            <div className={styles.filters}>
              <div className={styles.filters__label}>Zdarzenia od</div>
              <input
                type="date"
                className={styles.filters__field}
                onChange={(event) => {
                  setTimeFrom(Date.parse(event.target.value));
                }}
              />
            </div>
            <div className={styles.filters}>
              <div className={styles.filters__label}>Zdarzenia do</div>
              <input
                type="date"
                max={DateTime.now().toISODate()}
                className={styles.filters__field}
                onChange={(event) => {
                  setTimeTo(Date.parse(event.target.value));
                }}
              />
            </div>
            <div className={styles.filters}>
              <div className={styles.filters__label}>Typ zdarzenia</div>
              <Select
                placeholder="Wybierz typ zdarzenia"
                value={eventType}
                handleChange={(value: string) => {
                  setEventType(value);
                }}
              >
                <option selected value="ALL">
                  Wszystkie
                </option>
                <option value="lights/set">Żądanie ustawienia światła</option>
                <option value="lights/update">Zmiana stanu światła</option>
                <option value="lights/set/group">
                  Żądanie ustawienia świateł w grupie
                </option>
                <option value="thermometers/newTemperature">
                  Odczyt temperatury
                </option>
                <option value="blinds/set">Żądanie ustawienia rolety</option>
                <option value="blinds/set/all">
                  Żądanie ustawienia wszystkich rolet
                </option>
                <option value="blinds/update">Zmiana stanu rolet</option>
                <option value="scenarios/update">
                  Aktualizacja scenariusza
                </option>
              </Select>
            </div>
          </div>
          {history.data.map((entry) => (
            <div className={styles.history__entry} key={entry.id}>
              <div className={styles.entry__date}>
                {DateTime.fromISO(entry.timestamp).toFormat(
                  'dd.MM.yyyy HH:mm:ss'
                )}
              </div>
              <div className={isDesktop ? styles['entry--desktop'] : ''}>
                Zdarzenie: {mapEventToLabel(entry.eventType)}
              </div>
            </div>
          ))}
        </div>
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

const mapEventToLabel = (event: string): string => {
  return (
    ({
      'lights/set': 'Żądanie ustawienia światła',
      'lights/update': 'Zmiana stanu światła',
      'lights/set/group': 'Żądanie ustawienia świateł w grupie',
      'thermometers/newTemperature': 'Odczyt temperatury',
      'blinds/set': 'Żądanie ustawienia rolety',
      'blinds/set/all': 'Żądanie ustawienia wszystkich rolet',
      'blinds/update': 'Zmiana stanu rolet',
      'scenarios/update': 'Aktualizacja scenariusza',
      'reeds/update': 'Zmiana stanu kontaktronu',
    } as any)[event] || event
  );
};
