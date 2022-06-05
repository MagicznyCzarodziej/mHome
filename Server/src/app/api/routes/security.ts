import { Router } from 'express';
import { Container } from 'typedi';
import { SecurityRepository } from 'app/repositories/SecurityRepository';
import { SocketThing } from './../../sockets/Socket';

const router = Router();
const securityRepository = Container.get(SecurityRepository);

router.get('/history', async (req, res) => {
  const cursor = Number.parseInt(req.query.cursor as string);
  const size = Number.parseInt(req.query.size as string);
  const eventType = req.query.eventType as string;
  const timeFrom = new Date(Number.parseInt(req.query.from as string));
  const timeTo = new Date(Number.parseInt(req.query.to as string));

  const config = {
    eventType,
    timeFrom,
    timeTo,
  };

  if (isNaN(cursor))
    return res.status(401).send({
      error: 'Invalid cursor. Try /history?cursor=0&size=20',
    });

  if (isNaN(size))
    return res.status(401).send({
      error: 'Invalid page size. Try /history?cursor=0&size=20',
    });

  try {
    const history = await securityRepository.getHistory(
      cursor,
      size,
      true,
      config,
    );
    res.send({
      data: history,
      nextCursor: cursor + size,
    });
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

router.get('/connections', async (req, res) => {
  try {
    const socketThing = Container.get(SocketThing);
    const { sockets, ipAddresses } = await socketThing.getConnections();

    res.send({ ipAddresses, connectionsCount: sockets.size });
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

export { router as security };
