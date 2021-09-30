import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { RootState } from 'store/configureStore';
import { HistoryEntry } from 'types/History';
import { SecurityService } from 'services/SecurityService';

interface SecurityState {
  history: {
    data: HistoryEntry[];
    loading: Boolean;
    nextCursor: number;
    hasNextPage: Boolean;
  };
  connections: {
    ipAddresses: string[];
    connectionsCount: number | null;
  };
}

const initialState: SecurityState = {
  history: {
    data: [],
    loading: true,
    nextCursor: 0,
    hasNextPage: true,
  },
  connections: {
    ipAddresses: [],
    connectionsCount: null,
  },
};

// Actions
const fetchHistory = createAsyncThunk('security/fetchHistory', async () => {
  const response = await SecurityService.getHistory(0, 20);
  return response.data;
});

const fetchHistoryNextPage = createAsyncThunk<any, void, { state: RootState }>(
  'security/fetchHistoryNextPage',
  async (_, thunkApi) => {
    const state = thunkApi.getState().security;
    const response = await SecurityService.getHistory(
      state.history.nextCursor,
      20
    );
    return response.data;
  }
);

const fetchConnections = createAsyncThunk(
  'security/fetchConnections',
  async () => {
    const response = await SecurityService.getConnectionsCount();
    return response.data;
  }
);

// Reducer
const securitySlice = createSlice({
  name: 'security',
  initialState,
  reducers: {
    resetSecurity: (state) => {
      state.history = initialState.history;
      state.connections = initialState.connections;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history.loading = false;
        state.history.data = action.payload.data;
        state.history.nextCursor = action.payload.nextCursor;
        if (action.payload.data.length === 0) state.history.hasNextPage = false;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.history.loading = false;
        console.log('Fetch history request rejected', action);
      })
      .addCase(fetchHistoryNextPage.pending, (state, action) => {
        state.history.loading = false;
      })
      .addCase(fetchHistoryNextPage.fulfilled, (state, action) => {
        state.history.loading = false;
        state.history.data.push(...action.payload.data);
        state.history.nextCursor = action.payload.nextCursor;
        if (action.payload.data.length === 0) state.history.hasNextPage = false;
      })
      .addCase(fetchHistoryNextPage.rejected, (state, action) => {
        state.history.loading = false;
        console.log('Fetch history next page request rejected', action);
      })
      .addCase(fetchConnections.fulfilled, (state, action) => {
        state.connections = action.payload;
      })
      .addCase(fetchConnections.rejected, (state, action) => {
        state.connections = initialState.connections;
        console.log('Fetch history next page request rejected', action);
      });
  },
});

export const securityActions = {
  ...securitySlice.actions,
  fetchHistory,
  fetchHistoryNextPage,
  fetchConnections,
};
export const securityReducer = securitySlice.reducer;

// Selectors
const selectSecurity = (state: RootState) => state.security;

export const selectHistory = createSelector(
  selectSecurity,
  (state) => state.history
);

export const selectConnections = createSelector(
  selectSecurity,
  (state) => state.connections
);
