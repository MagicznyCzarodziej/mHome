import { Reed } from 'types/Reed';
import cx from 'classnames';

import styles from './Group.module.sass';

interface Props {
  reed: Reed;
}

const reedStateLabel = {
  OPEN: 'Otwarte',
  CLOSED: 'Zamknięte',
};

export const ReedItem = (props: Props) => {
  const { reed } = props;

  return (
    <div key={reed.id} className={styles.element}>
      <div className={styles.element__name}>{reed.name}</div>
      <div className={styles.element__control}>
        <div
          className={cx({
            [styles['reed--open']]: reed.state === 'OPEN',
            [styles['reed--closed']]: reed.state === 'CLOSED',
          })}
        >
          {reedStateLabel[reed.state]}
        </div>
      </div>
    </div>
  );
};
