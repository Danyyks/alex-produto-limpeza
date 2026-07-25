# SDD — Documento de Design de Software — Alex, Produtos de Limpeza

Documento de arquitetura técnica. Para contexto de produto, ver [PRD.md](PRD.md); para convenções do dia a dia, ver [CLAUDE.md](CLAUDE.md).

## Arquitetura

SPA (Single Page Application) 100% front-end, sem backend próprio e sem banco de dados. Todo o estado (login, carrinho, tema) vive em memória/React state ou `localStorage`, perdido ao fechar a aba (exceto o tema). O catálogo é um array estático em código-fonte. O único sistema externo integrado é o **WhatsApp**, via link `https://wa.me/<numero>?text=<mensagem>` — não há API própria.

```
Cliente (navegador/PWA)
   │
   ├─ Catálogo estático (src/app/data/products.ts)
   ├─ Estado local (React useState: carrinho, login, tema)
   └─ Checkout → abre https://wa.me/... com mensagem pré-formatada
                     │
                     ▼
              WhatsApp da loja (canal humano de confirmação/pagamento)
```

## Stack técnica

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | React 18 + TypeScript | Componentização simples, tipagem para o catálogo/carrinho |
| Build | Vite 6 | Build rápido, dev server leve, ecossistema de plugins maduro (PWA incluso) |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`) | Utilitários + tokens de tema via `@theme inline`, sem CSS-in-JS |
| Animação | Framer Motion (`motion`) | Transições de entrada, drawer do carrinho, feedback de toque |
| Ícones | `lucide-react` | Consistência visual, tree-shakeable |
| Gerenciador de pacotes | pnpm | Já era o padrão do projeto (lockfile/workspace existentes) |
| Hospedagem | Vercel | Build estático via `vercel.json` (`framework: vite`, rewrite de SPA) |

## Design system

Tokens de cor centralizados em `src/styles/theme.css`: variáveis CSS em `:root` (tema claro) e `.dark` (tema escuro), expostas ao Tailwind via `@theme inline` (ex: `--color-primary: var(--primary)`). Paleta: roxo `#6D28D9` (primary) e verde-água `#14B8A6` (accent) no claro; tons ajustados (`#a78bfa` primary, `#2dd4bf` accent) no escuro para manter contraste em fundo escuro. Raio de borda padronizado via `--radius` (0.75rem) com variantes `sm/md/lg/xl` derivadas.

**Dark mode**: ativado por classe `.dark` na raiz do documento (não por `prefers-color-scheme` isolado), controlado pelo hook `src/app/hooks/useTheme.ts`:
- Estado inicial: `localStorage['alex-theme']` se existir, senão `window.matchMedia('(prefers-color-scheme: dark)')`.
- Persistência: `localStorage` a cada mudança.
- Anti-FOUC: script inline síncrono em `index.html` (antes do bundle React) aplica a classe `.dark` no `<html>` antes da primeira pintura, usando a mesma lógica do hook.

## PWA

Implementado com **`vite-plugin-pwa`** (`registerType: 'autoUpdate'`, modo `generateSW`), configurado em `vite.config.ts`:
- **Manifest** (`manifest.webmanifest`, gerado no build): nome, `theme_color` (`#6d28d9`), `background_color` (`#f8f7fc`), `display: standalone`, ícones 64/192/512 + variante maskable.
- **Service worker**: gerado automaticamente pelo Workbox (via o plugin), faz precache dos assets do build (`globPatterns: ['**/*.{js,css,html,svg,png,ico,woff2}']`) para carregamento instantâneo em visitas repetidas e funcionamento básico offline. Registrado automaticamente pelo próprio plugin (sem código manual em `main.tsx`).
- **Ícones**: gerados a partir de `public/favicon.svg` (fonte única) via `@vite-pwa/assets-generator` (preset `minimal-2023`), configurado em `pwa-assets.config.ts`. Saída: `favicon.ico`, `apple-touch-icon-180x180.png`, `pwa-64x64.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png` — todos versionados em `public/`.
- **Meta tags** em `index.html`: `theme-color` (com variantes por `prefers-color-scheme`), `apple-mobile-web-app-*`, `apple-touch-icon`, favicon `.ico` como fallback do SVG.
- **Importante**: o SW só é ativado no build de produção (`pnpm build && pnpm preview`), não em `pnpm dev`.

## Estrutura de dados

```ts
// src/app/types/menu.ts
interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  active: boolean;
}

// src/app/components/CartDrawer.tsx
interface CartItem {
  id: string;          // `${productId}-${timestamp}`, gerado no momento de adicionar
  productId: string;
  name: string;
  price: number;
  quantity: number;
  notes?: string;
}
```

Itens iguais com observações diferentes viram entradas separadas no carrinho (chave de deduplicação é `productId + notes`, ver `App.tsx` → `handleAddToCart`).

## Fluxo de checkout

`App.tsx` → `handleCheckout(address)` monta uma string de texto (nome do cliente, endereço, lista de itens com quantidade/observação, total) e chama `window.open('https://wa.me/<VITE_WHATSAPP_NUMBER>?text=' + encodeURIComponent(mensagem))`. Não há confirmação de entrega/leitura — o pedido é considerado "enviado" assim que a aba do WhatsApp abre.

## Deploy

`vercel.json` já configurado: `buildCommand: pnpm run build`, `outputDirectory: dist`, `framework: vite`, rewrite `/(.*) → /index.html` (necessário porque é SPA sem rotas de servidor). Variável de ambiente necessária no dashboard da Vercel: `VITE_WHATSAPP_NUMBER`. Nenhum passo de deploy foi executado a partir deste repositório — a conexão do repositório Git ao projeto Vercel e a configuração da variável de ambiente ficam a cargo de quem publica.

## Limitações conhecidas

- Carrinho não persiste entre sessões (perdido ao fechar a aba/app) — só o tema é persistido.
- Catálogo é estático; qualquer alteração de produto exige editar código e novo deploy.
- "Login" não autentica nada — é só personalização de saudação, não há sessão real nem proteção de rota.
- Sem rastreamento de pedido após o envio pelo WhatsApp.
- Cache do service worker é de assets estáticos (precache do build); não há estratégia de sincronização em background nem push notifications.
