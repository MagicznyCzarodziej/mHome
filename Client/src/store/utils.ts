import { createAction } from '@reduxjs/toolkit';

export const createSocketAction = <T>(type: string) =>
  createAction('socket', (payload: T) => {
    return {
      payload: {
        eventType: type,
        ...payload,
      },
    };
  });
