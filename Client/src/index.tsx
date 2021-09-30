import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { App } from './App';
import { socket, createSocketListeners } from 'services/Socket';
import { store } from 'store/configureStore';

import './index.sass';
import { getApiIp } from './services/Api';

const API_IP = getApiIp();
if (!API_IP)
  localStorage.setItem('MHOME_API_IP', process.env.REACT_APP_API_IP || '');

createSocketListeners(store.dispatch, socket);

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
