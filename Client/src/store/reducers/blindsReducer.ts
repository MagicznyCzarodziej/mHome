import {
  createAsyncThunk,
  createSelector,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';

import { Blind, BlindStatus } from 'types/Blind';
import { createSocketAction } from 'store/utils';
import { RootState } from 'store/configureStore';
import { BlindService } from 'services/BlindService';
import { SocketMessage } from 'services/Socket';

interface BlindsState {
  blinds: Blind[];
}

const initialState: BlindsState = {
  blinds: [],
};

//Actions
const blindStateRequest = createSocketAction<{ id: number; position: number }>(
  // SocketMessage.toServer.BLIND_SET
  'blinds/set'
);

// const blindsStateGroupRequest = createSocketAction<{
//   groupId: string;
//   position: number;
// }>(SocketMessage.toServer.BLINDS_SET_GROUP);

// const blindsStateAllRequest = createSocketAction<{ position: number }>(
//   SocketMessage.toServer.BLINDS_SET_ALL
// );

const fetchAllBlinds = createAsyncThunk('blinds/fetchAllBlinds', async () => {
  const response = await BlindService.getAllBlinds();
  return response.data;
});

// Reducer
const blindsSlice = createSlice({
  name: 'blinds',
  initialState,
  reducers: {
    blindStateResponse: (
      state,
      action: PayloadAction<{
        id: number;
        position: number;
        status: BlindStatus;
      }>
    ) => {
      const existingBlind = state.blinds.find(
        (blind) => blind.id === action.payload.id
      );
      if (existingBlind) {
        existingBlind.position = action.payload.position;
        existingBlind.status = action.payload.status;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBlinds.fulfilled, (state, action) => {
        state.blinds = action.payload;
      })
      .addCase(fetchAllBlinds.rejected, (state, action) => {
        console.log('Fetch all blinds request rejected', action);
      });
  },
});

export const blindsActions = {
  ...blindsSlice.actions,
  blindStateRequest,
  // blindsStateAllRequest,
  // blindsStateGroupRequest,
  fetchAllBlinds,
};
export const blindsReducer = blindsSlice.reducer;

// Selectors
const selectBlinds = (state: RootState) => state.elements.blinds;
export const selectAllBlinds = createSelector(
  selectBlinds,
  (state) => state.blinds
);

export const selectBlindsByGroupId = (groupId: string) =>
  createSelector(selectAllBlinds, (blinds) =>
    blinds.filter((blind) => blind.groupId === groupId)
  );
