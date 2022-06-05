import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Dashboard } from 'pages/Dashboard/Dashboard';
import { Scenarios } from 'pages/Scenarios/Scenarios';
import { Scenario } from 'pages/Scenario/Scenario';
import { CreateScenario } from 'pages/CreateScenario/CreateScenario';
import { Group } from 'pages/Group/Group';
import { Thermometers } from 'pages/Thermometers/Thermometers';
import { Thermometer } from 'pages/Thermometer/Thermometer';
import { Security } from 'pages/Security/Security';
import { Settings } from 'pages/Settings/Settings';

import { groupsActions } from 'store/reducers/groupsReducer';
import { lightsActions } from 'store/reducers/lightsReducer';
import { thermometersActions } from 'store/reducers/thermometersReducer';
import { reedsActions } from './store/reducers/reedsReducer';
import { blindsActions } from 'store/reducers/blindsReducer';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem('MHOME_API_IP')) {
      alert('Ustaw adres API (pamiętaj o http:// i porcie)');
    }
  }, []);

  useEffect(() => {
    dispatch(groupsActions.fetchAllGroups());
    dispatch(thermometersActions.fetchAllThermometers());
    dispatch(lightsActions.fetchAllLights());
    dispatch(reedsActions.fetchAllReeds());
    dispatch(blindsActions.fetchAllBlinds());
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
        <Route exact path="/scenarios/:id">
          <Scenario />
        </Route>
        <Route exact path="/thermometers">
          <Thermometers />
        </Route>
        <Route exact path="/thermometers/:id">
          <Thermometer />
        </Route>
        <Route exact path="/group/:groupId">
          <Group />
        </Route>
        <Route exact path="/security">
          <Security />
        </Route>
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
