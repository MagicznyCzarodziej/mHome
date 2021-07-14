import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Dashboard } from 'pages/Dashboard/Dashboard';
import { Scenarios } from 'pages/Scenarios/Scenarios';
import { CreateScenario } from 'pages/CreateScenario/CreateScenario';
import { Group } from 'pages/Group/Group';
import { Thermometers } from 'pages/Thermometers/Thermometers';
import { Thermometer } from 'pages/Thermometer/Thermometer';
import { Settings } from 'pages/Settings/Settings';

import { groupsActions } from 'store/reducers/groupsReducer';
import { lightsActions } from 'store/reducers/lightsReducer';
import { thermometersActions } from 'store/reducers/thermometersReducer';
import { reedsActions } from './store/reducers/reedsReducer';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(groupsActions.fetchAllGroups());
    dispatch(thermometersActions.fetchAllThermometers());
    dispatch(lightsActions.fetchAllLights());
    dispatch(reedsActions.fetchAllReeds());
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        <Route exact path="/scenarios">
          <Scenarios />
        </Route>
        <Route exact path="/scenarios/new">
          <CreateScenario />
        </Route>
        <Route exact path="/thermometers">
          <Thermometers />
        </Route>
        <Route exact path="/thermometer/:id">
          <Thermometer />
        </Route>
        <Route exact path="/group/:groupId">
          <Group />
        </Route>
        <Route exact path="/security"></Route>
        <Route exact path="/settings">
          <Settings />
        </Route>
        <Route path="/">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  );
};