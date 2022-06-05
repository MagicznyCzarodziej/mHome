import { Router } from 'express';
import { Container } from 'typedi';
import { LightsRepository } from 'app/repositories/LightsRepository';

const lights = Router();
const lightsRepository = Container.get(LightsRepository);

lights.get('/', async (req, res) => {
  try {
    const lights = await lightsRepository.getAllLights();
    res.send(lights);
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

lights.get('/:id', async (req, res) => {
  const id = Number.parseInt(req.params.id);

  const light = await lightsRepository.getLight(id);
  res.send({
    light,
  });
});

export { lights };
