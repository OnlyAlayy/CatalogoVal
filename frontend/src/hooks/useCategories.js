import { useQuery } from '@tanstack/react-query';
import { categoriesService } from '../services/categories.service';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoriesService.getCategories(),
  });
};

export const useCategory = (slug) => {
  return useQuery({
    queryKey: ['category', slug],
    queryFn: () => categoriesService.getCategoryBySlug(slug),
    enabled: !!slug,
  });
};
