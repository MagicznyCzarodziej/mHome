export class ItemId {
  static readonly INDEX_LENGTH = 3;

  public index: number;
  public type: string;

  constructor(type: string, index: number) {
    this.type = type;
    this.index = index;
  }

  public static fromString(id: string): ItemId {
    if (!id) throw new Error('No id string');
    const idRegex = new RegExp('^[A-Z]+_\\d{' + this.INDEX_LENGTH +'}$');
    
    if (!id.match(idRegex)) throw new Error('Invalid id string');

    const idParts = id.split('_');
    const type = idParts[0];
    const index = Number(idParts[1]);
    
    return new ItemId(type, index);
  }

  public toString(): string {
    const indexString = this.index
      .toString()
      .padStart(ItemId.INDEX_LENGTH, '0'); // Add leading zeros
    return `${this.type}_${indexString}`;
  }
}

export class SwitchState {
  constructor (private isOn: boolean) { }

  public static fromString(state: string): SwitchState {
    if (!state) throw new Error('No state string');
    
    if (state.toUpperCase() === 'ON' || Number(state) === 1) return new SwitchState(true);
    return new SwitchState(false);
  }

  public toInt(): number {
    return this.isOn ? 1 : 0;
  }
}

// Logger

export interface Logger {
  info(message: string): void;
  error(message: string): void;
}

export class Logger implements Logger {
  constructor(private author: string) { }

  info(message: string): void {
    console.log(`[INFO] ${this.author}: ${message}`);
  }

  error(message: string): void {
    console.log(`[ERROR] ${this.author}: ${message}`);
  }
}

export interface MessageHandler {
  execute(data: any): void;
}

export enum SocketEvent {
  /** [to SERVER] Set light state */
  LIGHTS_SET = 'lights/set',
  /** [to SERVER] Request light state */
  LIGHTS_REQUEST = 'lights/request',
  /** [to CLIENT] Notify about updated light(s) */
  LIGHTS_UPDATE = 'lights/update',
  /** [to SERVER] Request thermometer temperature */
  THERMOMETER_REQUEST = 'thermometer/request',
  /** [to CLIENT] Notify about thermometer temperature */
  THERMOMETER_UPDATE = 'thermometer/update',
}