/**
 * Serviço de Perfil do Site
 *
 * Gerencia a tabela site_profile (logo do estabelecimento).
 * Essa tabela sempre tem apenas 1 linha (id = 1).
 */
import { supabase } from '../lib/supabase';
import { SiteProfile } from '../types/menu';

interface ProfileRow {
  id: number;
  logo_url: string | null;
}

function rowToProfile(row: ProfileRow): SiteProfile {
  return {
    logo: row.logo_url ?? '',
  };
}

/** Busca o perfil do site (retorna null se ainda não foi criado) */
export async function fetchProfile(): Promise<SiteProfile | null> {
  const { data, error } = await supabase
    .from('site_profile')
    .select('*')
    .eq('id', 1)
    .single();

  if (error) {
    // PGRST116 = "zero rows" — perfil ainda não existe
    if (error.code === 'PGRST116') return null;
    throw error;
  }

  return rowToProfile(data as ProfileRow);
}

/**
 * Salva o perfil.
 * Usa UPSERT: se existir atualiza, se não existir cria.
 */
export async function saveProfile(profile: SiteProfile): Promise<void> {
  const { error } = await supabase
    .from('site_profile')
    .upsert({ id: 1, logo_url: profile.logo || null });

  if (error) throw error;
}
