import { X, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemName: string;
  itemPrice: number;
  onConfirm: (quantity: number, notes: string) => void;
}

export function AddItemModal({
  isOpen,
  onClose,
  itemName,
  itemPrice,
  onConfirm,
}: AddItemModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const handleConfirm = () => {
    onConfirm(quantity, notes);
    setQuantity(1);
    setNotes('');
  };

  const handleClose = () => {
    onClose();
    setQuantity(1);
    setNotes('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:max-w-lg bg-card rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3>Adicionar ao pedido</h3>
              <button
                onClick={handleClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="mb-6">
              <h4 className="mb-2">{itemName}</h4>
              <p className="text-muted-foreground">
                R$ {itemPrice.toFixed(2)} cada
              </p>
            </div>

            <div className="mb-6">
              <label className="block mb-2 text-foreground">Quantidade</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                  className="bg-muted hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed rounded-full p-2 transition-colors"
                >
                  <Minus className="w-5 h-5" />
                </button>
                <span className="text-2xl font-semibold min-w-[3ch] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="bg-muted hover:bg-secondary rounded-full p-2 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block mb-2 text-foreground">
                Observações (opcional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: embalagem específica, urgência..."
                className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-muted-foreground">Total:</span>
              <span className="text-2xl font-semibold text-primary">
                R$ {(itemPrice * quantity).toFixed(2)}
              </span>
            </div>

            <motion.button
              onClick={handleConfirm}
              whileTap={{ scale: 0.97 }}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 rounded-xl transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              Adicionar ao carrinho
            </motion.button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
