import { Routes, Route, Outlet } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar';
import { Footer } from '../components/layout/Footer';
import { Home } from '../pages/Home';
import { Catalog } from '../pages/Catalog';

// Admin imports
import { Login } from '../pages/admin/Login';
import { ProtectedRoute } from '../components/layout/ProtectedRoute';
import { AdminLayout } from '../components/layout/AdminLayout';
import { CategoriesAdmin } from '../pages/admin/CategoriesAdmin';
import { ProductsAdmin } from '../pages/admin/ProductsAdmin';
import { ProductFormPage } from '../pages/admin/ProductFormPage';

// Public Layout wrapper
const PublicLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export const AppRouter = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
      </Route>

      {/* Admin Public Routes */}
      <Route path="/admin/login" element={<Login />} />

      {/* Admin Protected Routes */}
      <Route path="/admin" element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="categorias" element={<CategoriesAdmin />} />
          <Route path="productos" element={<ProductsAdmin />} />
          <Route path="productos/nuevo" element={<ProductFormPage />} />
          <Route path="productos/editar/:id" element={<ProductFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
};
