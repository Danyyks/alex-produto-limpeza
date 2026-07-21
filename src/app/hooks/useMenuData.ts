/**
 * Hook: useMenuData
 *
 * Centraliza o carregamento do catálogo + perfil do Supabase.
 *
 * Por que usar um hook?
 * - Evita repetir o código de fetch em vários componentes
 * - Gerencia loading/erro automaticamente
 * - Expõe refresh() para recarregar após o admin salvar alterações
 *
 * Como usar:
 *   const { itemsByCategory, profile, loading, refresh } = useMenuData();
 */
import { useState, useEffect, useCallback } from 'react';
import { MenuItem, SiteProfile } from '../types/menu';
import { fetchMenuItems, Category } from '../services/menuService';
import { fetchProfile } from '../services/profileService';
import { CATEGORIES } from '../config/categories';

const DEFAULT_PROFILE: SiteProfile = { logo: '' };

type ItemsByCategory = Record<Category, MenuItem[]>;

const EMPTY_ITEMS: ItemsByCategory = CATEGORIES.reduce(
  (acc, c) => ({ ...acc, [c.key]: [] }),
  {} as ItemsByCategory,
);

export function useMenuData() {
  const [itemsByCategory, setItemsByCategory] = useState<ItemsByCategory>(EMPTY_ITEMS);
  const [profile, setProfile] = useState<SiteProfile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Busca todas as categorias + perfil em paralelo para ser mais rápido
      const [results, p] = await Promise.all([
        Promise.all(CATEGORIES.map((c) => fetchMenuItems(c.key))),
        fetchProfile(),
      ]);

      const next = CATEGORIES.reduce((acc, c, i) => {
        acc[c.key] = results[i];
        return acc;
      }, {} as ItemsByCategory);

      setItemsByCategory(next);
      // Se não tiver logo no banco, usa o fallback (BrandMark) no lugar do <img>
      setProfile(p?.logo ? p : DEFAULT_PROFILE);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido';
      console.error('[useMenuData] Erro ao carregar:', msg);
      setError('Não foi possível carregar o catálogo. Verifique o .env.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carrega na primeira vez que o componente aparece
  useEffect(() => {
    refresh();
  }, [refresh]);

  return { itemsByCategory, profile, loading, error, refresh };
}
