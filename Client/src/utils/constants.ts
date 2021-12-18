import { ScenarioActionType, ScenarioConditionType } from 'types/Scenario';

type ScenarioFields = 'elementId' | 'groupId' | 'value';

export const ScenarioConditionSelect: {
  [key in ScenarioConditionType]: {
    label: string;
    fields: ScenarioFields[];
  };
} = {
  REED: { label: 'Kontaktron', fields: ['elementId', 'value'] },
  TEMPERATURE_ABOVE: { label: 'Temperatura >', fields: ['elementId', 'value'] },
  TEMPERATURE_BELOW: { label: 'Temperatura <', fields: ['elementId', 'value'] },
  CRON: { label: 'CRON', fields: ['value'] },
  TIME: { label: 'Czas', fields: ['value'] },
  TIME_BEFORE: { label: 'Czas <', fields: ['value'] },
  TIME_AFTER: { label: 'Czas >', fields: ['value'] },
  LIGHT_STATE: { label: 'Światło', fields: ['elementId', 'value'] },
  BLIND_ABOVE: { label: 'Otwarcie rolety >', fields: ['elementId', 'value'] },
  BLIND_BELOW: { label: 'Otwarcie rolety <', fields: ['elementId', 'value'] },
};

export const ScenarioActionSelect: {
  [key in ScenarioActionType]: {
    label: string;
    fields: ScenarioFields[];
  };
} = {
  SET_LIGHT: {
    label: 'Ustaw światło',
    fields: ['elementId', 'value'],
  },
  SET_GROUP_LIGHTS: {
    label: 'Ustaw światła w grupie',
    fields: ['groupId', 'value'],
  },
  SET_ALL_LIGHTS: {
    label: 'Ustaw wszystkie światła',
    fields: ['value'],
  },
  SET_BLIND: {
    label: 'Ustaw roletę',
    fields: ['elementId', 'value'],
  },
  SET_GROUP_BLINDS: {
    label: 'Ustaw rolety w grupie',
    fields: ['groupId', 'value'],
  },
  SET_ALL_BLINDS: {
    label: 'Ustaw wszystkie rolety',
    fields: ['value'],
  },
};
