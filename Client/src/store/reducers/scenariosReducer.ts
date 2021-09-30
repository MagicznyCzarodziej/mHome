import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import {
  Scenario,
  CreateScenario,
  EditScenario,
  CreateScenarioStatus,
  ScenarioStatus,
} from 'types/Scenario';
import { RootState } from 'store/configureStore';
import { ScenarioService } from 'services/ScenarioService';

interface ScenariosState {
  scenarios: Scenario[];
  scenario: Scenario | null;
  createScenarioStatus: CreateScenarioStatus;
  scenarioStatus: ScenarioStatus;
}

const initialState: ScenariosState = {
  scenarios: [],
  scenario: null,
  createScenarioStatus: 'IDLE',
  scenarioStatus: 'IDLE',
};

// Actions
const fetchAllScenarios = createAsyncThunk(
  'scenarios/fetchAllScenarios',
  async () => {
    const response = await ScenarioService.getAllScenarios();
    return response.data;
  }
);

const fetchScenarioById = createAsyncThunk(
  'scenarios/fetchScenarioById',
  async (id: number) => {
    const response = await ScenarioService.getScenarioById(id);

    return response.data;
  }
);

const deleteScenario = createAsyncThunk(
  'scenarios/deleteScenario',
  async (id: number) => {
    await ScenarioService.deleteScenario(id);
  }
);

const editScenario = createAsyncThunk(
  'scenarios/editScenario',
  async (scenario: EditScenario) => {
    const response = await ScenarioService.editScenario(scenario);
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
  reducers: {
    setCreateScenarioStatus: (
      state,
      action: PayloadAction<CreateScenarioStatus>
    ) => {
      state.createScenarioStatus = action.payload;
    },
    clearScenario: (state) => {
      state.scenario = null;
      state.scenarioStatus = 'IDLE';
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllScenarios.fulfilled, (state, action) => {
        state.scenarios = action.payload;
      })
      .addCase(fetchAllScenarios.rejected, (state, action) => {
        console.log('Fetch all scenarios request rejected', action);
      })
      .addCase(fetchScenarioById.pending, (state, action) => {
        state.scenario = null;
        state.scenarioStatus = 'IDLE';
      })

      // Fetch by id
      .addCase(fetchScenarioById.fulfilled, (state, action) => {
        state.scenario = action.payload;
      })
      .addCase(fetchScenarioById.rejected, (state, action) => {
        console.log('Fetch scenarios by id request rejected', action);
      })

      // Delete
      .addCase(deleteScenario.pending, (state, action) => {
        state.scenarioStatus = 'DELETING';
      })
      .addCase(deleteScenario.fulfilled, (state, action) => {
        state.scenarioStatus = 'DELETING_SUCCESS';
      })
      .addCase(deleteScenario.rejected, (state, action) => {
        state.scenarioStatus = 'DELETING_ERROR';
      })

      // Edit
      .addCase(editScenario.pending, (state, action) => {
        state.scenarioStatus = 'EDITING';
      })
      .addCase(editScenario.fulfilled, (state, action) => {
        state.scenarioStatus = 'EDITING_SUCCESS';
        state.scenario = action.payload;

        // Update scenario in all scenarios to prevent flash-jumping
        // when returning from details to list
        const updatedScenarios = state.scenarios.map((scenario) =>
          scenario.id === action.payload.id ? action.payload : scenario
        );
        state.scenarios = updatedScenarios;
      })
      .addCase(editScenario.rejected, (state, action) => {
        state.scenarioStatus = 'EDITING_ERROR';
      })

      // Create
      .addCase(createScenario.pending, (state, action) => {
        state.createScenarioStatus = 'IN_PROGRESS';
      })
      .addCase(createScenario.fulfilled, (state, action) => {
        state.scenarios = [...state.scenarios, action.payload];
        state.createScenarioStatus = 'SUCCESS';
      })
      .addCase(createScenario.rejected, (state, action) => {
        console.log('Create scenario request rejected', action);
        state.createScenarioStatus = 'ERROR';
      });
  },
});

export const scenariosActions = {
  ...scenariosSlice.actions,
  fetchAllScenarios,
  fetchScenarioById,
  deleteScenario,
  editScenario,
  createScenario,
};
export const scenariosReducer = scenariosSlice.reducer;

// Selectors
const selectScenarios = (state: RootState) => state.scenarios;
export const selectAllScenarios = createSelector(
  selectScenarios,
  (state) => state.scenarios
);

export const selectScenario = createSelector(
  selectScenarios,
  (state) => state.scenario
);

export const selectCreateScenarioStatus = createSelector(
  selectScenarios,
  (state) => state.createScenarioStatus
);

export const selectScenarioStatus = createSelector(
  selectScenarios,
  (state) => state.scenarioStatus
);
