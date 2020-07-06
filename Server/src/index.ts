import App from './app';
import Container from 'typedi';
import DeviceMock from './mocks/DeviceMock';
import { RPI } from './device';

// TODO: NPM Scripts to run dev/production
switch (process.env.SERIAL_SYSTEM) {
  case 'mock': Container.set('Device', new DeviceMock()); break;
  case 'windows': Container.set('Device', new RPI('COM5', 9600)); break;
  default: Container.set('Device', new RPI('/dev/serial0', 9600)); break;
}

Container.set(App, new App(3000));
