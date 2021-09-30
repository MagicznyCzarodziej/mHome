import { Api } from './Api';

const ENDPOINT = '/security';

const getHistory = async (cursor: number, size: number) =>
  await Api().get(`${ENDPOINT}/history?cursor=${cursor}&size=${size}`);

const getConnectionsCount = async () =>
  await Api().get(`${ENDPOINT}/connections`);

export const SecurityService = {
  getHistory,
  getConnectionsCount,
};
