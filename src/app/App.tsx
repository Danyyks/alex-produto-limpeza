import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { StorePage } from './pages/StorePage';

const AdminRoutes = lazy(() => import('./pages/admin/AdminRoutes'));

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StorePage />} />
        <Route
          path="/admin/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen flex items-center justify-center bg-background">
                  <p className="text-muted-foreground">Carregando…</p>
                </div>
              }
            >
              <AdminRoutes />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
