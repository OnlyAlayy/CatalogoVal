import api from './api';

export const productsService = {
  getProducts: async (params = {}) => {
    const { data } = await api.get('/products', { params });
    return data.data; // Porque el backend usa sendSuccess(res, data)
  },
  
  getProductBySlug: async (slug) => {
    const { data } = await api.get(`/products/${slug}`);
    return data.data;
  }
};
