export const SocketMessage = {
  toServer: {
    /** Client requested light state change */
    LIGHT_SET: 'lights/set',
    /** Client requested change of state of all lights in group */
    GROUP_LIGHTS_SET: 'group/lights/set',
  },
  toClient: {
    /** Notify client that light state has changed */
    LIGHT_STATE: 'lights/state',
    /** Notify client that new temperature has beed measured */
    THERMOMETER_NEW_TEMPERATURE: 'thermometers/newTemperature',
  },
};
