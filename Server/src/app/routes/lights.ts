import { database } from 'database/database';
import Express from 'express';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const light = await database.light.findMany();
    res.send(light);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const light = await database.light.findUnique({
      where: {
        id,
      },
    });
    res.send(light);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as lights };
