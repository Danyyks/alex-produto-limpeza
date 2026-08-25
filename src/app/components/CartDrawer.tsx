import { useState, useEffect } from 'react';
import { ShoppingCart, X, Minus, Plus, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WhatsAppIcon } from './WhatsAppIcon';
import { Button } from './Button';

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
  fragrance?: string;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: (address: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [address, setAddress] = useState('');
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="w-6 h-6 text-primary" />
                  <h3>Seu Pedido</h3>
                </div>
                <Button
                  variant="tertiary"
                  size="icon-sm"
                  onClick={onClose}
                  aria-label="Fechar"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="text-center py-12 px-6">
                  <ShoppingCart className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                  <p className="text-muted-foreground">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="bg-muted rounded-xl p-4 border border-border"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="mb-1">{item.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            R$ {item.price.toFixed(2)} cada
                          </p>
                          {item.fragrance && (
                            <p className="text-sm text-muted-foreground mt-2">
                              Perfume: {item.fragrance}
                            </p>
                          )}
                          {item.notes && (
                            <p className="text-sm text-muted-foreground mt-2 italic">
                              {item.notes}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="destructive"
                          size="icon-sm"
                          onClick={() => onRemoveItem(item.id)}
                          aria-label={`Remover ${item.name}`}
                        >
                          <X className="w-5 h-5" />
                        </Button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Button
                            variant="secondary"
                            size="icon-sm"
                            onClick={() =>
                              onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))
                            }
                            disabled={item.quantity <= 1}
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold min-w-[2ch] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="secondary"
                            size="icon-sm"
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        <span className="font-semibold text-primary">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {items.length > 0 && (
                <div className="border-t border-border p-6 bg-muted space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-2xl font-semibold text-primary">
                      R$ {total.toFixed(2)}
                    </span>
                  </div>
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-2">
                      <MapPin className="w-4 h-4 text-primary" />
                      Endereço de entrega
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Rua, número, bairro..."
                      className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    />
                  </div>
                  <Button
                    variant="whatsapp"
                    onClick={() => onCheckout(address)}
                    disabled={!address.trim()}
                    className="w-full disabled:bg-muted disabled:text-muted-foreground"
                  >
                    <WhatsAppIcon className="w-6 h-6" />
                    Enviar pedido pelo WhatsApp
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
