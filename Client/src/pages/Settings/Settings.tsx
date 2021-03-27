import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import styles from './Settings.module.sass';

import { Icon } from '@mdi/react';
import { mdiApi } from '@mdi/js';

export const Settings = () => {
  return (
    <DefaultLayout>
      <div className={styles.settings}>
        <div className={styles.setting}>
          <div className={styles.setting__icon}>
            <Icon path={mdiApi} size={1} />
          </div>
          <span className={styles.setting__label}>Adres API</span>
          <div className={styles.setting__control}>
            <input />
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};
