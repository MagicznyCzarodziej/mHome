export enum BlindStatus {
  IDLE = 'IDLE',
  MOVING_UP = 'MOVING_UP',
  MOVING_DOWN = 'MOVING_DOWN',
}

export interface Blind {
  id: number;
  name: string;
  description: string;
  status: BlindStatus;
  /** 0 - closed, 100 - open */
  position: number;
  groupId: string;
  updatedAt: string;
}
