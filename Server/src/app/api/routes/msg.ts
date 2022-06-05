import { Router } from 'express';
import { Container } from 'typedi';
import { EventType } from 'app/EventBus/Events';
import { cleanSocketIpAddress } from 'app/utils/cleanSocketIpAddress';
import { SocketClient } from 'app/sockets/SocketClient';

const router = Router();

// Handle messages without client
router.get('/', (req, res) => {
  try {
    const { message, ...data } = req.query;
    if (typeof message !== 'string')
      throw new Error('INVALID REQUEST - MISSING MESSAGE PARAM');
    if (!(Object.values(EventType) as string[]).includes(message))
      throw new Error('INVALID REQUEST - INVALID MESSAGE TYPE');

    const clientIp = cleanSocketIpAddress(req.ip) || '';

    const socketIoClient = Container.get(SocketClient);
    socketIoClient.emitEvent(message, data);

    res.send({
      success: true,
      message,
      data,
    });
  } catch (error) {
    // TODO: Create file logger and logging levels and outputs so this is not logged to main log
    // this.logger.info(
    //   `Invalid message from /msg (received: ${req.originalUrl}) ${error}`,
    // );

    res.status(400).send({
      error: {
        message: error.message,
      },
    });
  }
});

export { router as msg };
