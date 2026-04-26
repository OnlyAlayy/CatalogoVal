import { useQuery } from '@tanstack/react-query';
import { productsService } from '../services/products.service';

export const useProducts = (params = {}) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getProducts(params),
  });
};

export const useProduct = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productsService.getProductBySlug(slug),
    enabled: !!slug,
  });
};
