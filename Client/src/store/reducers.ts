import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import { history } from './history';

import { groupsReducer } from 'store/reducers/groupsReducer';
import { lightsReducer } from 'store/reducers/lightsReducer';
import { thermometersReducer } from 'store/reducers/thermometersReducer';
import { reedsReducer } from 'store/reducers/reedsReducer';
import { settingsReducer } from 'store/reducers/settingsReducer';
import { scenariosReducer } from 'store/reducers/scenariosReducer';

const elementsReducer = combineReducers({
  lights: lightsReducer,
  thermometers: thermometersReducer,
  reeds: reedsReducer,
});

export default function createReducer(injectedReducers = {}) {
  const rootReducer = combineReducers({
    router: connectRouter(history),
    ...injectedReducers,
    groups: groupsReducer,
    elements: elementsReducer,
    settings: settingsReducer,
    scenarios: scenariosReducer,
  });

  return rootReducer;
}
