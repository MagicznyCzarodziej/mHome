import { database } from 'database/database';
import Express from 'express';
import moment from 'moment';
import { queryExists } from './helpers';

const router = Express.Router();

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const showTemperatures = queryExists('temperatures', req.query);
  const { from, to } = req.query;

  const include = showTemperatures
    ? {
        temperatures: {
          where: {
            datetime: {
              gte: moment(from?.toString()).startOf('day').toDate(),
            },
          },
        },
      }
    : null;

  try {
    const thermometer = await database.thermometer.findOne({
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

export { router as thermometer };
