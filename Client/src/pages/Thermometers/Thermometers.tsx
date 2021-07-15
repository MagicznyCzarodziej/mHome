import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { selectAllThermometers } from 'store/reducers/thermometersReducer';

import { ThermometerItem } from 'pages/Thermometers/ThermometerItem';
import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import styles from './Thermometers.module.sass';

export const Thermometers = () => {
  const allThermometers = useSelector(selectAllThermometers);

  return (
    <DefaultLayout>
      <div className={styles.thermometers}>
        {allThermometers.map((thermometer) => (
          <NavLink to={`/thermometers/${thermometer.id}`} key={thermometer.id}>
            <ThermometerItem thermometer={thermometer} />
          </NavLink>
        ))}
      </div>
    </DefaultLayout>
  );
};
