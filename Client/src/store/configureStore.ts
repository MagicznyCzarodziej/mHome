import { configureStore } from '@reduxjs/toolkit';
import { forceReducerReload } from 'redux-injectors';

import { socket } from 'services/Socket';
import createReducer from './reducers';
import createSocketioMiddleware from './middleware/socketio';

const configureAppStore = (initialState = {}) => {
  const store = configureStore({
    reducer: createReducer(),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(createSocketioMiddleware(socket)),
    preloadedState: initialState,
    devTools: process.env.NODE_ENV !== 'production',
  });

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      forceReducerReload(store);
    });
  }

  return store;
};

export const store = configureAppStore();
export type RootState = ReturnType<typeof store.getState>;

// https://blog.logrocket.com/smarter-redux-with-redux-toolkit/
