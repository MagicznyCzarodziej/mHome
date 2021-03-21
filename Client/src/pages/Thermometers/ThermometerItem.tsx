import { getTemperatureRange } from 'utils/helpers';
import { Thermometer } from 'types/Thermometer';

import styles from 'pages/Thermometers/Thermometers.module.sass';

export const ThermometerItem = (props: { thermometer: Thermometer }) => {
  const { thermometer } = props;

  const rangeClassSuffix = getTemperatureRange(
    thermometer.latestTemperature
  ).toLowerCase();

  return (
    <div className={styles.thermometer}>
      <div className={styles.thermometer__label}>{thermometer.name}</div>
      <div className={styles[`temperature--${rangeClassSuffix}`]}>
        {thermometer.latestTemperature}ºC
      </div>
    </div>
  );
};
