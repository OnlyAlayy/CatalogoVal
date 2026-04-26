import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Agregar producto al carrito
      addItem: (product, variant, quantity) => {
        set((state) => {
          // Crear un ID único para la combinación de producto + variante
          const variantLabel = variant ? (variant.name || variant.label) : 'default';
          const cartItemId = `${product._id}-${variantLabel}`;
          
          const existingItemIndex = state.items.findIndex(item => item.cartItemId === cartItemId);
          
          if (existingItemIndex >= 0) {
            // Si ya existe, actualizamos la cantidad
            const newItems = [...state.items];
            newItems[existingItemIndex].quantity += quantity;
            return { items: newItems };
          } else {
            // Si es nuevo, lo agregamos
            return {
              items: [
                ...state.items,
                {
                  cartItemId,
                  product: {
                    _id: product._id,
                    name: product.name,
                    images: product.images,
                    advanceHours: product.advanceHours,
                    price: product.price // Precio base si no hay variante
                  },
                  variant, // { label, price }
                  quantity
                }
              ]
            };
          }
        });
      },
      
      // Eliminar producto del carrito
      removeItem: (cartItemId) => {
        set((state) => ({
          items: state.items.filter(item => item.cartItemId !== cartItemId)
        }));
      },
      
      // Actualizar cantidad de un producto
      updateQuantity: (cartItemId, newQuantity) => {
        if (newQuantity < 1) return;
        set((state) => ({
          items: state.items.map(item => 
            item.cartItemId === cartItemId 
              ? { ...item, quantity: newQuantity } 
              : item
          )
        }));
      },
      
      // Limpiar carrito completo
      clearCart: () => set({ items: [] }),
      
      // Total de items en el carrito (sumando cantidades)
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
      
      // Total a pagar
      getTotalPrice: () => {
        return get().items.reduce((total, item) => {
          const itemPrice = item.variant ? item.variant.price : item.product.price;
          return total + (itemPrice * item.quantity);
        }, 0);
      },
      
      // Máxima anticipación requerida de todos los productos en el carrito
      getMaxAdvanceHours: () => {
        return get().items.reduce((max, item) => {
          return item.product.advanceHours > max ? item.product.advanceHours : max;
        }, 0);
      }
    }),
    {
      name: 'val-postress-cart', // clave en localStorage
    }
  )
);
