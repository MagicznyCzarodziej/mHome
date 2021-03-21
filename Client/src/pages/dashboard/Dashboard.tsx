import { useSelector } from 'react-redux';

import { selectAllGroups } from 'store/reducers/groupsReducer';
import { selectThermometerById } from 'store/reducers/thermometersReducer';
import { getTemperatureRange } from 'utils/helpers';

import styles from './Dashboard.module.sass';
import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import { GridTile } from 'pages/Dashboard/GridTile';

import { Icon } from '@mdi/react';
import {
  mdiLightbulbGroup,
  mdiLightbulbGroupOff,
  mdiBlinds,
  mdiBlindsOpen,
} from '@mdi/js';

// Order in which groups tiles will be placed
const groupsOrder = [
  'KITCHEN',
  'BEDROOM',
  'BATHROOM',
  'ROOM_A',
  'LIVING_ROOM',
  'ROOM_B',
  'GARAGE_AND_OTHERS',
  'VESTIBULE',
  'OUTSIDE',
];

export const Dashboard = () => {
  const groups = useSelector(selectAllGroups);

  const insideThermometer = useSelector(selectThermometerById(0));
  const outsideThermometer = useSelector(selectThermometerById(1));
  const kitchenThermometer = useSelector(selectThermometerById(2));

  const temperatures = [
    outsideThermometer,
    insideThermometer,
    kitchenThermometer,
  ];

  return (
    <DefaultLayout>
      <div className={styles.dashboard}>
        {/* Temperatures */}
        <div className={styles.dashboard__temperatures}>
          {temperatures.map((temperature) => {
            if (!temperature) return null;
            const rangeClass = getTemperatureRange(
              temperature.latestTemperature
            ).toLowerCase();
            return (
              <div
                key={temperature.id}
                className={`${styles.temperature} ${
                  styles[`temperature--${rangeClass}`]
                }`}
              >
                <div className={styles.temperature__value}>
                  {temperature.latestTemperature}ºC
                </div>
                <div className={styles.temperature__label}>
                  {temperature.name}
                </div>
              </div>
            );
          })}
        </div>

        {/* Groups */}
        <div className={styles.dashboard__grid}>
          {groupsOrder.map((groupId) => {
            const group = groups.find((group) => group.id === groupId);
            return group && <GridTile key={group.id} group={group} />;
          })}
        </div>

        {/* Spacer */}
        <div className={styles.dashboard__spacer}>
          <span className={styles.spacer__dot}>&middot;</span>
          <span className={styles.spacer__dot}>&middot;</span>
          <span className={styles.spacer__dot}>&middot;</span>
        </div>

        {/* Controls */}
        <div className={styles.dashboard__controls}>
          <div className={styles.controls__item}>
            <Icon path={mdiLightbulbGroup} size="1.5rem" />
            <Icon path={mdiLightbulbGroupOff} size="1.5rem" />
          </div>
          <div className={styles.controls__item}>
            <Icon path={mdiLightbulbGroup} size="1.5rem" />
            <Icon path={mdiLightbulbGroupOff} size="1.5rem" />
          </div>
          <div className={styles.controls__item}>
            <Icon path={mdiBlinds} size="1.5rem" />
            <Icon path={mdiBlindsOpen} size="1.5rem" />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
