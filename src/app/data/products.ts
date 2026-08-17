import type { MenuItem } from '../types/menu';

/**
 * Catálogo de fallback local — usado só quando o Firebase não está configurado
 * neste ambiente ou a leitura do Firestore falha (ver src/app/hooks/useMenuData.ts).
 * Fica vazio de propósito: o catálogo real é cadastrado pelo lojista em /admin.
 */
export const PRODUCTS: MenuItem[] = [];
