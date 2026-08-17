import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from './Button';
import { Modal } from './Modal';

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
    <Modal isOpen={isOpen} onClose={handleClose} title="Adicionar ao pedido">
      <div className="mb-6">
        <h4 className="mb-2">{itemName}</h4>
        <p className="text-muted-foreground">
          R$ {itemPrice.toFixed(2)} cada
        </p>
      </div>

      <div className="mb-6">
        <label className="block mb-2 text-foreground">Quantidade</label>
        <div className="flex items-center gap-4">
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
            aria-label="Diminuir quantidade"
          >
            <Minus className="w-5 h-5" />
          </Button>
          <span className="text-2xl font-semibold min-w-[3ch] text-center">
            {quantity}
          </span>
          <Button
            variant="secondary"
            size="icon-sm"
            onClick={() => setQuantity(quantity + 1)}
            aria-label="Aumentar quantidade"
          >
            <Plus className="w-5 h-5" />
          </Button>
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

      <Button variant="primary" onClick={handleConfirm} className="w-full">
        Adicionar ao carrinho
      </Button>
    </Modal>
  );
}
