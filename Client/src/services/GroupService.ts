import { Api } from './Api';

const ENDPOINT = '/groups';

const getAllGroups = async () => await Api.get(ENDPOINT);

const getAllGroupElements = async (groupId: string) =>
  await Api.get(`${ENDPOINT}/groups/${groupId}/elements`);

const setAllLights = async (groupId: string, state: 'ON' | 'OFF') =>
  await Api.get(
    `/msg?message=group/lights/set&groupId=${groupId}&state=${state}`
  );

export const GroupService = {
  getAllGroups,
  getAllGroupElements,
  setAllLights,
};
