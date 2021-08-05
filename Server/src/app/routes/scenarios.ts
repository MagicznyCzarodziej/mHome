import { database } from 'database/database';
import Express from 'express';
import { validateAndParseId } from 'app/middlewares/validateId';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const scenarios = await database.scenario.findMany({
      // Skip entries
      select: {
        id: true,
        name: true,
        description: true,
        active: true,
      },
    });

    res.send(scenarios);
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

router.get('/:id', validateAndParseId, async (req, res) => {
  try {
    const { id } = res.locals;

    const scenario = await database.scenario.findFirst({
      where: {
        id,
      },
    });

    if (!scenario) return res.status(404).send({ error: 'Scenario not found' });

    res.send({
      ...scenario,
      entries: JSON.parse(scenario.entries),
    });
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

router.delete('/:id', validateAndParseId, async (req, res) => {
  try {
    const { id } = res.locals;

    const scenario = await database.scenario.delete({
      where: {
        id,
      },
    });

    if (!scenario) return res.status(404).send({ error: 'Scenario not found' });

    res.sendStatus(204);
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

router.patch('/:id', validateAndParseId, async (req, res) => {
  try {
    const { id } = res.locals;
    const { entries } = req.body;
    const data = {
      ...req.body,
      ...(entries && { entries: JSON.stringify(entries) }),
    };
    const scenario = await database.scenario.update({
      where: {
        id,
      },
      data,
    });

    if (!scenario) return res.status(404).send({ error: 'Scenario not found' });

    res.send({ ...scenario, entries: JSON.parse(scenario.entries) });
  } catch (error) {
    return res.status(500).send({ error: 'Error' });
  }
});

router.post('/', async (req, res) => {
  const scenario = req.body;
  const { name, description, active, entries } = scenario;

  try {
    // Entries are stored as string in database
    const entriesString = JSON.stringify(entries);
    const createdScenario = await database.scenario.create({
      data: {
        name,
        description,
        active,
        entries: entriesString,
      },
    });
    res.send(createdScenario);
  } catch (error) {
    res.status(500).send({ error: 'Error' });
  }
});

export { router as scenarios };
