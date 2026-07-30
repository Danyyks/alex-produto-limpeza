import type { LucideIcon } from 'lucide-react';

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  active: boolean;
}

/** Categoria já resolvida para exibição — vem do Firestore ou do fallback local (ver useMenuData). */
export interface ResolvedCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  order: number;
}
