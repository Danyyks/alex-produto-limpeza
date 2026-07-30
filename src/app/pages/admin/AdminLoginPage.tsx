import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { BrandMark } from '../../components/BrandMark';
import { Button } from '../../components/Button';
import { isFirebaseConfigured } from '../../lib/firebase';
import { isUserAdmin, loginAdmin, logoutAdmin } from '../../services/auth';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!isFirebaseConfigured) {
      setError('Firebase ainda não foi configurado neste ambiente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await loginAdmin(email, password);
      const admin = await isUserAdmin(user.uid);
      if (!admin) {
        await logoutAdmin();
        setError('Esta conta não tem permissão de administrador.');
        return;
      }
      navigate('/admin', { replace: true });
    } catch {
      setError('E-mail ou senha incorretos.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm bg-card border border-border rounded-3xl shadow-xl p-8">
        <div className="flex flex-col items-center text-center mb-6">
          <BrandMark className="w-14 h-14 mb-3" />
          <h1 className="text-xl font-semibold text-foreground">Painel Administrativo</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Acesso restrito ao responsável pela loja.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="admin-email" className="block text-sm font-medium text-foreground mb-1">
              E-mail
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label htmlFor="admin-password" className="block text-sm font-medium text-foreground mb-1">
              Senha
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Entrando…' : 'Entrar'}
          </Button>
        </form>
      </div>
    </div>
  );
}
