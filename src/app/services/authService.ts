/**
 * Serviço de Autenticação
 *
 * Centraliza tudo relacionado a login/logout do admin.
 * Substitui as credenciais hardcoded do AdminLogin.tsx.
 *
 * O Supabase Auth cuida de:
 * - Verificar email + senha
 * - Guardar a sessão no navegador (localStorage automático)
 * - Renovar o token automaticamente
 */
import { supabase } from '../lib/supabase';

/** Faz login com email e senha */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

/** Faz logout e limpa a sessão */
export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

/** Retorna a sessão atual (null se não estiver logado) */
export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}
