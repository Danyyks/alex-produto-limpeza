interface BrandMarkProps {
  className?: string;
}

/**
 * Logomark padrão da marca: gota estilizada em gradiente roxo → teal.
 * Usado como fallback quando o admin ainda não subiu uma logo própria.
 */
export function BrandMark({ className = 'w-12 h-12' }: BrandMarkProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="14" fill="url(#alex-brand-gradient)" />
      <path
        d="M24 10c-5 6.5-8.5 11.6-8.5 16A8.5 8.5 0 0 0 24 34.5 8.5 8.5 0 0 0 32.5 26c0-4.4-3.5-9.5-8.5-16Z"
        fill="white"
      />
      <circle cx="33.5" cy="13.5" r="2.2" fill="white" fillOpacity="0.85" />
      <circle cx="30" cy="9" r="1.2" fill="white" fillOpacity="0.7" />
      <defs>
        <linearGradient id="alex-brand-gradient" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6D28D9" />
          <stop offset="1" stopColor="#14B8A6" />
        </linearGradient>
      </defs>
    </svg>
  );
}
