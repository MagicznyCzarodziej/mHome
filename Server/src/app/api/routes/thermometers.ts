import Express from 'express';
import { queryExists } from 'app/api/helpers';
import { ThermometersRepository } from 'app/repositories/ThermometersRepository';
import { Container } from 'typedi';

const router = Express.Router();
const thermometersRepository = Container.get(ThermometersRepository);

router.get('/', async (req, res) => {
  try {
    const thermometers = await thermometersRepository.getAllThermometers();
    res.send(thermometers);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);
  const showTemperatures = queryExists('temperatures', req.query);
  const { from, to } = req.query;

  try {
    const thermometer = await thermometersRepository.getThermometer(
      id,
      showTemperatures,
      from as string,
      to as string,
    );
    res.send(thermometer);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

router.get('/:id/temperatures', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  try {
    const temperatures = await thermometersRepository.getTemperatures(id);
    res.send(temperatures);
  } catch (error) {
    return res.send({ error: 'Invalid ID' });
  }
});

export { router as thermometers };
