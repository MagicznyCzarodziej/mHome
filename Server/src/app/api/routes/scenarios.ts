import { Router } from 'express';
import { Container } from 'typedi';
import { ScenariosRepository } from 'app/repositories/ScenariosRepository';
import { validateAndParseId } from '../middlewares/validateId';
import { Scenario } from './../../interfaces/Scenario';

const scenarios = Router();
const scenariosRepository = Container.get(ScenariosRepository);

scenarios.get('/', async (req, res) => {
  try {
    const scenarios = await scenariosRepository.getAllScenarios();
    res.send(scenarios);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

scenarios.get('/:id', validateAndParseId, async (req, res) => {
  try {
    const { id } = res.locals;

    const scenario = await scenariosRepository.getScenario(id, true);
    if (!scenario) return res.status(404).send({ error: 'Scenario not found' });
    res.send(scenario);
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

scenarios.delete('/:id', validateAndParseId, async (req, res) => {
  try {
    const { id } = res.locals;

    const scenario = await scenariosRepository.deleteScenario(id);

    if (!scenario) return res.status(404).send({ error: 'Scenario not found' });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

scenarios.patch('/:id', validateAndParseId, async (req, res) => {
  try {
    const { id } = res.locals;
    const { entries } = req.body;
    const data = {
      ...req.body,
      ...(entries && { entries: JSON.stringify(entries) }),
    };
    const scenario = await scenariosRepository.editScenario(id, data);

    if (!scenario) return res.status(404).send({ error: 'Scenario not found' });

    res.send({ ...scenario, entries: JSON.parse(scenario.entries) });
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

scenarios.post('/', async (req, res) => {
  const scenario: Scenario = req.body as Scenario;
  const { name, description, active, entries } = scenario;

  try {
    // Entries are stored as string in database
    const entriesString = JSON.stringify(entries);
    const createdScenario = await scenariosRepository.createScenario(
      name,
      description,
      active,
      entriesString,
    );
    res.send(createdScenario);
  } catch (error) {
    res.status(500).send({ error: 'Error' });
  }
});

export { scenarios };
