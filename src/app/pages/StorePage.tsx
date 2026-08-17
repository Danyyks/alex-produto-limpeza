import { useState } from 'react';
import { LogOut, Search, ShoppingCart, Sun, Moon, UserCog } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import { LoginScreen } from '../components/LoginScreen';
import { ProductCard } from '../components/ProductCard';
import { AddItemModal } from '../components/AddItemModal';
import { CartDrawer, CartItem } from '../components/CartDrawer';
import { BrandMark } from '../components/BrandMark';
import { ContactSection } from '../components/ContactSection';
import { Button } from '../components/Button';
import { useMenuData } from '../hooks/useMenuData';
import { useTheme } from '../hooks/useTheme';
import { useSession } from '../hooks/useSession';
import {
  BRAND_BANNER_SRC,
  BRAND_CONTACT,
  BRAND_NAME,
  BRAND_SUBTITLE,
  BRAND_TEXT,
  buildWhatsappLink,
} from '../config/brand';

export function StorePage() {
  // ── Catálogo (Firestore, com fallback local — ver hooks/useMenuData.ts) ──
  const { status, items } = useMenuData();

  // ── Tema claro/escuro ────────────────────────────────────────
  const { theme, toggleTheme } = useTheme();

  // ── Sessão do cliente (nome + login persistidos em localStorage) ──
  const { userName, isLoggedIn, login, logout } = useSession();

  // ── Estado do cliente ───────────────────────────────────────
  const [search, setSearch] = useState('');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    isOpen: boolean;
    id: string;
    name: string;
    price: number;
  }>({ isOpen: false, id: '', name: '', price: 0 });

  // ── Handlers do cliente ─────────────────────────────────────
  const handleLogout = () => {
    if (cartItems.length > 0 && !window.confirm(BRAND_TEXT.sessionLogoutConfirm)) return;
    setCartItems([]);
    setIsCartOpen(false);
    logout();
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
    if (!BRAND_CONTACT.whatsappNumber) {
      alert(
        'Número de WhatsApp da loja não está configurado neste ambiente. Avise o responsável pelo site.',
      );
      return;
    }

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

    window.location.href = buildWhatsappLink(message);
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ── Tela de login do cliente ────────────────────────────────
  if (!isLoggedIn) {
    return <LoginScreen onLogin={login} />;
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Carregando catálogo…</p>
      </div>
    );
  }

  const activeItems = items.filter((item) => item.active);
  const filteredItems = activeItems.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return item.name.toLowerCase().includes(q) || (item.description ?? '').toLowerCase().includes(q);
  });

  // ── Site principal (cliente logado) ─────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card/95 backdrop-blur-sm shadow-sm sticky top-0 z-30 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <BrandMark className="w-10 h-10 md:w-14 md:h-14 shrink-0" />
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-semibold text-primary leading-tight truncate">
                {BRAND_NAME}
              </h1>
              <p className="text-xs md:text-sm font-medium uppercase tracking-wide text-muted-foreground truncate">
                {BRAND_SUBTITLE}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="destructive"
              size="icon"
              onClick={handleLogout}
              aria-label="Sair"
            >
              <LogOut className="w-5 h-5" />
            </Button>
            <Button
              variant="tertiary"
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            <Button
              variant="primary"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Abrir carrinho${totalItems > 0 ? `, ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`}
              className="relative"
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-xs font-semibold rounded-full w-6 h-6 flex items-center justify-center"
                >
                  {totalItems}
                </motion.span>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 pt-4 md:pt-6">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center bg-card border border-border rounded-3xl shadow-xl overflow-hidden p-6 md:p-10"
        >
          <div className="w-full max-w-xs sm:max-w-sm rounded-2xl overflow-hidden aspect-[6/5] shadow-md">
            <img
              src={BRAND_BANNER_SRC}
              alt="Produtos de limpeza RB Clean"
              className="w-full h-full object-cover"
              style={{ objectPosition: 'right center' }}
            />
          </div>
          <div className="mt-6 text-center max-w-2xl">
            <h2 className="text-2xl md:text-4xl font-semibold text-foreground leading-tight">
              {BRAND_TEXT.heroHeadline}
            </h2>
            <p className="mt-3 text-muted-foreground md:text-lg">
              {BRAND_TEXT.heroSubtitle}
            </p>
          </div>
        </motion.div>
      </section>

      <div className="sticky top-[81px] md:top-[89px] z-20 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar produto…"
              aria-label="Buscar produto"
              className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {filteredItems.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">Nenhum produto encontrado.</p>
        ) : (
          <div className="flex flex-col gap-3 md:gap-4">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.03 }}
              >
                <ProductCard
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image ?? undefined}
                  onAdd={() => openModal(item.id, item.name, item.price)}
                />
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-4 mt-16">
        <div className="max-w-6xl mx-auto px-4 relative flex items-center justify-center">
          <ContactSection />
          <Link
            to="/admin/login"
            className="absolute right-4 top-1/2 -translate-y-1/2 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors shrink-0"
          >
            <UserCog className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ADMIN</span>
          </Link>
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
