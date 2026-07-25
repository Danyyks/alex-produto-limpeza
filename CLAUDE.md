# CLAUDE.md

Guia para sessões de IA (Claude Code ou similar) trabalhando neste repositório. Para contexto de produto, ver [PRD.md](PRD.md); para arquitetura técnica detalhada, ver [SDD.md](SDD.md).

## Visão geral

"Alex — Produtos de Limpeza" é uma SPA (React) de catálogo online com checkout via WhatsApp — sem backend, sem pagamento online. O cliente informa o nome, monta o carrinho e o app abre o WhatsApp da loja com o pedido pronto.

## Stack e comandos

- React 18 + TypeScript, Vite 6, Tailwind CSS v4 (via `@tailwindcss/vite`), Framer Motion (`motion`), `lucide-react`, gerenciado com **pnpm**.
- `pnpm dev` — servidor de desenvolvimento (porta fixa `5180`, ver comentário em `vite.config.ts`).
- `pnpm build` — build de produção em `dist/` (gera também o service worker e o manifest do PWA).
- `pnpm preview` — sobe o build de produção localmente para testar o comportamento real do PWA (o service worker não roda em `pnpm dev`).

## Estrutura de pastas

```
src/
├── main.tsx                       # bootstrap do React
├── app/
│   ├── App.tsx                    # estado do cliente (carrinho, login, tema) e layout principal
│   ├── config/
│   │   ├── brand.ts                # nome, subtítulo e textos da marca (ponto único de edição)
│   │   └── categories.ts           # categorias de produto (chave, rótulo, ícone)
│   ├── data/products.ts            # catálogo fixo (temporário, ver roadmap no PRD.md)
│   ├── types/menu.ts                # tipo compartilhado MenuItem
│   ├── hooks/
│   │   ├── useMenuData.ts           # serve o catálogo (hoje: dados fixos; futuro: Firebase)
│   │   └── useTheme.ts              # estado do tema claro/escuro (localStorage + prefers-color-scheme)
│   └── components/                  # BrandMark, LoginScreen, ProductCard, AddItemModal, CartDrawer
└── styles/                          # fonts.css, tailwind.css, theme.css (tokens de cor)
```

## Design tokens — sempre usar, nunca hardcode

Cores vivem como variáveis CSS em `src/styles/theme.css` (`:root` = claro, `.dark` = escuro), mapeadas para Tailwind via `@theme inline`. Use sempre as classes de token (`bg-primary`, `text-primary`, `bg-accent`, `text-muted-foreground`, `border-border`, `bg-card`, etc.) — nunca cores literais tipo `bg-purple-500` ou `bg-gray-900`. Exceção documentada: o botão de WhatsApp usa `bg-green-500` de propósito (cor oficial da marca WhatsApp, não da nossa marca). Mais detalhes em [guidelines/Guidelines.md](guidelines/Guidelines.md).

## Dark mode

Implementado via `src/app/hooks/useTheme.ts`: aplica/remove a classe `.dark` em `document.documentElement`, persiste a escolha em `localStorage` (`alex-theme`) e usa `prefers-color-scheme` como valor inicial. Há também um script inline em `index.html` que aplica a classe antes do React montar (evita flash de tela clara em quem prefere escuro). O botão de alternância fica no header (`App.tsx`), ao lado do botão do carrinho. Qualquer novo componente com cor de fundo/texto deve usar tokens (ver seção acima) para responder automaticamente à troca de tema.

## PWA

Configurado via `vite-plugin-pwa` em `vite.config.ts` (manifest inline no config do plugin, `registerType: 'autoUpdate'`). Os ícones (`favicon.ico`, `apple-touch-icon-180x180.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`) vivem em `public/` e foram gerados a partir de `public/favicon.svg` com `@vite-pwa/assets-generator`.

**Se o logo/favicon mudar**, regenerar os ícones em vez de editá-los manualmente:
```
pnpm dlx @vite-pwa/assets-generator --preset minimal-2023 --config pwa-assets.config.ts public/favicon.svg
```
Depois, validar com `pnpm build && pnpm preview` e conferir em DevTools → Application (Manifest / Service Workers) que não há ícones quebrados.

## Variáveis de ambiente

Só existe `VITE_WHATSAPP_NUMBER` (número da loja no formato internacional, sem `+`). Copiar `.env.example` para `.env` e preencher — nunca commitar `.env` real nem hardcodar o número no código.

## O que NÃO fazer

- Não rodar `vercel` CLI, login ou deploy sem o usuário pedir explicitamente — o projeto fica pronto para deploy, mas quem conecta e publica é o usuário via dashboard da Vercel.
- Não hardcodar cores fora dos tokens de `theme.css`.
- Não espalhar textos de marca pelos componentes — centralizar em `src/app/config/brand.ts`.
- Não commitar `.env`.
- Não editar os ícones PNG/ICO em `public/` manualmente — regenerar a partir do SVG fonte (ver seção PWA acima).
