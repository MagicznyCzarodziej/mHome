import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './App';
import { socket, createSocketListeners } from 'services/Socket';
import { store } from 'store/configureStore';

import './index.sass';

createSocketListeners(store.dispatch, socket);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
