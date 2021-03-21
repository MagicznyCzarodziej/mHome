import { useSelector } from 'react-redux';

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
          <ThermometerItem key={thermometer.id} thermometer={thermometer} />
        ))}
      </div>
    </DefaultLayout>
  );
};
