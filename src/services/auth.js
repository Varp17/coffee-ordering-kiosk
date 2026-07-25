import { api } from './api';
import { unwrapObject } from '../utils/apiResponse';

const getAuthPayload = (res) => unwrapObject(res, {});
const getAccessToken = (res) => {
  const payload = getAuthPayload(res);
  return payload.accessToken || payload.token || res.accessToken || res.token;
};
const getRefreshToken = (res) => {
  const payload = getAuthPayload(res);
  return payload.refreshToken || res.refreshToken;
};

export const authService = {
  sendOtp: async (payload) => {
    const body = typeof payload === 'string' ? { mobile: payload } : payload;
    return api.post('/auth/send-otp', body);
  },

  verifyOtp: async (mobile, otp, details = {}) => {
    const res = await api.post('/auth/verify-otp', { mobile, otp, ...details });
    const token = getAccessToken(res);
    const refreshToken = getRefreshToken(res);
    if (token) api.setToken(token);
    if (refreshToken) localStorage.setItem('dc_refresh_token', refreshToken);
    return res;
  },

  refreshToken: async () => {
    const refreshToken = localStorage.getItem('dc_refresh_token');
    if (!refreshToken) throw new Error('No refresh token');
    const res = await api.post('/auth/refresh-token', { refreshToken });
    const token = getAccessToken(res);
    if (token) api.setToken(token);
    return res;
  },

  getMe: async () => {
    return api.get('/auth/me');
  },

  updateProfile: async (data) => {
    return api.patch('/auth/profile', data);
  },

  logout: async () => {
    const refreshToken = localStorage.getItem('dc_refresh_token');
    try {
      if (refreshToken) {
        await api.post('/auth/logout', { refreshToken });
      }
    } catch { /* ignore logout errors */ }
    api.setToken(null);
  },
};
