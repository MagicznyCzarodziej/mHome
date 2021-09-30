import { database } from 'database/database';
import Express from 'express';

import { validateAndParseId } from 'app/middlewares/validateId';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const blinds = await database.blinds.findMany();
    res.send(blinds);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', validateAndParseId, async (req, res) => {
  const { id } = res.locals;

  try {
    const blind = await database.blinds.findUnique({
      where: {
        id,
      },
    });
    res.send(blind);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as blinds };
