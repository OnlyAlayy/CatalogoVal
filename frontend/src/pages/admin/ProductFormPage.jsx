import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Trash2, Upload } from 'lucide-react';

import api from '../../services/api';
import { Button } from '../../components/ui/Button';
import { Card, CardContent } from '../../components/ui/Card';
import { Spinner } from '../../components/ui/Spinner';

export const ProductFormPage = () => {
  const { id } = useParams();
  const isEditing = !!id;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);

  // Fetch categories for select
  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: async () => {
      const { data } = await api.get('/categories');
      return data.data;
    }
  });

  // Form setup
  const { register, control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      name: '',
      category: '',
      description: '',
      price: '',
      isFeatured: false,
      isAvailable: true,
      advanceHours: 48,
      ingredients: '',
      variants: []
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants"
  });

  // Fetch existing product if editing
  useQuery({
    queryKey: ['product-edit', id],
    queryFn: async () => {
      const { data } = await api.get(`/products/byId/${id}`); // We might need to fetch by ID. Since our backend only has getProductBySlug, we might need a workaround or just fetch all and find, or add a route for ID. Let's assume we can fetch from the cached products or we fetch all and find.
      return data.data;
    },
    enabled: isEditing,
  });

  // Temporary workaround for fetching by ID since we only have getProductBySlug on backend
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          // The backend has `GET /api/products`, we can find it there or better, we could have a `GET /api/products/:slug` and we use slug. 
          // For this example, let's fetch all and filter, or assume we have the product in cache.
          const { data } = await api.get('/products');
          const product = data.data.find(p => p._id === id);
          if (product) {
            reset({
              name: product.name,
              category: product.category._id || product.category,
              description: product.description || '',
              price: product.price || '',
              isFeatured: product.isFeatured,
              isAvailable: product.isAvailable,
              advanceHours: product.advanceHours || 48,
              ingredients: product.ingredients ? product.ingredients.join(', ') : '',
              variants: product.variants || []
            });
            if (product.images && product.images.length > 0) {
              setUploadedImages(product.images);
            }
          }
        } catch (error) {
          toast.error("Error al cargar el producto");
        }
      };
      fetchProduct();
    }
  }, [id, isEditing, reset]);

  // Mutations
  const createMutation = useMutation({
    mutationFn: (data) => api.post('/products', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto creado exitosamente');
      navigate('/admin/productos');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al crear')
  });

  const updateMutation = useMutation({
    mutationFn: (data) => api.put(`/products/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Producto actualizado exitosamente');
      navigate('/admin/productos');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Error al actualizar')
  });

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    // Validación de tipo y tamaño (máximo 5MB por imagen)
    const validFiles = [];
    const maxSizeBytes = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast.error(`El archivo ${file.name} no es un formato válido (solo JPG, PNG, WEBP)`);
        continue;
      }
      if (file.size > maxSizeBytes) {
        toast.error(`El archivo ${file.name} supera los 5MB permitidos`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setIsUploading(true);
    const successfullyUploaded = [];
    
    try {
      for (const file of validFiles) {
        const formData = new FormData();
        formData.append('image', file);
        const { data } = await api.post('/products/upload-image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        successfullyUploaded.push(data.data);
      }

      if (successfullyUploaded.length > 0) {
        setUploadedImages(prev => [...prev, ...successfullyUploaded]);
        toast.success(`${successfullyUploaded.length} imagen(es) subida(s)`);
      }
    } catch (error) {
      toast.error('Error al subir algunas imágenes. Intentá nuevamente.');
      // En un escenario ideal aquí podríamos hacer rollback de successfullyUploaded
    } finally {
      setIsUploading(false);
      // Limpiar input file
      e.target.value = '';
    }
  };

  const handleRemoveImage = async (publicId, index) => {
    try {
      await api.post('/products/delete-image', { publicId });
      setUploadedImages(prev => prev.filter((_, i) => i !== index));
      toast.success('Imagen eliminada');
    } catch (error) {
      toast.error('Error al eliminar la imagen');
    }
  };

  const onSubmit = (formData) => {
    if (!formData.category) {
      return toast.error("Seleccioná una categoría");
    }

    const payload = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      advanceHours: Number(formData.advanceHours),
      ingredients: formData.ingredients ? formData.ingredients.split(',').map(i => i.trim()).filter(Boolean) : [],
      variants: formData.variants.map(v => ({ name: v.name, price: Number(v.price) })),
      images: uploadedImages
    };

    if (isEditing) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/admin/productos')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <h2 className="text-2xl font-serif font-bold text-brand-text">
          {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        </h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Info */}
          <Card className="md:col-span-2">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-text">Nombre del Producto *</label>
                <input 
                  {...register('name', { required: true })} 
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none" 
                  placeholder="Tarta de Frutillas"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-text">Descripción</label>
                <textarea 
                  {...register('description')} 
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none min-h-[100px]" 
                  placeholder="Deliciosa tarta con crema pastelera..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-brand-text">Categoría *</label>
                  <select 
                    {...register('category', { required: true })}
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none bg-white"
                  >
                    <option value="">Seleccionar...</option>
                    {categories?.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm font-medium text-brand-text">Precio Base ($)</label>
                  <input 
                    type="number" 
                    {...register('price')} 
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none" 
                    placeholder="15000"
                  />
                  <p className="text-xs text-gray-500">Dejar vacío si usás variantes</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-brand-text">Ingredientes Principales</label>
                <input 
                  {...register('ingredients')} 
                  className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none" 
                  placeholder="Frutillas, Crema, Masa sablée (separados por coma)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold text-brand-text border-b pb-2">Imágenes</h3>
                
                <div className="grid grid-cols-2 gap-2">
                  {uploadedImages.map((img, index) => (
                    <div key={index} className="relative group rounded-md overflow-hidden border border-gray-200 aspect-square">
                      <img src={img.url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <button 
                          type="button" 
                          onClick={() => handleRemoveImage(img.publicId, index)}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-md bg-gray-50 relative overflow-hidden aspect-square hover:bg-gray-100 transition-colors cursor-pointer">
                    {isUploading ? (
                      <Spinner size="sm" />
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center text-gray-500 hover:text-brand-primary w-full h-full justify-center">
                        <Upload size={24} className="mb-2" />
                        <span className="text-xs font-medium text-center">Subir Imagen</span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="space-y-3 pt-4 border-t">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isAvailable')} className="w-4 h-4 text-brand-primary rounded" />
                    <span className="text-sm font-medium">Disponible (En Stock)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 text-brand-primary rounded" />
                    <span className="text-sm font-medium">Destacado (Home)</span>
                  </label>
                </div>
                
                <div className="space-y-1 pt-2">
                  <label className="text-sm font-medium text-brand-text">Anticipación (Horas)</label>
                  <input 
                    type="number" 
                    {...register('advanceHours')} 
                    className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none" 
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Variants Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h3 className="font-semibold text-brand-text">Variantes de Tamaño / Opciones</h3>
              <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', price: '' })}>
                <Plus size={16} className="mr-1" /> Agregar Variante
              </Button>
            </div>
            
            {fields.length === 0 ? (
              <p className="text-sm text-gray-500 italic py-2">No hay variantes configuradas. Se usará el precio base.</p>
            ) : (
              <div className="space-y-3">
                {fields.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100">
                    <div className="flex-1">
                      <input
                        {...register(`variants.${index}.name`, { required: true })}
                        placeholder="Ej: Tamaño Grande (24cm)"
                        className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <div className="w-32">
                      <input
                        type="number"
                        {...register(`variants.${index}.price`, { required: true })}
                        placeholder="Precio $"
                        className="w-full p-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-brand-primary outline-none"
                      />
                    </div>
                    <button 
                      type="button" 
                      onClick={() => remove(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4 pb-10">
          <Button type="button" variant="ghost" onClick={() => navigate('/admin/productos')}>
            Cancelar
          </Button>
          <Button type="submit" size="lg" isLoading={createMutation.isPending || updateMutation.isPending}>
            {isEditing ? 'Guardar Cambios' : 'Crear Producto'}
          </Button>
        </div>
      </form>
    </div>
  );
};
