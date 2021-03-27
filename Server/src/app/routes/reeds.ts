import { database } from 'database/database';
import Express from 'express';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const reeds = await database.reed.findMany();
    res.send(reeds);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const reeds = await database.reed.findUnique({
      where: {
        id,
      },
    });
    res.send(reeds);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

router.get('/:id/history', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const history = await database.reedHistory.findMany({
      where: {
        reedId: id,
      },
      select: {
        id: true,
        state: true,
        timestamp: true,
      },
    });
    res.send(history);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as reeds };
