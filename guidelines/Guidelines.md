# Guidelines — Alex, Produtos de Limpeza

Resumo das convenções deste projeto, para não se perder no código depois de um tempo parado.

## Marca e textos

Nome, subtítulo e textos de hero/footer ficam centralizados em `src/app/config/brand.ts`. Para trocar qualquer texto de marca, editar só ali — evite espalhar strings novas pelos componentes.

## Cores

Todas as cores da marca são tokens CSS em `src/styles/theme.css` (`:root` para modo claro, `.dark` para escuro), mapeados para classes Tailwind via `@theme inline`. Use sempre os tokens (`bg-primary`, `text-primary`, `bg-accent`, `text-muted-foreground`, `border-border` etc.) — nunca cores hardcoded tipo `bg-purple-500`. Para trocar a paleta inteira, basta editar as variáveis em `theme.css`.

Exceção: o botão de WhatsApp usa verde (`bg-green-500`) de propósito — é a cor oficial do WhatsApp, não da marca.

## Catálogo (Firestore, com fallback local)

Produtos vêm do Firestore como lista simples — sem categoria — servidos pelo hook `src/app/hooks/useMenuData.ts`, que é o único lugar que sabe de onde os dados vêm; o resto do app (`StorePage.tsx`, `ProductCard`, etc.) só consome o resultado, sem saber se veio do Firestore ou do fallback. A loja não agrupa mais produtos por categoria — é uma lista única, com busca por nome no lugar da antiga navegação por chips de categoria.

Quando o Firebase não está configurado neste ambiente (`isFirebaseConfigured` em `src/app/lib/firebase.ts`) — ou se a leitura do Firestore falhar — o hook cai automaticamente pro catálogo fixo em `src/app/data/products.ts` (array simples de `MenuItem`, hoje vazio). Isso é proposital: a loja nunca fica fora do ar por causa de uma falha ou ausência de configuração do Firebase.

Editar produtos "de verdade" (com o Firebase conectado) é feito pelo painel `/admin`, não editando código. Editar `data/products.ts` só faz sentido pra ajustar o catálogo que aparece nesse modo de fallback.

## Sessão do cliente vs. login do admin

Duas coisas que parecem parecidas mas são sistemas completamente diferentes — ver detalhes em [SDD.md](../SDD.md#sessão-e-autenticação):

- Cliente da loja: `useSession` — só um nome, sem senha, persistido em `localStorage`. Não é autenticação real.
- Lojista no painel: `useAdminAuth` — Firebase Auth (e-mail/senha) de verdade, mais checagem de que o UID está em `admins/{uid}` no Firestore.

Nunca misturar os dois fluxos nem reaproveitar `LoginScreen.tsx` (cliente) para telas do admin.

## Checkout / WhatsApp

A mensagem é montada em `src/app/pages/StorePage.tsx` (`handleCheckout`), com nome do cliente, endereço, itens e total, e aberta via `window.location.href = "https://wa.me/<número>?text=..."`. O número vem de `VITE_WHATSAPP_NUMBER` no `.env`/na Vercel — nunca hardcoded no código. `handleCheckout` valida que o número existe antes de montar o link (mostra um alerta se faltar, em vez de abrir um `wa.me/undefined`).

Dois cuidados específicos, aprendidos com bugs reais em produção: usar sempre `window.location.href` (não `window.open`) — um PWA instalado em modo standalone não sabe abrir "nova aba", e o Android recusa o link; e evitar emojis fora do plano básico do Unicode (ex. 📍) na mensagem — o redirecionamento do próprio `wa.me` os corrompe. Detalhes em [SDD.md](../SDD.md#incidentes-conhecidos-2026-07-25).

## Tipos compartilhados

`MenuItem` fica em `src/app/types/menu.ts`. É usado pelo hook `useMenuData`, pelos dados estáticos em `products.ts` e pelo `ProductCard`.

## Deploy

O projeto está pronto para deploy na Vercel (`vercel.json` já configurado: build via `pnpm run build`, saída em `dist/`, rewrite de SPA — o mesmo rewrite catch-all já cobre as rotas do `/admin`). Variáveis de ambiente: `VITE_WHATSAPP_NUMBER` (checkout) e as 6 `VITE_FIREBASE_*` (catálogo dinâmico + admin) — ver `.env.example`. As variáveis do Firebase podem ficar em branco sem quebrar o deploy; a loja só usa o catálogo de fallback local até serem preenchidas.
