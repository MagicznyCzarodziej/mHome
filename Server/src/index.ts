import App from 'app/app';
import Container from 'typedi';
import { SerialCommunicator } from 'app/SerialCommunicator/SerialCommunicator';
import { StandardLogger } from 'app/utils/Logger';

// TODO: NPM Scripts to run dev/production
const serialPath = process.env.SERIAL_PATH;

const logger = new StandardLogger('mHome');
logger.info(
  `Starting | ${new Date().toLocaleString().replace('T', ' ')} local time`
);

const serialCommunicator = new SerialCommunicator(
  new StandardLogger('SerialCommunicator'),
  serialPath || 'COM5',
  9600
);
// Wait for serial port to open before running app
serialCommunicator
  .init()
  .then(() => {
    Container.set(SerialCommunicator, serialCommunicator);
    Container.set(App, new App(3000));
  })
  .catch((error) => {
    // Error opening serial port
    logger.info(
      `Exiting | ${new Date().toLocaleString().replace('T', ' ')} local time`
    );
    process.exit(0);
  });
