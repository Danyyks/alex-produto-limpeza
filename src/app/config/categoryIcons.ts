import {
  Box,
  Brush,
  Droplets,
  Package,
  Shirt,
  ShowerHead,
  Sparkles,
  SprayCan,
  Trash2,
  WashingMachine,
  type LucideIcon,
} from 'lucide-react';

/**
 * Allow-list de ícones que o admin pode escolher para uma categoria.
 * O Firestore guarda só o nome (string) — LucideIcon é componente React,
 * não serializável — resolvido aqui pro componente real.
 */
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Droplets,
  Shirt,
  Sparkles,
  Package,
  SprayCan,
  Trash2,
  Brush,
  WashingMachine,
  ShowerHead,
  Box,
};

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS);

export const DEFAULT_CATEGORY_ICON: LucideIcon = Package;

export function resolveCategoryIcon(name: string | undefined): LucideIcon {
  return (name && CATEGORY_ICONS[name]) || DEFAULT_CATEGORY_ICON;
}
