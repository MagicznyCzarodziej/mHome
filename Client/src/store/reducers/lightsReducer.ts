import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { Light } from 'types/Light';
import { OnOff } from 'types/OnOff';
import { createSocketAction } from 'store/utils';
import { RootState } from 'store/configureStore';
import { LightService } from 'services/LightService';

interface LightsState {
  lights: Light[];
}

const initialState: LightsState = {
  lights: [],
};

//Actions
const lightStateRequest = createSocketAction<{ id: number; state: OnOff }>(
  'lights/set'
);

const fetchAllLights = createAsyncThunk('lights/fetchAllLights', async () => {
  const response = await LightService.getAllLights();
  return response.data;
});

// Reducer
const lightsSlice = createSlice({
  name: 'lights',
  initialState,
  reducers: {
    lightStateResponse: (
      state,
      action: PayloadAction<{ id: number; state: OnOff }>
    ) => {
      const existingLight = state.lights.find(
        (light) => light.id === action.payload.id
      );
      if (existingLight) existingLight.state = action.payload.state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllLights.fulfilled, (state, action) => {
        state.lights = action.payload;
      })
      .addCase(fetchAllLights.rejected, (state, action) => {
        console.log('Fetch all lights request rejected', action);
      });
  },
});

export const lightsActions = {
  ...lightsSlice.actions,
  lightStateRequest,
  fetchAllLights,
};
export const lightsReducer = lightsSlice.reducer;

// Selectors
const selectLights = (state: RootState) => state.elements.lights;
export const selectAllLights = createSelector(
  selectLights,
  (state) => state.lights
);

export const selectLightsByGroupId = (groupId: string) =>
  createSelector(selectAllLights, (lights) =>
    lights.filter((light) => light.groupId === groupId)
  );
