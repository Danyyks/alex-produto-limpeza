import { useState } from 'react';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import { motion } from 'motion/react';
import { LoginScreen } from './components/LoginScreen';
import { ProductCard } from './components/ProductCard';
import { AddItemModal } from './components/AddItemModal';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { BrandMark } from './components/BrandMark';
import { useMenuData } from './hooks/useMenuData';
import { useTheme } from './hooks/useTheme';
import { BRAND_NAME, BRAND_TEXT } from './config/brand';
import { CATEGORIES } from './config/categories';

export default function App() {
  // ── Catálogo (dados fixos por enquanto, ver hooks/useMenuData.ts) ──
  const { itemsByCategory } = useMenuData();

  // ── Tema claro/escuro ────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();

  // ── Estado do cliente ───────────────────────────────────────
  const [userName, setUserName] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
    price: number;
  }>({ isOpen: false, id: '', name: '', price: 0 });

  // ── Handlers do cliente ─────────────────────────────────────
  const handleLogin = (name: string) => {
    setUserName(name);
    setIsLoggedIn(true);
  };

  const openModal = (id: string, name: string, price: number) => {
    setModalData({ isOpen: true, id, name, price });
  };

  const closeModal = () => {
    setModalData((prev) => ({ ...prev, isOpen: false }));
  };

  const handleAddToCart = (quantity: number, notes: string) => {
    const existingIndex = cartItems.findIndex(
      (item) => item.productId === modalData.id && item.notes === notes,
    );

    if (existingIndex >= 0) {
      setCartItems(
        cartItems.map((item, i) =>
          i === existingIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      );
    } else {
      setCartItems([
        ...cartItems,
        {
          id: `${modalData.id}-${Date.now()}`,
          productId: modalData.id,
          name: modalData.name,
          price: modalData.price,
          quantity,
          notes,
        },
      ]);
    }
    closeModal();
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item)),
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = (address: string) => {
    const total = cartItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    let message = `Olá! Meu nome é *${userName}* e gostaria de fazer o seguinte pedido:\n\n*Endereço de entrega:* ${address}\n\n`;

    cartItems.forEach((item) => {
      message += `• ${item.name} (${item.quantity}x)`;
      if (item.notes) message += ` - ${item.notes}`;
      message += '\n';
    });

    message += `\n*Total: R$ ${total.toFixed(2)}*`;

    const whatsappUrl = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.location.href = whatsappUrl;
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── Tela de login do cliente ────────────────────────────────
  if (!isLoggedIn) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  // ── Site principal (cliente logado) ─────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <BrandMark className="w-10 h-10 md:w-14 md:h-14 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl text-primary mb-0.5">
                {BRAND_NAME}
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground truncate">
                {BRAND_TEXT.userGreeting(userName)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
              className="rounded-full p-3 text-foreground hover:bg-muted transition-colors duration-200"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir carrinho${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`}
              className="relative bg-primary hover:bg-primary/90 text-primary-foreground rounded-full p-3 transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent text-white py-10 md:py-16 px-4 rounded-b-3xl">
        <div className="max-w-6xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-3 md:mb-4 text-white text-xl md:text-2xl"
          >
            {BRAND_TEXT.heroTitle}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm md:text-lg leading-relaxed max-w-3xl mx-auto text-white/90"
          >
            {BRAND_TEXT.heroSubtitle}
          </motion.p>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {CATEGORIES.map(({ key, label, icon: Icon }, index) => {
          const items = itemsByCategory[key].filter((item) => item.active);
          if (items.length === 0) return null;

          return (
            <motion.section
              key={key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="mb-12"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-primary rounded-full p-2">
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h2 className="text-foreground">{label}</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    name={item.name}
                    description={item.description ?? ''}
                    price={item.price}
                    image={item.image}
                    onAdd={() => openModal(item.id, item.name, item.price)}
                  />
                ))}
              </div>
            </motion.section>
          );
        })}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-10 mt-16">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-muted-foreground">{BRAND_TEXT.footerCopyright}</p>
          <p className="text-muted-foreground/70 text-sm mt-3">
            Desenvolvido por: Dany Jonathan Bueno
          </p>
        </div>
      </footer>

      {/* ── Modais do cliente ── */}
      <AddItemModal
        isOpen={modalData.isOpen}
        onClose={closeModal}
        itemName={modalData.name}
        itemPrice={modalData.price}
        onConfirm={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />
    </div>
  );
}
