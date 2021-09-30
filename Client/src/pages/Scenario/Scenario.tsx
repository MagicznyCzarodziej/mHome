import { useEffect, useState } from 'react';
import { useImmer } from 'use-immer';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useHistory } from 'react-router';

import { scenariosActions } from 'store/reducers/scenariosReducer';
import {
  selectScenario,
  selectScenarioStatus,
} from 'store/reducers/scenariosReducer';

import { DefaultLayout } from 'components/layouts/DefaultLayout/DefaultLayout';
import { Scenario as IScenario } from 'types/Scenario';
import { ScenarioProvider } from './ScenarioContext';
import { ScenarioContent } from './ScenarioContent';

export const Scenario = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id: scenarioId } = useParams<{ id: string }>();

  const scenario = useSelector(selectScenario);
  const [updatedScenario, setUpdatedScenario] = useImmer<IScenario | null>(
    null
  );

  const status = useSelector(selectScenarioStatus);
  const [editing, setEditing] = useState(false);

  // Fetch scenario and reset view on leave
  useEffect(() => {
    dispatch(scenariosActions.fetchScenarioById(Number.parseInt(scenarioId)));
    return () => {
      dispatch(scenariosActions.clearScenario());
    };
  }, [dispatch, scenarioId]);

  useEffect(() => {
    // Clone scenario to updatedScenario
    setUpdatedScenario(scenario);
  }, [scenario, setUpdatedScenario]);

  useEffect(() => {
    switch (status) {
      case 'DELETING_SUCCESS':
        history.push('/scenarios');
        break;

      case 'DELETING_ERROR':
        alert('Błąd podczas usuwania!');
        break;

      case 'EDITING_SUCCESS':
        setEditing(false);
        break;

      case 'EDITING_ERROR':
        alert('Błąd podczas zapisu!');
        break;
    }
  }, [status, history]);

  const saveScenario = () => {
    if (updatedScenario) {
      dispatch(scenariosActions.editScenario(updatedScenario));
    }
  };

  const deleteScenario = () => {
    if (scenario) {
      dispatch(scenariosActions.deleteScenario(scenario.id));
    }
  };

  return (
    <DefaultLayout>
      <ScenarioProvider
        value={{
          scenario,
          updatedScenario,
          setUpdatedScenario,
          editing,
          setEditing,
          status,
          saveScenario,
          deleteScenario,
        }}
      >
        <ScenarioContent />
      </ScenarioProvider>
    </DefaultLayout>
  );
};
