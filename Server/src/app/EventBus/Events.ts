export enum EventType {
  /** Requested light state change */
  LIGHT_SET = 'lights/set',
  /** Requested change of state of all lights in group */
  LIGHTS_SET_GROUP = 'lights/set/group',
  /** Requested change of state of all lights except OUTSIDE group */
  LIGHTS_SET_INSIDE = 'lights/set/inside',
  /** Requested change of state of all lights */
  LIGHTS_SET_ALL = 'lights/set/all',
  /** Requested change of blind position */
  BLIND_SET = 'blinds/set',
  /** Requested change of position of all blinds in group */
  BLIND_SET_GROUP = 'blinds/set/group',
  /** Requested change of position of all blinds */
  BLIND_SET_ALL = 'blinds/set/all',

  /** Light state has changed */
  LIGHT_UPDATE = 'lights/update',
  /** New temperature has beed measured */
  THERMOMETER_NEW_TEMPERATURE = 'thermometers/newTemperature',
  /** Reed state has changed */
  REED_UPDATE = 'reeds/update',
  /** Blind position or status has changed */
  BLIND_UPDATE = 'blinds/update',

  /** Scenarios list has been modified */
  SCENARIO_UPDATE = 'scenarios/update',
}

export interface MHomeEvent {
  type: EventType;
  payload: any;
  timestamp: Date;
}

export interface PublishMHomeEvent {
  type: EventType;
  payload: any;
}

export namespace Events {
  export interface LightSet extends MHomeEvent {
    type: EventType.LIGHT_SET;
    payload: {
      id: number;
      state: string;
    };
  }

  export interface LightSetGroup extends MHomeEvent {
    type: EventType.LIGHTS_SET_GROUP;
    payload: {
      id: number;
      state: string;
    };
  }

  export interface LightSetInside extends MHomeEvent {
    type: EventType.LIGHTS_SET_INSIDE;
    payload: {
      state: string;
    };
  }

  export interface LightSetAll extends MHomeEvent {
    type: EventType.LIGHTS_SET_ALL;
    payload: {
      state: string;
    };
  }

  export interface BlindSet extends MHomeEvent {
    type: EventType.BLIND_SET;
    payload: {
      id: number;
      state: string;
      position: number;
    };
  }

  export interface BlindSetGroup extends MHomeEvent {
    type: EventType.BLIND_SET_GROUP;
    payload: {
      id: number;
      state: string;
      position: number;
    };
  }

  export interface BlindSetAll extends MHomeEvent {
    type: EventType.BLIND_SET_ALL;
    payload: {
      state: string;
      position: number;
    };
  }

  export interface LightUpdate extends MHomeEvent {
    type: EventType.LIGHT_UPDATE;
    payload: {
      id: number;
      state: string;
    };
  }

  export interface NewTemperature extends MHomeEvent {
    type: EventType.THERMOMETER_NEW_TEMPERATURE;
    payload: {
      thermometerId: number;
      temperature: number;
    };
  }

  export interface ReedUpdate extends MHomeEvent {
    type: EventType.REED_UPDATE;
    payload: {
      id: number;
      state: string;
    };
  }

  export interface BlindUpdate extends MHomeEvent {
    type: EventType.BLIND_UPDATE;
    payload: {
      id: number;
      status: string;
      position: number;
    };
  }

  export interface ScenarioUpdate extends MHomeEvent {
    type: EventType.SCENARIO_UPDATE;
    payload: null;
  }
}
