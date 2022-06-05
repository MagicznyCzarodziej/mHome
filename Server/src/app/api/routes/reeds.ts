import Express from 'express';
import { ReedsRepository } from 'app/repositories/ReedsRepository';
import { Container } from 'typedi';

const router = Express.Router();
const reedsRepository = Container.get(ReedsRepository);

router.get('/', async (req, res) => {
  try {
    const reeds = await reedsRepository.getAllReeds();
    res.send(reeds);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const reed = await reedsRepository.getReed(id);
    res.send(reed);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

router.get('/:id/history', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const history = await reedsRepository.getReedHistory(id);
    res.send(history);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as reeds };
