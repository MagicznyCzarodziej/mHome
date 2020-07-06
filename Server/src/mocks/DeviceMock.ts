import { Device, ItemId, SwitchState } from '../utils';

export default class DeviceMock implements Device {
  updateLight(id: ItemId, state: SwitchState): void {
    console.log("Updated mocked light: " + id + ' ' + state.toInt());
  }
}