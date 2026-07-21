/**
 * Cliente Supabase
 *
 * Este arquivo cria a "conexão" com o banco de dados.
 * É como um telefone que permite o site falar com o Supabase.
 *
 * As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
 * ficam no arquivo .env (nunca sobe pro Git).
 */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    '[Supabase] Variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY não encontradas no .env',
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
