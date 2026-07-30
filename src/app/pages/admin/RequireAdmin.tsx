import { Navigate, Outlet } from 'react-router';
import { useAdminAuth } from '../../hooks/useAdminAuth';

export function RequireAdmin() {
  const { status } = useAdminAuth();

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Verificando acesso…</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
}
