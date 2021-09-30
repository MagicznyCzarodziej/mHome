import Express from 'express';
import { database } from 'database/database';
import { Container } from 'typedi/Container';
import { Server as SocketServer } from 'socket.io';
import { cleanSocketIpAddress } from 'app/utils/cleanSocketIpAddress';

const router = Express.Router();

router.get('/history', async (req, res) => {
  const cursor = Number.parseInt(req.query.cursor as string);
  const size = Number.parseInt(req.query.size as string);

  if (isNaN(cursor))
    return res.status(401).send({
      error: 'Invalid cursor. Try /history?cursor=0&size=20',
    });

  if (isNaN(size))
    return res.status(401).send({
      error: 'Invalid page size. Try /history?cursor=0&size=20',
    });

  try {
    const history = (
      await database.history.findMany({
        skip: cursor || 0,
        take: size || 20,
        orderBy: {
          timestamp: 'desc',
        },
      })
    ).map((entry) => ({ ...entry, payload: JSON.parse(entry.payload) }));

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
    const io = Container.get(SocketServer);
    const sockets = await io.of('/').sockets;
    const ipAddresses = [...sockets.values()].map((socket) =>
      cleanSocketIpAddress(socket.handshake.address),
    );

    res.send({ ipAddresses, connectionsCount: sockets.size });
  } catch (error) {
    return res.send({ error: 'Error' });
  }
});

export { router as security };
