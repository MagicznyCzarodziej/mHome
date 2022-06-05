import socketIoClient from 'socket.io-client';

export class SocketClient {
  private client;

  constructor(address: string) {
    this.client = socketIoClient.io(address);
    this.client.on('connect', () => {});
  }

  emitEvent(eventName: string, data: any) {
    this.client.emit(eventName, data);
  }
}
