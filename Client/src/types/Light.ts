import { OnOff } from 'types/OnOff';

export interface Light {
  id: number;
  name: string;
  description: string;
  state: OnOff;
  groupId: string;
  updatedAt: string;
}
