import App from './app';
import Container from 'typedi';
import DeviceMock from './mocks/DeviceMock';
import { RPI } from './device';

// TODO: NPM Scripts to run dev/production
const serialPath = process.env.SERIAL_PATH;

// TODO: Clean this, perhaps remove the whole "Device" concept, handle only RPI and use tests
switch (process.env.SERIAL_SYSTEM) {
  case 'mock': Container.set('Device', new DeviceMock()); break;
  case 'windows': Container.set('Device', new RPI(serialPath || 'COM5', 9600)); break;
  default: Container.set('Device', new RPI(serialPath || '/dev/serial0', 9600)); break;
}

Container.set(App, new App(3000));
