import {
  createAsyncThunk,
  createSlice,
  createSelector,
  PayloadAction,
} from '@reduxjs/toolkit';

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
        console.log(action.payload);

        existingThermometer.temperatures.push(action.payload.temperature);
        existingThermometer.latestTemperature =
          action.payload.temperature.value;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllThermometers.fulfilled, (state, action) => {
      state.thermometers = action.payload;
      state.thermometers.forEach((thermometer) => {
        thermometer.temperatures = [];
      });
    });
  },
});

export const thermometersActions = {
  ...thermometersSlice.actions,
  fetchAllThermometers,
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

export const selectThermometersByGroupId = (groupId: string) =>
  createSelector(selectAllThermometers, (thermometers) =>
    thermometers.filter((thermometer) => thermometer.groupId === groupId)
  );
