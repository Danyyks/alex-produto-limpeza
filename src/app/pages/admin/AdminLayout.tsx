import { LogOut } from 'lucide-react';
import { NavLink, Outlet } from 'react-router';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { logoutAdmin } from '../../services/auth';

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 rounded-full text-sm font-medium transition-colors ${
    isActive
      ? 'bg-primary text-primary-foreground'
      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
  }`;

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-30 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="w-9 h-9" />
            <h1 className="text-lg font-semibold text-primary leading-tight">Painel Administrativo</h1>
          </div>
          <Button variant="destructive" size="icon" onClick={logoutAdmin} aria-label="Sair do painel">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        <nav className="max-w-5xl mx-auto px-4 pb-3 flex items-center gap-2">
          <NavLink to="/admin" end className={linkClass}>
            Produtos
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categorias
          </NavLink>
        </nav>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
