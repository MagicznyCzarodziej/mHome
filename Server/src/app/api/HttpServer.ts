import Express from 'express';
import { createServer, Server } from 'http';

export const startServer = (port: number, expressApp: Express.Application) => {
  const httpServer = createServer(expressApp);
  return new Promise<Server>((resolve, reject) => {
    httpServer.listen(port);

    httpServer.on('error', (error: NodeJS.ErrnoException) => {
      if (error.code === 'EADDRINUSE') {
        reject(`Port ${port} is already in use`);
      } else {
        reject(error);
      }
    });
    httpServer.on('listening', () => {
      resolve(httpServer);
    });
  });
};
