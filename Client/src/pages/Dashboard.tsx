import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { selectThermometerById } from 'store/reducers/thermometersReducer';

import { getTemperatureRange } from 'utils/helpers';
import { DashboardGridTile } from 'types/DashboardGridTile';

import styles from './Dashboard.module.sass';
import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import { GridTile } from 'pages/dashboard/GridTile';

import { Icon } from '@mdi/react';
import {
  mdiSilverwareVariant,
  mdiBedKingOutline,
  mdiBedEmpty,
  mdiShower,
  mdiWall,
  mdiCarSide,
  mdiDoorClosed,
  mdiLightbulbGroup,
  mdiLightbulbGroupOff,
  mdiBlinds,
  mdiBlindsOpen,
  mdiMonitor,
} from '@mdi/js';

const groups: DashboardGridTile[] = [
  {
    id: 'KITCHEN',
    label: 'Kitchen',
    icon: mdiSilverwareVariant,
  },
  {
    id: 'BEDROOM',
    label: 'Sypialnia',
    icon: mdiBedEmpty,
  },
  {
    id: 'BATHROOM',
    label: 'Łazienki / Pralnia',
    icon: mdiShower,
  },
  {
    id: 'ROOM_A',
    label: 'Pokój A',
    icon: mdiMonitor,
  },
  {
    id: 'LIVING_ROOM',
    label: 'Salon',
    icon: mdiBedKingOutline,
  },
  {
    id: 'ROOM_B',
    label: 'Pokój B',
    icon: mdiMonitor,
  },
  {
    id: 'GARAGE_AND_OTHERS',
    label: 'Garaż | Kotłownia',
    icon: mdiCarSide,
    lock: 'UNLOCKED',
  },
  {
    id: 'VESTIBULE',
    label: 'Ganek | Korytarz',
    icon: mdiDoorClosed,
    lock: 'LOCKED',
  },
  {
    id: 'OUTSIDE',
    label: 'Dwór',
    icon: mdiWall,
  },
];

export const Dashboard = () => {
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
          {groups.map((tile) => GridTile(tile))}
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
