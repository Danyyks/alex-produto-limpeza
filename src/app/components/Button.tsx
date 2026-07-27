import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { motion, type HTMLMotionProps } from 'motion/react';

type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'destructive'
  | 'whatsapp'
  | 'hero';

type ButtonSize = 'default' | 'sm' | 'icon' | 'icon-sm';

interface ButtonProps
  extends Omit<HTMLMotionProps<'button'>, 'ref'>,
    Pick<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg',
  secondary:
    'bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border',
  tertiary:
    'bg-transparent text-muted-foreground hover:bg-muted hover:text-foreground',
  destructive: 'bg-transparent text-destructive hover:bg-destructive/10',
  whatsapp: 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg',
  hero: 'bg-gradient-to-r from-primary to-accent text-white hover:opacity-90 shadow-lg',
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  default: 'rounded-xl px-6 py-3 text-base gap-2',
  sm: 'rounded-full px-4 py-2.5 text-sm gap-1.5',
  icon: 'rounded-full p-3',
  'icon-sm': 'rounded-full p-1.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'default', className = '', type = 'button', disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        className={`inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
        {...props}
      />
    );
  },
);

Button.displayName = 'Button';
