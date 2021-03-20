import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import { Dashboard } from 'pages/Dashboard';
import { Thermometers } from 'pages/Thermometers';
import { Settings } from 'pages/Settings';

import { groupsActions } from 'store/reducers/groupsReducer';
import { lightsActions } from 'store/reducers/lightsReducer';
import { thermometersActions } from 'store/reducers/thermometersReducer';

export const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(groupsActions.fetchAllGroups());
    dispatch(thermometersActions.fetchAllThermometers());
    dispatch(lightsActions.fetchAllLights());
  }, [dispatch]);

  return (
    <Router>
      <Switch>
        <Route exact path="/thermometers">
          <Thermometers />
        </Route>
        <Route exact path="/group/:groupId"></Route>
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
