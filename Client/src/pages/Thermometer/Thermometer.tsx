import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { DateTime } from 'luxon';
import cx from 'classnames';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';

import {
  VictoryChart,
  VictoryLine,
  VictoryAxis,
  VictoryGroup,
  VictoryBrushContainer,
} from 'victory';
import {
  selectThermometerInfo,
  selectTemperaturesByThermometerId,
  thermometersActions,
} from 'store/reducers/thermometersReducer';

import styles from './Thermometer.module.sass';
import { TemperatureEntry } from 'types/Thermometer';

interface TemperaturesPeriod {
  key: 'ALL' | '30_DAYS' | '7_DAYS' | '24H';
  label: string;
}

const temperaturePeriods: TemperaturesPeriod[] = [
  { key: 'ALL', label: 'Pełne' },
  { key: '30_DAYS', label: '30 dni' },
  { key: '7_DAYS', label: '7 dni' },
  { key: '24H', label: '24h' },
];

export const Thermometer = () => {
  const dispatch = useDispatch();
  const { id } = useParams<{
    id: string;
  }>();

  const [selectedPeriod, setSelectedPeriod] = useState<
    TemperaturesPeriod['key']
  >('24H');

  const thermometerId = Number.parseInt(id);
  const thermometer = useSelector(selectThermometerInfo(thermometerId));
  const temperatures = useSelector(
    selectTemperaturesByThermometerId(thermometerId)
  );

  const [filteredTemperatures, setFilteredTemperatures] = useState<
    TemperatureEntry[]
  >([]);

  const [range, setRange] = useState<[Date, Date]>([
    DateTime.now().minus({ hours: 6 }).toJSDate(),
    DateTime.now().toJSDate(),
  ]);

  useEffect(() => {
    setFilteredTemperatures(
      temperatures?.filter((temperature) => {
        const datetime = new Date(temperature.timestamp);
        return datetime > range[0] && datetime < range[1];
      }) || []
    );
  }, [range, temperatures]);

  useEffect(() => {
    if (thermometer?.id !== undefined) {
      dispatch(
        thermometersActions.fetchTemperaturesByThermometerId(thermometerId)
      );
    }
    // Watch thermometer.id to fetch temperatures only when
    // thermometer data is already fetched.
    // We're not watching whole thermometer object, because it would cause
    // endless loop caused by updating `temperatures` property
  }, [dispatch, thermometerId, thermometer?.id]);

  const getYAxisDomain = (): [number, number] => {
    const values = filteredTemperatures.map((temperature) => temperature.value);
    const minTemperature = Math.min(...values) - 0.5;
    const maxTemperature = Math.max(...values) + 0.5;

    return values.length > 0 ? [minTemperature, maxTemperature] : [0, 1];
  };

  const getXAxisDomain = () => {
    const now = DateTime.now();

    if (temperatures.length > 0) {
      const mapPeriodToDates = {
        ALL: [new Date(temperatures[0].timestamp), now.toJSDate()],
        '30_DAYS': [now.minus({ days: 30 }).toJSDate(), now.toJSDate()],
        '7_DAYS': [now.minus({ days: 7 }).toJSDate(), now.toJSDate()],
        '24H': [now.minus({ hours: 24 }).toJSDate(), now.toJSDate()],
      }[selectedPeriod];
      return { x: mapPeriodToDates as [Date, Date] };
    } else {
      return { x: [new Date(), new Date()] as [Date, Date] };
    }
  };

  return (
    <DefaultLayout>
      <div className={styles.thermometer}>
        {temperatures.length > 1 && (
          <>
            <div className={styles.chartContainer}>
              <VictoryChart>
                <VictoryLine
                  data={filteredTemperatures.map((t) => ({
                    value: t.value,
                    timestamp: DateTime.fromISO(t.timestamp).toJSDate(),
                  }))}
                  interpolation="basis"
                  x="timestamp"
                  y="value"
                  style={{
                    data: {
                      stroke: '#44C869',
                    },
                  }}
                  domain={{ x: range }}
                />
                <VictoryAxis
                  style={{
                    axis: {
                      stroke: '#6B90C8',
                    },
                    tickLabels: {
                      fill: '#6B90C8',
                    },
                  }}
                  tickCount={4}
                  domain={range}
                  tickFormat={(timestamp) => {
                    return DateTime.fromMillis(timestamp).toFormat('HH:mm');
                  }}
                />
                <VictoryAxis
                  dependentAxis
                  domain={getYAxisDomain()}
                  style={{
                    axis: {
                      stroke: '#6B90C8',
                    },
                    tickLabels: {
                      fill: '#6B90C8',
                    },
                  }}
                />
              </VictoryChart>
              <VictoryGroup
                height={150}
                containerComponent={
                  <VictoryBrushContainer
                    brushDimension="x"
                    onBrushDomainChange={(domain, props) => {
                      setRange(domain.x as [Date, Date]);
                    }}
                    brushDomain={{
                      x: range,
                    }}
                    brushStyle={{
                      fill: '#65879a',
                      opacity: 0.5,
                    }}
                  />
                }
              >
                <VictoryLine
                  data={temperatures.map((t) => ({
                    value: t.value,
                    timestamp: DateTime.fromISO(t.timestamp).toJSDate(),
                  }))}
                  interpolation="basis"
                  x="timestamp"
                  y="value"
                  style={{
                    data: {
                      stroke: '#44C869',
                    },
                  }}
                  domain={getXAxisDomain()}
                />
              </VictoryGroup>
            </div>
            <div className={styles.periodButtons}>
              {temperaturePeriods.map((period) => (
                <button
                  key={period.key}
                  className={cx(styles.periodButton, {
                    [styles['periodButton__active']]:
                      selectedPeriod === period.key,
                  })}
                  onClick={() => {
                    setSelectedPeriod(period.key);
                    const now = DateTime.now();
                    const range = {
                      ALL: [
                        new Date(temperatures[0].timestamp),
                        now.toJSDate(),
                      ],
                      '30_DAYS': [
                        now.minus({ days: 30 }).toJSDate(),
                        now.toJSDate(),
                      ],
                      '7_DAYS': [
                        now.minus({ days: 7 }).toJSDate(),
                        now.toJSDate(),
                      ],
                      '24H': [
                        now.minus({ hours: 24 }).toJSDate(),
                        now.toJSDate(),
                      ],
                    }[period.key];
                    setRange(range as [Date, Date]);
                  }}
                >
                  {period.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </DefaultLayout>
  );
};
