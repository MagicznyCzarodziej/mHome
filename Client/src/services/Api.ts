import axios from 'axios';

export const getApiIp = () => localStorage.getItem('MHOME_API_IP') || '';

export const Api = () =>
  axios.create({
    baseURL: getApiIp(),
  });
