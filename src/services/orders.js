import { api } from './api';

export const orderService = {
  create: async (orderData) => {
    return api.post('/orders', orderData);
  },

  getById: async (id) => {
    return api.get(`/orders/${id}`);
  },
};
