import { Home, LogOut } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { logoutAdmin } from '../../services/auth';

export function AdminLayout() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-30 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BrandMark className="w-9 h-9" />
            <h1 className="text-lg font-semibold text-primary leading-tight">Painel Administrativo</h1>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="tertiary"
              size="icon"
              onClick={() => navigate('/')}
              aria-label="Voltar à loja"
            >
              <Home className="w-5 h-5" />
            </Button>
            <Button variant="destructive" size="icon" onClick={logoutAdmin} aria-label="Sair do painel">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
