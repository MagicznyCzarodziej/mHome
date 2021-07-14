import { database } from 'database/database';
import Express from 'express';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const scenarios = await database.scenario.findMany();

    res.send(scenarios);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const scenario = {
      id: 1,
      name: 'Scenariusz 1',
      description: 'Opis 1',
      entries: [
        {
          id: 1,
          parentEntry: null,
          conditions: [
            {
              type: 'TEMPERATURE_ABOVE',
              id: 1,
              value: 25,
            },
            {
              type: 'REED',
              id: 3,
              value: 'CLOSED',
            },
          ],
          actions: [
            {
              id: 1,
              type: 'SET_LIGHT',
            },
            {
              id: 4,
              type: 'SET_LIGHT',
            },
          ],
        },
      ],
    };

    res.send(scenario);
  } catch (error) {
    return res.send({ error: 'Error' });
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
    console.log(error);
  }
});

export { router as scenarios };
