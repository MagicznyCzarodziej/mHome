import { useState } from 'react';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import styles from './Settings.module.sass';

import { Icon } from '@mdi/react';
import { mdiApi, mdiThermometerLow, mdiThermometerHigh } from '@mdi/js';

export const Settings = () => {
  const [apiIp, setApiIp] = useState(
    localStorage.getItem('MHOME_API_IP') || ''
  );
  const [temperatureLow, setTemperatureLow] = useState(
    localStorage.getItem('MHOME_TEMP_THRESHOLD_LOW') || ''
  );
  const [temperatureHigh, setTemperatureHigh] = useState(
    localStorage.getItem('MHOME_TEMP_THRESHOLD_HIGH') || ''
  );

  return (
    <DefaultLayout>
      <div className={styles.settings}>
        <div className={styles.setting}>
          <div className={styles.setting__icon}>
            <Icon path={mdiApi} size={1} />
          </div>
          <span className={styles.setting__label}>Adres API</span>
          <div className={styles.setting__control}>
            <input
              placeholder="np. http://localhost:3000"
              value={apiIp}
              onChange={(event) => {
                let { value } = event.target;
                setApiIp(value);
                localStorage.setItem('MHOME_API_IP', value);
              }}
            />
          </div>
        </div>

        <div className={styles.setting}>
          <div className={styles.setting__icon}>
            <Icon path={mdiThermometerHigh} size={1} />
          </div>
          <span className={styles.setting__label}>
            Próg temperatury - Gorąco
          </span>
          <div className={styles.setting__control}>
            <input
              className={styles['setting__control--short']}
              placeholder="np. 24"
              value={temperatureHigh}
              onChange={(event) => {
                let { value } = event.target;
                value = value.replaceAll(/[^\d.]/g, '');
                setTemperatureHigh(value);
                localStorage.setItem('MHOME_TEMP_THRESHOLD_HIGH', value);
              }}
            />
            ºC
          </div>
        </div>
        <div className={styles.setting}>
          <div className={styles.setting__icon}>
            <Icon path={mdiThermometerLow} size={1} />
          </div>
          <span className={styles.setting__label}>
            Próg temperatury - Zimno
          </span>
          <div className={styles.setting__control}>
            <input
              className={styles['setting__control--short']}
              placeholder="np. 19"
              value={temperatureLow}
              onChange={(event) => {
                let { value } = event.target;
                value = value.replaceAll(/[^\d.]/g, '');
                setTemperatureLow(value);
                localStorage.setItem('MHOME_TEMP_THRESHOLD_LOW', value);
              }}
            />
            ºC
          </div>
        </div>
        <div className={styles.about}>
          <div>
            Niniejszy system sterowania inteligentym domem powstał w ramach
            pracy inżynierskiej na Politechnice Lubelskiej.
          </div>
          <div className={styles.about__people}>
            <div className={styles.about__label}>Autor:</div>
            <div className={styles.about__label}>Promotor:</div>
            <div>Przemysław Pitus</div>
            <div>dr inż Tomasz Szymczyk</div>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
