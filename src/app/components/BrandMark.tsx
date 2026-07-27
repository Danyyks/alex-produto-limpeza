import { BRAND_LOGO_SRC, BRAND_NAME } from '../config/brand';

interface BrandMarkProps {
  className?: string;
}

/**
 * Logomark padrão da marca.
 */
export function BrandMark({ className = 'w-12 h-12' }: BrandMarkProps) {
  return (
    <img
      src={BRAND_LOGO_SRC}
      alt={BRAND_NAME}
      className={`${className} object-contain drop-shadow-sm`}
    />
  );
}
