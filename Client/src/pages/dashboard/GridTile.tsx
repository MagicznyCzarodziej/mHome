import React, { useState, useRef } from 'react';
import { useHistory } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import cx from 'classnames';

import { Group } from 'types/Group';
import {
  lightsActions,
  selectLightsByGroupId,
} from 'store/reducers/lightsReducer';
import { selectReedsByGroupId } from 'store/reducers/reedsReducer';
import { mapIconNameToPath } from 'utils/helpers';

import styles from 'pages/Dashboard/Dashboard.module.sass';

import { Icon } from '@mdi/react';
import { mdiDoorOpen, mdiDoorClosedLock } from '@mdi/js';

const TILE_LOCK_TIME = 350;
const MOVE_THRESHOLD = 0.7;
const VELOCITY_THRESHOLD = 0.4;

interface Props {
  group: Group;
}

const mapGroupToLockReedId: { [key: string]: number } = {
  GARAGE_AND_OTHERS: 6,
  VESTIBULE: 0,
};

export const GridTile = (props: Props) => {
  const { group } = props;
  const history = useHistory();
  const dispatch = useDispatch();

  const icon = mapIconNameToPath(group.icon);
  const reeds = useSelector(selectReedsByGroupId(group.id));
  const lights = useSelector(selectLightsByGroupId(group.id));
  const isAnyLightOn = lights.some((light) => light.state === 'ON');
  const lockState =
    reeds.find((reed) => reed.id === mapGroupToLockReedId[group.id])?.state ||
    null;

  const tileRef = React.createRef<any>();
  const [fired, setFired] = useState(false);
  const touchStart = useRef<Touch | null>(null);
  const touchLocked = useRef<boolean>(false);
  const [touchStartTimestamp, setTouchStartTimestamp] = useState<any>(null);
  const [touchDirection, setTouchDirection] = useState(0);

  const fire = () => {
    const tileContent = tileRef.current.firstElementChild;
    setFired(true);
    touchLocked.current = true;
    tileContent.style.transform = 'translateX(' + touchDirection * 100 + '%)';

    setTimeout(() => {
      touchLocked.current = false;
      if (!touchStart.current) tileContent.style.transform = 'translateX(0)';
    }, TILE_LOCK_TIME);

    dispatch(
      lightsActions.lightsStateGroupRequest({
        groupId: group.id,
        state: touchDirection === 1 ? 'ON' : 'OFF',
      })
    );
    navigator.vibrate(50);
  };

  const handleTouchStart = (event: any) => {
    if (touchLocked.current) return;
    touchStart.current = event.touches[0];
    setTouchStartTimestamp(event.timeStamp);

    setFired(false);
  };

  const handleTouchMove = (event: any) => {
    const tileContent = tileRef.current.firstElementChild;
    if (fired) return;
    if (!touchStart.current) return;

    const clientX = event.changedTouches[0].clientX;
    const deltaX = clientX - touchStart.current.clientX; // Distance from touch start
    if (touchDirection === 0) {
      setTouchDirection(Math.sign(deltaX));
    }
    const move = deltaX / tileRef.current.clientWidth; // Percentage move of tile width
    tileContent.style.transform = `translateX(${move * 100}%)`;

    if (Math.abs(move) > MOVE_THRESHOLD) {
      fire();
    }
  };

  const handleTouchEnd = (event: any) => {
    const tileContent = tileRef.current.firstElementChild;

    if (!touchLocked.current) {
      tileContent.style.transform = 'translateX(0)';
    }

    const touchEndTimestamp = event.timeStamp;
    const distance =
      event.changedTouches[0].clientX - (touchStart.current?.clientX || 0);
    const deltaTime = touchEndTimestamp - touchStartTimestamp;
    const velocity = Math.abs(distance / deltaTime);

    if (velocity > VELOCITY_THRESHOLD && !fired) {
      fire();
    }
    touchStart.current = null;
    setTouchDirection(0);
    if (!touchLocked.current) tileContent.style.transform = 'translateX(0)';
  };

  return (
    <div
      key={group.id}
      className={styles.grid__tile}
      data-group-id={group.id}
      onClick={() => {
        history.push(`/group/${group.id}`);
      }}
      ref={tileRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div>
        <div
          className={cx(styles.tile__icon, {
            [styles['tile__icon--active']]: isAnyLightOn,
          })}
        >
          <Icon path={icon} size="10vw" />
        </div>
        <div className={styles.tile__label}>{group.name}</div>
        <div className={styles.tile__lights}>
          {lights.map(
            (light) =>
              light.state === 'ON' && (
                <span key={light.id} className={styles['light-dot']} />
              )
          )}
        </div>
        <div className={styles.tile__reeds}>
          {reeds
            .filter(
              // Don't show reed dot if showing door icon
              (reed) => !Object.values(mapGroupToLockReedId).includes(reed.id)
            )
            .map(
              (reed) =>
                reed.state === 'OPEN' && (
                  <span key={reed.id} className={styles['reed-dot']} />
                )
            )}
        </div>

        {lockState === 'CLOSED' && (
          <div
            className={`${styles.tile__lock} ${styles['tile__lock--locked']}`}
          >
            <Icon path={mdiDoorClosedLock} size="1.5rem" />
          </div>
        )}
        {lockState === 'OPEN' && (
          <div
            className={`${styles.tile__lock} ${styles['tile__lock--unlocked']}`}
          >
            <Icon path={mdiDoorOpen} size="1.5rem" />
          </div>
        )}
      </div>
    </div>
  );
};
