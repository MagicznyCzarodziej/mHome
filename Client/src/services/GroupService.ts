import { Api } from './Api';

const ENDPOINT = '/groups';

const getAllGroups = async () => await Api.get(ENDPOINT);

const getAllGroupElements = async (groupId: string) =>
  await Api.get(`${ENDPOINT}/groups/${groupId}/elements`);

export const GroupService = {
  getAllGroups,
  getAllGroupElements,
};
