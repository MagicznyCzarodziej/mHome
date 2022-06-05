import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import cx from 'classnames';

import { Blind, BlindStatus } from 'types/Blind';
import { blindsActions } from 'store/reducers/blindsReducer';

import styles from './Group.module.sass';

import { Icon } from '@mdi/react';
import {
  mdiWindowShutter,
  mdiWindowShutterOpen,
  mdiChevronDoubleUp,
  mdiChevronDoubleDown,
} from '@mdi/js';

interface Props {
  blind: Blind;
}

export const BlindItem = (props: Props) => {
  const { blind } = props;

  const dispatch = useDispatch();
  const [value, setValue] = useState(blind.position);

  const handleSetBlind = (value: number) => {
    dispatch(
      blindsActions.blindStateRequest({ id: blind.id, position: value })
    );
  };

  useEffect(() => {
    setValue(blind.position);
  }, [blind.position]);

  const renderBlindStatusIcon = () => {
    const { status } = blind;
    if (status === BlindStatus.IDLE) return null;

    const icon = {
      [BlindStatus.MOVING_UP]: mdiChevronDoubleUp,
      [BlindStatus.MOVING_DOWN]: mdiChevronDoubleDown,
    }[status];

    return (
      <div className={styles.blind__status}>
        <Icon path={icon} size="1.5rem" />
      </div>
    );
  };

  return (
    <div key={blind.id} className={styles.element}>
      <div className={styles.element__name}>{blind.name}</div>
      {renderBlindStatusIcon()}
      <div className={cx([styles.element__control, styles.blind__control])}>
        <div
          className={cx([
            styles.blind__button,
            { [styles['blind__button--disabled']]: blind.position === 0 },
          ])}
          onClick={() => {
            setValue(0);
            handleSetBlind(0);
          }}
        >
          <Icon path={mdiWindowShutter} size="1.5rem" />
        </div>
        <div className={styles.blind__position}>
          <input
            type="number"
            value={value.toString()}
            onChange={(event) => {
              const value = Number.parseInt(event.target.value);
              if (isNaN(value) || value <= 0) setValue(0);
              else if (value > 100) return;
              else setValue(value);
            }}
            onBlur={() => {
              handleSetBlind(value);
            }}
          />{' '}
          %
        </div>
        <div
          className={cx([
            styles.blind__button,
            { [styles['blind__button--disabled']]: blind.position === 100 },
          ])}
          onClick={() => {
            setValue(100);
            handleSetBlind(100);
          }}
        >
          <Icon path={mdiWindowShutterOpen} size="1.5rem" />
        </div>
      </div>
    </div>
  );
};
