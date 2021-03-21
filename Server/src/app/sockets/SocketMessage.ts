export const SocketMessage = {
  toServer: {
    /** Client requested light state change */
    LIGHT_SET: 'lights/set',
    /** Client requested change of state of all lights in group */
    LIGHTS_SET_GROUP: 'lights/set/group',
    /** Client requested change of state of all lights */
    LIGHTS_SET_ALL: 'lights/set/all',
    /** Client requested change of blind position */
    BLIND_SET: 'blinds/set',
    /** Client requested change of position of all blinds in group */
    BLIND_SET_GROUP: 'blinds/set/group',
    /** Client requested change of position of all blinds */
    BLIND_SET_ALL: 'blinds/set/all',
  },
  toClient: {
    /** Notify client that light state has changed */
    LIGHT_STATE: 'lights/state',
    /** Notify client that new temperature has beed measured */
    THERMOMETER_NEW_TEMPERATURE: 'thermometers/newTemperature',
    /** Notify client that reed state has changed */
    REED_STATE: 'reeds/state',
    /** Notify client that blind position has changed */
    BLIND_POSITION_CHANGE: 'blinds/position',
    /** Notify client that blind state has changed (IDLE/MOVING) */
    BLIND_STATE_CHANGE: 'blinds/state',
  },
};
