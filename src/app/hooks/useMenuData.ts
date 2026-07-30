import { useEffect, useState } from 'react';
import { CATEGORIES } from '../config/categories';
import { resolveCategoryIcon } from '../config/categoryIcons';
import { PRODUCTS } from '../data/products';
import { getCategories } from '../services/categories';
import { getProducts, type ProductDoc } from '../services/products';
import type { ResolvedCategory } from '../types/menu';
import { isFirebaseConfigured } from '../lib/firebase';

interface UseMenuDataResult {
  status: 'loading' | 'ready';
  categories: ResolvedCategory[];
  itemsByCategory: Record<string, ProductDoc[]>;
}

/**
 * Catálogo local fixo (data/products.ts + config/categories.ts) — usado como
 * fallback quando o Firebase não está configurado ou a leitura do Firestore
 * falha, pra loja nunca ficar fora do ar por causa disso.
 */
function buildFallback(): Omit<UseMenuDataResult, 'status'> {
  const categories: ResolvedCategory[] = CATEGORIES.map((cat, index) => ({
    id: cat.key,
    label: cat.label,
    icon: cat.icon,
    order: index,
  }));

  const itemsByCategory: Record<string, ProductDoc[]> = {};
  for (const cat of CATEGORIES) {
    itemsByCategory[cat.key] = PRODUCTS[cat.key].map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description ?? '',
      price: item.price,
      image: item.image ?? null,
      imagePath: null,
      active: item.active,
      categoryId: cat.key,
    }));
  }

  return { categories, itemsByCategory };
}

/**
 * Serve o catálogo (categorias + produtos). Se o Firebase estiver configurado,
 * busca do Firestore; senão (ou se a busca falhar), usa o catálogo local fixo
 * como fallback — a loja nunca fica sem dados por causa disso.
 */
export function useMenuData(): UseMenuDataResult {
  const [state, setState] = useState<UseMenuDataResult>(() =>
    isFirebaseConfigured
      ? { status: 'loading', categories: [], itemsByCategory: {} }
      : { status: 'ready', ...buildFallback() },
  );

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    let cancelled = false;

    async function load() {
      try {
        const [categoryDocs, productDocs] = await Promise.all([getCategories(), getProducts()]);
        if (cancelled) return;

        const categories: ResolvedCategory[] = categoryDocs.map((c) => ({
          id: c.id,
          label: c.label,
          icon: resolveCategoryIcon(c.icon),
          order: c.order,
        }));

        const itemsByCategory: Record<string, ProductDoc[]> = {};
        for (const cat of categories) itemsByCategory[cat.id] = [];
        for (const product of productDocs) {
          (itemsByCategory[product.categoryId] ??= []).push(product);
        }

        setState({ status: 'ready', categories, itemsByCategory });
      } catch (err) {
        if (cancelled) return;
        console.error('Falha ao carregar catálogo do Firestore, usando catálogo local:', err);
        setState({ status: 'ready', ...buildFallback() });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
