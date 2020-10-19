import { SerialMessage } from "app/SerialCommunicator/SerialMessage";

export interface SerialCommunicatorObserver {
  handleSerialMessage(message: SerialMessage): void;
}