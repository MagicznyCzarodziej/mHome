import { JsonController, Param, Get } from 'routing-controllers';
import { Container } from 'typedi';
import { Device, ItemId, SwitchState } from '../../utils';

@JsonController('/lights')
export class LightController {
  @Get('/:id/set/:state')
  setLightState(@Param('id') _id: string, @Param('state') _state: string) {
    const device: Device = Container.get('Device');
    const id = ItemId.fromString(_id);
    const state = SwitchState.fromString(_state);

    try {
      device.updateLight(id, state);
    } catch (error) {
      return { error: error.message };
    }
    return { success: true };
  }
}