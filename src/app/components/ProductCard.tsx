import { Plus } from 'lucide-react';
import { motion } from 'motion/react';

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
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="bg-card rounded-2xl shadow-md overflow-hidden border border-border hover:shadow-xl transition-shadow duration-300"
    >
      {image ? (
        <div className="relative h-40 sm:h-44 md:h-48 overflow-hidden bg-muted">
          <img src={image} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>
      ) : (
        <div className="h-3 bg-gradient-to-r from-primary to-accent" />
      )}

      <div className="p-5">
        <h3 className="mb-2">{name}</h3>
        {description && (
          <p className="text-muted-foreground mb-4 text-sm leading-relaxed line-clamp-2">
            {description}
          </p>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-xl md:text-2xl font-bold text-primary shrink-0">
            R$ {price.toFixed(2)}
          </span>
          <button
            onClick={onAdd}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-4 md:px-6 py-2.5 transition-colors duration-200 flex items-center gap-1.5 shadow-md hover:shadow-lg text-sm md:text-base shrink-0"
          >
            <Plus className="w-4 h-4 md:w-5 md:h-5" />
            Adicionar
          </button>
        </div>
      </div>
    </motion.div>
  );
}
