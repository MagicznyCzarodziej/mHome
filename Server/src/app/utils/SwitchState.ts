import { OnOff } from 'app/interfaces/OnOff';

export class SwitchState {
  constructor(private state: OnOff) {}

  static parse(state: string | number) {
    if (state === undefined) throw new Error('No state string');

    if (typeof state === 'number') {
      if (state === 1) return new SwitchState('ON');
    } else if (state.toUpperCase() === 'ON') return new SwitchState('ON');
    return new SwitchState('OFF');
  }

  public toInt(): 0 | 1 {
    return this.state === 'ON' ? 1 : 0;
  }
  public toString(): OnOff {
    return this.state;
  }
}
