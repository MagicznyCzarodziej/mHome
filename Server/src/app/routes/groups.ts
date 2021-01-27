import { database } from 'database/database';
import Express from 'express';

const router = Express.Router();

router.get('/', async (req, res) => {
  try {
    const groups = await database.group.findMany();
    res.send(groups);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await database.group.findUnique({
      where: {
        id: req.params.id,
      },
    });

    res.send(group);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id/elements', async (req, res) => {
  const groupId = req.params.id;

  try {
    const lights = await database.light.findMany({
      where: {
        groupId,
      },
    });
    const thermometers = await database.thermometer.findMany({
      where: {
        groupId,
      },
    });
    const reeds = await database.reed.findMany({
      where: {
        groupId,
      },
    });
    const blinds = await database.blinds.findMany({
      where: {
        groupId,
      },
    });
    res.send({
      lights,
      thermometers,
      reeds,
      blinds,
    });
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as groups };
