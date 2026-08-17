import { useEffect, useState } from 'react';
import { PRODUCTS } from '../data/products';
import { getProducts, type ProductDoc } from '../services/products';
import { isFirebaseConfigured } from '../lib/firebase';

interface UseMenuDataResult {
  status: 'loading' | 'ready';
  items: ProductDoc[];
}

/**
 * Catálogo local fixo (data/products.ts) — usado como fallback quando o
 * Firebase não está configurado ou a leitura do Firestore falha, pra loja
 * nunca ficar fora do ar por causa disso.
 */
function buildFallback(): ProductDoc[] {
  return PRODUCTS.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description ?? '',
    price: item.price,
    image: item.image ?? null,
    imagePath: null,
    active: item.active,
  }));
}

/**
 * Serve o catálogo de produtos. Se o Firebase estiver configurado, busca do
 * Firestore; senão (ou se a busca falhar), usa o catálogo local fixo como
 * fallback — a loja nunca fica sem dados por causa disso.
 */
export function useMenuData(): UseMenuDataResult {
  const [state, setState] = useState<UseMenuDataResult>(() =>
    isFirebaseConfigured
      ? { status: 'loading', items: [] }
      : { status: 'ready', items: buildFallback() },
  );

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;

    async function load() {
      try {
        const items = await getProducts();
        if (cancelled) return;
        setState({ status: 'ready', items });
      } catch (err) {
        if (cancelled) return;
        console.error('Falha ao carregar catálogo do Firestore, usando catálogo local:', err);
        setState({ status: 'ready', items: buildFallback() });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
