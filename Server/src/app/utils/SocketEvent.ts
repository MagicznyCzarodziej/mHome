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
