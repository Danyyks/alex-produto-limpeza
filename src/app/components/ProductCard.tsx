import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from './Button';

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  image?: string;
  onAdd: () => void;
}

export function ProductCard({ name, description, price, image, onAdd }: ProductCardProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.99 }}
      className="flex items-center gap-4 bg-card rounded-2xl shadow-md overflow-hidden border border-border hover:shadow-xl hover:ring-1 hover:ring-primary/20 transition-shadow duration-300 p-3"
    >
      <div className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-muted">
        {image ? (
          <img src={image} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary to-accent" />
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col py-1">
        <h3 className="truncate">{name}</h3>
        {description && (
          <p className="text-muted-foreground text-sm leading-relaxed line-clamp-1 sm:line-clamp-2 mt-1">
            {description}
          </p>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="text-lg md:text-xl font-semibold text-primary shrink-0">
            R$ {price.toFixed(2)}
          </span>
          <Button variant="primary" size="sm" onClick={onAdd} className="shrink-0">
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Adicionar
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
