import { Router } from 'express';
import { Container } from 'typedi';
import { BlindsRepository } from 'app/repositories/BlindsRepository';
import { validateAndParseId } from 'app/api/middlewares/validateId';

const router = Router();
const blindsRepository = Container.get(BlindsRepository);

router.get('/', async (req, res) => {
  try {
    const blinds = await blindsRepository.getAllBlinds();
    res.send(blinds);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', validateAndParseId, async (req, res) => {
  const { id } = res.locals;

  try {
    const blind = await blindsRepository.getBlind(id);
    res.send(blind);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as blinds };
