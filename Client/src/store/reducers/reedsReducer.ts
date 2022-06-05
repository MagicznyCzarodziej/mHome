import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { Reed, ReedState } from 'types/Reed';
import { RootState } from 'store/configureStore';
import { ReedService } from 'services/ReedService';

interface ReedsState {
  reeds: Reed[];
}

const initialState: ReedsState = {
  reeds: [],
};

const fetchAllReeds = createAsyncThunk('reeds/fetchAllReeds', async () => {
  const response = await ReedService.getAllReeds();
  return response.data;
});

// Reducer
const reedsSlice = createSlice({
  name: 'reeds',
  initialState,
  reducers: {
    reedStateResponse: (
      state,
      action: PayloadAction<{ id: number; state: ReedState }>
    ) => {
      const existingReed = state.reeds.find(
        (reed) => reed.id === action.payload.id
      );
      if (existingReed) existingReed.state = action.payload.state;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllReeds.fulfilled, (state, action) => {
        state.reeds = action.payload;
      })
      .addCase(fetchAllReeds.rejected, (state, action) => {
        console.log('Fetch all reeds request rejected', action);
      });
  },
});

export const reedsActions = {
  ...reedsSlice.actions,
  fetchAllReeds,
};
export const reedsReducer = reedsSlice.reducer;

// Selectors
const selectReeds = (state: RootState) => state.elements.reeds;
export const selectAllReeds = createSelector(
  selectReeds,
  (state) => state.reeds
);

export const selectReedsByGroupId = (groupId: string) =>
  createSelector(selectAllReeds, (reeds) =>
    reeds.filter((reed) => reed.groupId === groupId)
  );
