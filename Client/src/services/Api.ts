import axios from 'axios';

import { API_IP } from 'utils/constants';

export const Api = axios.create({
  baseURL: API_IP,
});
