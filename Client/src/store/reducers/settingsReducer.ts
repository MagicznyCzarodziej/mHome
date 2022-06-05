import { createSelector, createSlice } from '@reduxjs/toolkit';

import { RootState } from 'store/configureStore';

interface SettingsState {
  settings: {
    apiUrl: string;
  };
}

const initialState: SettingsState = {
  settings: {
    apiUrl: '',
  },
};

// Reducer
const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {},
});

export const settingsActions = { ...settingsSlice.actions };
export const settingsReducer = settingsSlice.reducer;

// Selectors
const selectSettings = (state: RootState) => state.settings;
export const selectAllSettings = createSelector(
  selectSettings,
  (state) => state.settings
);
