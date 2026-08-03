/**
 * Configuração central da marca.
 * Centraliza nome, subtítulo e textos usados em várias telas,
 * para facilitar trocar a identidade do site sem caçar strings espalhadas.
 */
export const BRAND_NAME = 'RB Clean';
export const BRAND_SUBTITLE = 'Limpeza & Higiene';
export const BRAND_FULL_NAME = `${BRAND_NAME} — ${BRAND_SUBTITLE}`;

export const BRAND_LOGO_SRC = '/logo.png';
export const BRAND_BANNER_SRC = '/banner.jpg';

export const BRAND_TEXT = {
  loginWelcome: 'Bem-vindo à nossa loja online!',
  loginTagline: 'Tudo para deixar sua casa limpa, com praticidade e confiança.',
  heroHeadline: 'Cuidando do seu ambiente com excelência, confiança e brilho',
  heroSubtitle: 'Monte seu pedido e receba em casa',
  sessionLogoutConfirm: 'Sair da loja? Isso vai limpar seu carrinho atual.',
};

export const BRAND_CONTACT = {
  whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined,
  email: 'alexcobra161@gmail.com',
  // Preencher com a URL do perfil (ex.: 'https://instagram.com/rbclean') quando o Instagram da loja estiver pronto.
  instagramUrl: '',
};

export function buildWhatsappLink(message: string) {
  return `https://wa.me/${BRAND_CONTACT.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
