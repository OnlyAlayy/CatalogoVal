import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { Plus, Edit2, Trash2, GripVertical } from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import { IconPicker, DynamicIcon } from '../../components/ui/IconPicker';

const categorySchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio').max(50, 'Máximo 50 caracteres'),
  emoji: z.string().optional(),
  description: z.string().optional(),
  order: z.number().or(z.string().transform(val => Number(val) || 0)).optional(),
});

const SortableRow = ({ cat, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: cat._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
  };

  return (
    <tr 
      ref={setNodeRef} 
      style={style} 
      className={`hover:bg-gray-50/50 ${isDragging ? 'bg-white shadow-lg opacity-80' : ''}`}
    >
      <td className="p-4 w-10 text-gray-400">
        <button {...attributes} {...listeners} className="cursor-grab hover:text-brand-primary">
          <GripVertical size={20} />
        </button>
      </td>
      <td className="p-4 font-medium text-brand-text flex items-center gap-3">
        {cat.emoji && cat.emoji.length > 2 ? (
          <DynamicIcon name={cat.emoji} className="text-brand-primary" />
        ) : (
          <span className="text-xl">{cat.emoji}</span>
        )}
        {cat.name}
      </td>
      <td className="p-4 text-gray-500 text-sm">{cat.slug}</td>
      <td className="p-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button 
            onClick={() => onEdit(cat)}
            className="p-2 text-gray-400 hover:text-brand-primary transition-colors"
            title="Editar"
          >
            <Edit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(cat._id)}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            title="Eliminar"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export const CategoriesAdmin = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [localCategories, setLocalCategories] = useState([]);
  const queryClient = useQueryClient();

  // Queries
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    }
  });

  // Sync local state for drag and drop
  useEffect(() => {
    if (categories) setLocalCategories(categories);
  }, [categories]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (newCategory) => api.post('/categories', newCategory),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría creada');
      closeModal();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Error al crear')
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/categories/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría actualizada');
      closeModal();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'Error al actualizar')
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success('Categoría eliminada');
    },
    onError: () => toast.error('Error al eliminar')
  });

  const reorderMutation = useMutation({
    mutationFn: (items) => api.patch('/categories/reorder', items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      // admin-categories is local now, but we invalidate just in case
    },
    onError: () => {
      toast.error('Error al reordenar');
      queryClient.invalidateQueries({ queryKey: ['admin-categories'] });
    }
  });

  // DnD Sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setLocalCategories((items) => {
        const oldIndex = items.findIndex(i => i._id === active.id);
        const newIndex = items.findIndex(i => i._id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);
        
        // Mutate backend
        const payload = newOrder.map((cat, idx) => ({ id: cat._id, order: idx + 1 }));
        reorderMutation.mutate(payload);
        
        return newOrder;
      });
    }
  };

  // Form handling
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    resolver: zodResolver(categorySchema)
  });

  const openModal = (category = null) => {
    setEditingCategory(category);
    if (category) {
      reset({
        name: category.name,
        emoji: category.emoji || '',
        description: category.description || '',
        order: category.order || 0
      });
    } else {
      reset({ name: '', emoji: '', description: '', order: 0 });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    reset();
  };

  const onSubmit = (data) => {
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory._id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría? Los productos asociados quedarán huérfanos.')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div className="p-8 flex justify-center"><Spinner /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-serif font-bold text-brand-text">Categorías</h2>
        <Button onClick={() => openModal()} className="flex items-center gap-2">
          <Plus size={18} /> Nueva Categoría
        </Button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-sm text-gray-500 uppercase tracking-wider">
                <th className="p-4 font-medium w-10"></th>
                <th className="p-4 font-medium">Categoría</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <tbody className="divide-y divide-gray-200">
                <SortableContext items={localCategories.map(c => c._id)} strategy={verticalListSortingStrategy}>
                  {localCategories.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-8 text-center text-gray-500">
                        No hay categorías creadas.
                      </td>
                    </tr>
                  ) : (
                    localCategories.map((cat) => (
                      <SortableRow 
                        key={cat._id} 
                        cat={cat} 
                        onEdit={openModal} 
                        onDelete={handleDelete} 
                      />
                    ))
                  )}
                </SortableContext>
              </tbody>
            </DndContext>
          </table>
        </div>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={editingCategory ? "Editar Categoría" : "Nueva Categoría"}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 space-y-1">
              <label className="text-sm font-medium text-brand-text">Ícono</label>
              <Controller
                name="emoji"
                control={control}
                render={({ field }) => (
                  <IconPicker value={field.value} onChange={field.onChange} />
                )}
              />
            </div>
            <div className="col-span-3 space-y-1">
              <label className="text-sm font-medium text-brand-text">Nombre</label>
              <input 
                {...register('name')} 
                className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none" 
                placeholder="Tortas Clásicas" 
              />
              {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-brand-text">Descripción (Opcional)</label>
            <textarea 
              {...register('description')} 
              className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none min-h-[80px]" 
              placeholder="Breve descripción de la categoría..." 
            />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={closeModal}>Cancelar</Button>
            <Button 
              type="submit" 
              isLoading={createMutation.isPending || updateMutation.isPending}
            >
              Guardar
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
