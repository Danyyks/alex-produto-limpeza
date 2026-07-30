import { Route, Routes } from 'react-router';
import { AdminCategoriesPage } from './AdminCategoriesPage';
import { AdminLayout } from './AdminLayout';
import { AdminLoginPage } from './AdminLoginPage';
import { AdminProductsPage } from './AdminProductsPage';
import { RequireAdmin } from './RequireAdmin';

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLoginPage />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminProductsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
        </Route>
      </Route>
    </Routes>
  );
}
