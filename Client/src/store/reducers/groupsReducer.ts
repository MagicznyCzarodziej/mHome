import {
  createAsyncThunk,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

import { Group } from 'types/Group';
import { GroupService } from 'services/GroupService';
import { RootState } from 'store/configureStore';

interface GroupsState {
  groups: Group[];
}

const initialState: GroupsState = {
  groups: [],
};

// Actions
const fetchAllGroups = createAsyncThunk('groups/fetchAllGroups', async () => {
  const response = await GroupService.getAllGroups();
  return response.data;
});

// Reducer
const groupsSlice = createSlice({
  name: 'groups',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(fetchAllGroups.rejected, (state, action) => {
        console.log('Fetch all groups request rejected', action);
      });
  },
});

export const groupsActions = { ...groupsSlice.actions, fetchAllGroups };
export const groupsReducer = groupsSlice.reducer;

// Selectors
const selectGroups = (state: RootState) => state.groups;
export const selectAllGroups = createSelector(
  selectGroups,
  (state) => state.groups
);

export const selectGroupById = (id: string) =>
  createSelector(selectAllGroups, (groups) =>
    groups.find((group) => group.id === id)
  );
