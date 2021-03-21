import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import cx from 'classnames';

import { selectGroupById } from 'store/reducers/groupsReducer';
import { selectLightsByGroupId } from 'store/reducers/lightsReducer';
import { selectThermometersByGroupId } from 'store/reducers/thermometersReducer';
import { selectReedsByGroupId } from 'store/reducers/reedsReducer';
import { getTemperatureRange } from 'utils/helpers';

import { GroupLayout } from 'components/layouts/GroupLayout/GroupLayout';
import { LightItem } from 'pages/Group/LightItem';
import { ReedItem } from 'pages/Group/ReedItem';
import styles from './Group.module.sass';

export const Group = () => {
  const { groupId } = useParams<{ groupId: string }>();

  const group = useSelector(selectGroupById(groupId));
  const lights = useSelector(selectLightsByGroupId(groupId));
  const thermometers = useSelector(selectThermometersByGroupId(groupId));
  const reeds = useSelector(selectReedsByGroupId(groupId));

  if (!group) return null;

  return (
    <GroupLayout>
      <div>
        {thermometers.length > 0 && (
          <div className={styles['group-temperatures']}>
            {/* Thermometers */}
            {thermometers.map((thermometer) => {
              const rangeClassSuffix = getTemperatureRange(
                thermometer.latestTemperature
              ).toLowerCase();
              return (
                <div
                  key={thermometer.id}
                  className={cx(
                    styles.temperature,
                    styles[`temperature--${rangeClassSuffix}`]
                  )}
                >
                  <div>{thermometer.latestTemperature}&deg;C</div>
                  <div className={styles.temperature__label}>
                    {thermometer.name}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className={styles.elements}>
          {/* Lights */}
          {lights.map((light) => (
            <LightItem key={light.id} light={light} />
          ))}

          {/* Reeds */}
          {reeds.map((reed) => (
            <div key={reed.id}>
              <ReedItem key={reed.id} reed={reed} />
            </div>
          ))}
        </div>
      </div>
    </GroupLayout>
  );
};
