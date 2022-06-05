import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';
import { DateTime } from 'luxon';

import { Thermometer, TemperatureEntry } from 'types/Thermometer';
import { ThermometerService } from 'services/ThermometerService';
import { RootState } from 'store/configureStore';

interface ThermometersState {
  thermometers: Thermometer[];
}

const initialState: ThermometersState = {
  thermometers: [],
};

// Actions
const fetchAllThermometers = createAsyncThunk(
  'thermometers/fetchAllThermometers',
  async () => {
    const response = await ThermometerService.getAllThermometers();
    return response.data;
  }
);

const fetchTemperaturesByThermometerId = createAsyncThunk(
  'thermometers/fetchTemperaturesByThermometerId',
  async (thermometerId: number) => {
    const response = await ThermometerService.getTemperaturesByThermometerId(
      thermometerId
    );
    return { thermometerId, temperatures: response.data };
  }
);

// Reducer
const thermometersSlice = createSlice({
  name: 'thermometers',
  initialState,
  reducers: {
    thermometerTemperatureResponse: (
      state,
      action: PayloadAction<{
        thermometerId: number;
        temperature: TemperatureEntry;
      }>
    ) => {
      const existingThermometer = state.thermometers.find(
        (thermometer) => thermometer.id === action.payload.thermometerId
      );
      if (existingThermometer) {
        existingThermometer.temperatures.push(action.payload.temperature);
        existingThermometer.latestTemperature =
          action.payload.temperature.value;
      }
    },
  },
  extraReducers: (builder) => {
    // Fetch all thermometers
    builder.addCase(fetchAllThermometers.fulfilled, (state, action) => {
      state.thermometers = action.payload;
      state.thermometers.forEach((thermometer) => {
        thermometer.temperatures = [];
      });
    });

    // Fetch temperatures by thermometerId
    builder.addCase(
      fetchTemperaturesByThermometerId.fulfilled,
      (state, action) => {
        const thermometer = state.thermometers.find(
          (thermometer) => thermometer.id === action.payload.thermometerId
        );
        if (thermometer) thermometer.temperatures = action.payload.temperatures;
      }
    );
  },
});

export const thermometersActions = {
  ...thermometersSlice.actions,
  fetchAllThermometers,
  fetchTemperaturesByThermometerId,
};
export const thermometersReducer = thermometersSlice.reducer;

// Selectors
const selectThermometers = (state: RootState) => state.elements.thermometers;

export const selectAllThermometers = createSelector(
  selectThermometers,
  (state) => state.thermometers
);

export const selectThermometerById = (id: number) =>
  createSelector(selectAllThermometers, (thermometers) =>
    thermometers.find((thermometer) => thermometer.id === id)
  );

/** Selects all thermometer parameters excluding temperatures entries */
export const selectThermometerInfo = (id: number) =>
  createSelector(selectAllThermometers, (thermometers) => {
    const thermometer = thermometers.find(
      (thermometer) => thermometer.id === id
    );
    if (thermometer) {
      const { temperatures, ...restFields } = thermometer;
      return restFields;
    } else return undefined;
  });

export const selectThermometersByGroupId = (groupId: string) =>
  createSelector(selectAllThermometers, (thermometers) =>
    thermometers.filter((thermometer) => thermometer.groupId === groupId)
  );

export const selectTemperaturesByThermometerId = (thermometerId: number) =>
  createSelector(
    selectThermometerById(thermometerId),
    (thermometer) => thermometer?.temperatures || []
  );

export const selectLast24hTemperaturesByThermometerId = (
  thermometerId: number
) =>
  createSelector(
    selectTemperaturesByThermometerId(thermometerId),
    (temperatures) =>
      temperatures?.filter(
        (temperature) =>
          DateTime.fromISO(temperature.timestamp) >
          DateTime.now().minus({ day: 1 })
      ) || []
  );
