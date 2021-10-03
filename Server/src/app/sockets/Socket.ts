import { Server } from 'http';
import { Server as SocketServer, Socket } from 'socket.io';
import { EventBus } from '../EventBus/EventBus';
import { Logger } from 'app/utils/Logger';
import { Events, EventType } from 'app/EventBus/Events';
import { cleanSocketIpAddress } from 'app/utils/cleanSocketIpAddress';

export class SocketThing {
  private io: SocketServer;

  @Logger('SocketServer')
  private readonly logger: Logger;

  init(httpServer: Server) {
    this.io = new SocketServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    this.io.on('connection', (socket: Socket) => {
      this.logger.info(`Socket client connected ${socket.id}`);

      // IP of the client that sent /msg HTTP request to emit socket event
      const socketViaRESTClientIp = socket.handshake.query['ip'] as string;

      const clientIP =
        socketViaRESTClientIp ||
        cleanSocketIpAddress(socket.request.connection.remoteAddress);

      // If socket is from /msg HTTP
      const isLocalClient =
        socket.request.connection.localAddress === undefined;
      const ipString = isLocalClient ? `${clientIP} (via /msg)` : clientIP;

      socket.onAny((event, data) => {
        this.logger.info(
          `Received event: ${event} [${ipString}] ${JSON.stringify(data)}`,
        );
      });

      this.handleSocketEvents(socket);

      socket.on('disconnect', async () => {
        this.logger.info(
          `Socket client disconnected ${socket.id} (Connected: ${
            this.io.of('/').sockets.size
          })`,
        );
      });
    });

    this.subscribeToBusEvents();
  }

  handleSocketEvents(socket: Socket) {
    // Set light state
    socket.on(EventType.LIGHT_SET, (data) => {
      EventBus.publish<Events.LightSet>(EventType.LIGHT_SET, data);
    });

    // Set state of all lights in the group
    socket.on(EventType.LIGHTS_SET_GROUP, (data) => {
      EventBus.publish<Events.LightSetGroup>(EventType.LIGHTS_SET_GROUP, data);
    });

    // Set state of lights inside
    socket.on(EventType.LIGHTS_SET_INSIDE, async (data) => {
      EventBus.publish<Events.LightSetInside>(
        EventType.LIGHTS_SET_INSIDE,
        data,
      );
    });

    // Set state of all lights
    socket.on(EventType.LIGHTS_SET_ALL, async (data) => {
      EventBus.publish<Events.LightSetAll>(EventType.LIGHTS_SET_ALL, data);
    });

    // Set blind position
    socket.on(EventType.BLIND_SET, async (data) => {
      EventBus.publish<Events.BlindSet>(EventType.BLIND_SET, data);
    });
  }

  async getConnections() {
    const sockets = await this.io.of('/').sockets;
    const ipAddresses = [...sockets.values()].map((socket) =>
      cleanSocketIpAddress(socket.handshake.address),
    );
    return { sockets, ipAddresses };
  }

  subscribeToBusEvents() {
    EventBus.subscribe<Events.LightUpdate>(EventType.LIGHT_UPDATE, (event) => {
      this.io.emit(EventType.LIGHT_UPDATE, event.payload);
    });

    EventBus.subscribe<Events.NewTemperature>(
      EventType.THERMOMETER_NEW_TEMPERATURE,
      (event) => {
        console.log(event);

        const payload = event.payload;
        this.io.emit(EventType.THERMOMETER_NEW_TEMPERATURE, {
          thermometerId: payload.thermometerId,
          temperature: {
            value: payload.temperature,
            timestamp: event.timestamp,
          },
        });
      },
    );

    EventBus.subscribe<Events.ReedUpdate>(EventType.REED_UPDATE, (event) => {
      this.io.emit(EventType.REED_UPDATE, event.payload);
    });

    EventBus.subscribe<Events.BlindUpdate>(EventType.BLIND_UPDATE, (event) => {
      this.io.emit(EventType.BLIND_UPDATE, event.payload);
    });
  }
}
