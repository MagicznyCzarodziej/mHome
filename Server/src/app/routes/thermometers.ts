import { database } from 'database/database';
import Express from 'express';
import moment from 'moment';
import { queryExists } from './helpers';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const thermometer = await database.thermometer.findMany();
    res.send(thermometer);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const showTemperatures = queryExists('temperatures', req.query);
  const { from, to } = req.query;

  const include = showTemperatures
    ? {
        temperatures: {
          where: {
            timestamp: {
              gte: moment(from?.toString()).startOf('day').toDate(),
            },
          },
        },
      }
    : null;

  try {
    const thermometer = await database.thermometer.findUnique({
      where: {
        id,
      },
      include,
    });
    res.send(thermometer);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

router.get('/:id/temperatures', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const temperatures = await database.temperature.findMany({
      where: {
        thermometerId: id,
      },
      select: {
        id: true,
        value: true,
        timestamp: true,
      },
    });
    res.send(temperatures);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as thermometers };
