import { Api } from './Api';

const ENDPOINT = '/security';

const getHistory = async (
  cursor: number,
  size: number,
  config: { eventType: string; timeFrom: number; timeTo: number }
) => {
  let extraParams = '';
  extraParams += `&eventType=${config.eventType}`;
  extraParams += `&from=${config.timeFrom}`;
  extraParams += `&to=${config.timeTo}`;
  return await Api().get(
    `${ENDPOINT}/history?cursor=${cursor}&size=${size}${extraParams}`
  );
};

const getConnectionsCount = async () =>
  await Api().get(`${ENDPOINT}/connections`);

export const SecurityService = {
  getHistory,
  getConnectionsCount,
};
