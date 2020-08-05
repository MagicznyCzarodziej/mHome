import App from './app';
import Container from 'typedi';
import SerialCommunicator from './SerialCommunicator';
import { Logger } from './utils';

// TODO: NPM Scripts to run dev/production
const serialPath = process.env.SERIAL_PATH;

Container.set(SerialCommunicator, new SerialCommunicator(
  new Logger('SerialCommunicator'),
  serialPath || 'COM5',
  9600
));

Container.set(App, new App(3000));
