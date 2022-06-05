import { Api } from './Api';

import { Scenario, CreateScenario, EditScenario } from 'types/Scenario';

const ENDPOINT = '/scenarios';

const getAllScenarios = async () => await Api().get<Scenario[]>(ENDPOINT);

const getScenarioById = async (scenarioId: number) =>
  await Api().get<Scenario>(`${ENDPOINT}/${scenarioId}`);

const deleteScenario = async (scenarioId: number) =>
  await Api().delete(`${ENDPOINT}/${scenarioId}`);

const editScenario = async (scenario: EditScenario) =>
  await Api().patch<Scenario>(`${ENDPOINT}/${scenario.id}`, scenario);

const createScenario = async (scenario: CreateScenario) =>
  await Api().post<Scenario>(ENDPOINT, scenario);

export const ScenarioService = {
  getAllScenarios,
  getScenarioById,
  deleteScenario,
  editScenario,
  createScenario,
};
