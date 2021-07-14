import { Api } from './Api';

import { Scenario, CreateScenario } from 'types/Scenario';

const ENDPOINT = '/scenarios';

const getAllScenarios = async () => await Api.get<Scenario[]>(ENDPOINT);

const getScenarioById = async (scenarioId: number) =>
  await Api.get<Scenario[]>(`${ENDPOINT}/${scenarioId}`);

const createScenario = async (scenario: CreateScenario) =>
  await Api.post<Scenario>(ENDPOINT, scenario);

export const ScenarioService = {
  getAllScenarios,
  getScenarioById,
  createScenario,
};
