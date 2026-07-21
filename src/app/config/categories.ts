import { Droplets, Shirt, Sparkles, Package, LucideIcon } from 'lucide-react';

export type Category = 'geral' | 'lavanderia' | 'higiene' | 'kits';

export interface CategoryConfig {
  key: Category;
  label: string;
  icon: LucideIcon;
}

/**
 * Categorias de produtos exibidas no catálogo.
 * Para adicionar uma categoria nova: incluir aqui + no type Category acima.
 */
export const CATEGORIES: CategoryConfig[] = [
  { key: 'geral', label: 'Limpeza Geral', icon: Droplets },
  { key: 'lavanderia', label: 'Lavanderia', icon: Shirt },
  { key: 'higiene', label: 'Higiene & Descartáveis', icon: Sparkles },
  { key: 'kits', label: 'Kits & Combos', icon: Package },
];
