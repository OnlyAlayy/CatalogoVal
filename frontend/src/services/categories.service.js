import api from './api';

export const categoriesService = {
  getCategories: async () => {
    const { data } = await api.get('/categories');
    return data.data;
  },
  
  getCategoryBySlug: async (slug) => {
    const { data } = await api.get(`/categories/${slug}`);
    return data.data;
  }
};
