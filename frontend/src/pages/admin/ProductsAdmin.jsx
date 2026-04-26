import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Spinner } from '../../components/ui/Spinner';

export const ProductsAdmin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Queries
  const { data: products, isLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: async () => {
      const { data } = await api.get('/products'); // Fetch all products without filters
      return data.data;
    }
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto eliminado');
    },
    onError: () => toast.error('Error al eliminar')
  });

  const toggleAvailabilityMutation = useMutation({
    mutationFn: ({ id, isAvailable }) => api.patch(`/products/${id}/availability`, { isAvailable }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Disponibilidad actualizada');
    },
    onError: () => toast.error('Error al actualizar disponibilidad')
  });

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto de forma permanente?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleToggleAvailability = (id, currentStatus) => {
    toggleAvailabilityMutation.mutate({ id, isAvailable: !currentStatus });
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-brand-text">Productos</h2>
        <Link to="/admin/productos/nuevo">
          <Button className="flex items-center gap-2">
            <Plus size={18} /> Nuevo Producto
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium">Producto</th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Precio / Variantes</th>
                <th className="p-4 font-medium">Estado</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No hay productos creados.
                  </td>
                </tr>
              ) : (
                products?.map((prod) => (
                  <tr key={prod._id} className="hover:bg-gray-50/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden shrink-0">
                          {prod.images && prod.images.length > 0 ? (
                            <img src={prod.images[0].url} alt={prod.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-brand-text">{prod.name}</p>
                          <p className="text-xs text-gray-500 truncate max-w-[200px]">{prod.description}</p>
                          {prod.images && prod.images.length > 1 && (
                            <p className="text-xs text-gray-400 mt-1">{prod.images.length} imágenes</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600 text-sm">
                      {prod.category?.name || 'Sin Categoría'}
                    </td>
                    <td className="p-4">
                      {prod.variants && prod.variants.length > 0 ? (
                        <div className="text-sm">
                          <span className="text-gray-500">{prod.variants.length} variantes</span>
                        </div>
                      ) : (
                        <span className="font-medium text-brand-primary">${prod.price}</span>
                      )}
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleToggleAvailability(prod._id, prod.isAvailable)}
                        disabled={toggleAvailabilityMutation.isPending}
                        className="focus:outline-none"
                      >
                        {prod.isAvailable ? (
                          <Badge variant="primary" className="cursor-pointer hover:bg-brand-primary/80">Disponible</Badge>
                        ) : (
                          <Badge variant="destructive" className="cursor-pointer hover:bg-red-600">Agotado</Badge>
                        )}
                      </button>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleToggleAvailability(prod._id, prod.isAvailable)}
                          className="p-2 text-gray-400 hover:text-brand-text transition-colors"
                          title={prod.isAvailable ? "Marcar como agotado" : "Marcar como disponible"}
                        >
                          {prod.isAvailable ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                        <Link 
                          to={`/admin/productos/editar/${prod._id}`}
                          className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
                          title="Editar"
                        >
                          <Edit2 size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(prod._id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
