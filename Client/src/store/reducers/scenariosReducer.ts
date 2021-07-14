import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { Scenario, CreateScenario } from 'types/Scenario';
import { RootState } from 'store/configureStore';
import { ScenarioService } from 'services/ScenarioService';

interface ScenariosState {
  scenarios: Scenario[];
}

const initialState: ScenariosState = {
  scenarios: [],
};

//Actions
const fetchAllScenarios = createAsyncThunk(
  'scenarios/fetchAllScenarios',
  async () => {
    const response = await ScenarioService.getAllScenarios();
    return response.data;
  }
);

const createScenario = createAsyncThunk(
  'scenarios/createScenario',
  async (scenario: CreateScenario) => {
    const response = await ScenarioService.createScenario(scenario);
    return response.data;
  }
);

// Reducer
const scenariosSlice = createSlice({
  name: 'scenarios',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllScenarios.fulfilled, (state, action) => {
        state.scenarios = action.payload;
      })
      .addCase(fetchAllScenarios.rejected, (state, action) => {
        console.log('Fetch all scenarios request rejected', action);
      })
      .addCase(createScenario.fulfilled, (state, action) => {
        state.scenarios = [...state.scenarios, action.payload];
      })
      .addCase(createScenario.rejected, (state, action) => {
        console.log('Create scenario request rejected', action);
      });
  },
});

export const scenariosActions = {
  ...scenariosSlice.actions,
  fetchAllScenarios,
  createScenario,
};
export const scenariosReducer = scenariosSlice.reducer;

// Selectors
const selectScenarios = (state: RootState) => state.scenarios;
export const selectAllScenarios = createSelector(
  selectScenarios,
  (state) => state.scenarios
);
