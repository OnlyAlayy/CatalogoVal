import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useAuthStore = create(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,

      login: async (username, password) => {
        try {
          const { data } = await api.post('/auth/login', { username, password });
          const { admin, token } = data.data;
          
          localStorage.setItem('val_admin_token', token);
          set({ admin, token, isAuthenticated: true });
          
          return { success: true };
        } catch (error) {
          return { 
            success: false, 
            message: error.response?.data?.message || 'Error al iniciar sesión' 
          };
        }
      },

      logout: () => {
        localStorage.removeItem('val_admin_token');
        set({ admin: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage', // Guardado en localStorage para persistencia
      partialize: (state) => ({ admin: state.admin, isAuthenticated: state.isAuthenticated, token: state.token }),
    }
  )
);
