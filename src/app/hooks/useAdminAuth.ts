import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { isFirebaseConfigured } from '../lib/firebase';
import { isUserAdmin, logoutAdmin, subscribeToAuthState } from '../services/auth';

interface AdminAuthState {
  status: 'loading' | 'authenticated' | 'unauthenticated';
  user: User | null;
}

/**
 * Sistema de identidade do LOJISTA (Firebase Auth real) — não confundir com
 * useSession (nome do cliente em localStorage, sem autenticação de verdade).
 * Se o UID autenticado não estiver em `admins`, desloga automaticamente e
 * colapsa pra 'unauthenticated' (defesa extra além da checagem na tela de login).
 */
export function useAdminAuth(): AdminAuthState {
  const [state, setState] = useState<AdminAuthState>(() =>
    isFirebaseConfigured ? { status: 'loading', user: null } : { status: 'unauthenticated', user: null },
  );

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    const unsubscribe = subscribeToAuthState(async (user) => {
      if (!user) {
        setState({ status: 'unauthenticated', user: null });
        return;
      }
      const admin = await isUserAdmin(user.uid);
      if (!admin) {
        await logoutAdmin();
        setState({ status: 'unauthenticated', user: null });
        return;
      }
      setState({ status: 'authenticated', user });
    });

    return unsubscribe;
  }, []);

  return state;
}
