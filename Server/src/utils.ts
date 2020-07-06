export class ItemId {
  static readonly INDEX_LENGTH = 3;

  public index: number;
  public type: string;

  constructor(type: string, index: number) {
    this.type = type;
    this.index = index;
  }

  public static fromString(id: string): ItemId {
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
    if (state.toUpperCase() === 'ON' || Number(state) === 1) return new SwitchState(true);
    return new SwitchState(false);
  }

  public toInt(): number {
    return this.isOn ? 1 : 0;
  }
}

// Device

export interface Device {
  updateLight(id: ItemId, state: SwitchState): void;
}

export interface DeviceItem {
  device: Device;
  id: ItemId;
  pin: number;
  update(state: string): object;
}

export enum Command {
  SET_LIGHT = 'L',
  END = 'E',
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