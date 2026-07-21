/**
 * Configuração central da marca.
 * Centraliza nome, subtítulo e textos usados em várias telas,
 * para facilitar trocar a identidade do site sem caçar strings espalhadas.
 */
export const BRAND_NAME = 'Alex';
export const BRAND_SUBTITLE = 'Produtos de Limpeza';
export const BRAND_FULL_NAME = `${BRAND_NAME} — ${BRAND_SUBTITLE}`;

export const BRAND_TEXT = {
  loginWelcome: 'Bem-vindo à nossa loja online!',
  loginTagline: 'Tudo para deixar sua casa limpa, com praticidade e confiança.',
  heroTitle: 'Sua casa limpa, sem complicação.',
  heroSubtitle:
    'Produtos de limpeza de qualidade, entregues rápido e com o preço justo. Peça agora pelo catálogo e receba direto no WhatsApp.',
  userGreeting: (name: string) => `${name}, seja bem-vindo(a)!`,
  footerCopyright: `© 2026 ${BRAND_NAME} - Todos os direitos reservados`,
};
