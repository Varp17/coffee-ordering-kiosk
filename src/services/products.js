import { api } from './api';

export const productService = {
  getAll: async () => {
    return api.get('/products');
  },

  getById: async (id) => {
    return api.get(`/products/${id}`);
  },
};
