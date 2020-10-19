import App from 'app/app';
import Container from 'typedi';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import { StandardLogger } from 'app/utils/Logger';

// TODO: NPM Scripts to run dev/production
const serialPath = process.env.SERIAL_PATH;

Container.set(
  SerialCommunicator,
  new SerialCommunicator(
    new StandardLogger('SerialCommunicator'),
    serialPath || 'COM5',
    9600
  )
);

Container.set(App, new App(3000));
