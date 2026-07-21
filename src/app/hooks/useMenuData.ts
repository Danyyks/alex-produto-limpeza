/**
 * Hook: useMenuData
 *
 * Por enquanto serve o catálogo fixo em data/products.ts (sem backend).
 * Mantém o mesmo formato de retorno para facilitar a troca pelo Firebase
 * futuramente, sem precisar mudar quem consome o hook (App.tsx).
 */
import { PRODUCTS } from '../data/products';

export function useMenuData() {
  return { itemsByCategory: PRODUCTS };
}
