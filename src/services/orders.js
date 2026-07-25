import { api } from './api';

export const orderService = {
  create: async (orderData) => {
    return api.post('/orders', orderData);
  },

  verifyPayment: async (paymentData) => {
    return api.post('/orders/verify', paymentData);
  },

  getById: async (id) => {
    return api.get(`/orders/${id}`);
  },
};
