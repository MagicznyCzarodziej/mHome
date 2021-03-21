export interface Reed {
  id: number;
  name: string;
  description: string;
  state: ReedState;
  groupId: string;
  updatedAt: string;
}

export type ReedState = 'OPEN' | 'CLOSED';
