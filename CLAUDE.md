# CLAUDE.md

Guia para sessões de IA (Claude Code ou similar) trabalhando neste repositório. Para contexto de produto, ver [PRD.md](PRD.md); para arquitetura técnica detalhada, ver [SDD.md](SDD.md).

## Visão geral

"Alex — Produtos de Limpeza" é uma SPA (React) de catálogo online com checkout via WhatsApp — sem backend, sem pagamento online. O cliente informa o nome, monta o carrinho e o app abre o WhatsApp da loja com o pedido pronto.

**Em produção**: https://alex-produto-limpeza.vercel.app (deploy automático a cada push em `main`, via integração Git da Vercel).

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
│   ├── data/products.ts            # catálogo fixo (temporário, ver roadmap no PRD.md) — fotos em public/products/ ou Unsplash
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

**Importante sobre a Vercel**: variáveis de ambiente do Vite são "assadas" no momento do build — configurar/alterar uma env var no dashboard da Vercel só tem efeito a partir do **próximo deploy**, nunca retroativamente. Se o checkout do WhatsApp parar de funcionar em produção, o primeiro passo é confirmar que a variável realmente está salva (`vercel env ls`, não só olhar o painel) e que existe para o ambiente **Production** especificamente (Production/Preview/Development são escopos independentes na Vercel).

## Troubleshooting: botão "Enviar pedido pelo WhatsApp" não funciona

Já aconteceu mais de uma vez neste projeto — checar nesta ordem:
1. **Link abre com `wa.me/undefined`**: `VITE_WHATSAPP_NUMBER` não estava disponível no build (var não configurada ou configurada só para outro ambiente na Vercel). `handleCheckout` em `App.tsx` já valida isso e mostra um alerta em vez de tentar abrir um link quebrado — se esse alerta aparecer, é isso.
2. **"Não foi possível abrir este link" no Android**: acontecia quando o código usava `window.open(url, '_blank')` — um PWA instalado (modo standalone) não tem "nova aba" para abrir, e o Android falha ao resolver o link externo. Corrigido usando `window.location.href` (navegação direta), que é a forma correta de sair para uma URL externa a partir de um PWA instalado. Não reintroduzir `window.open` aqui.
3. **Mensagem chega com um caractere `�` estranho**: emojis "astrais" (fora do plano básico do Unicode, a maioria dos emojis modernos tipo 📍📦🛒) são corrompidos pelo próprio redirecionamento do WhatsApp (`wa.me` → `api.whatsapp.com`). Evitar esse tipo de emoji na mensagem — símbolos do plano básico como `•` funcionam bem.

## O que NÃO fazer

- Não rodar `vercel` CLI, login ou deploy de produção (`vercel --prod`) sem o usuário pedir explicitamente e fornecer um token — essa ação também é bloqueada pelo classificador de modo automático do Claude Code por padrão. Se precisar forçar um novo deploy depois de mudar uma env var, preferir `git commit --allow-empty && git push` (o projeto já tem auto-deploy via GitHub) em vez de insistir no `vercel --prod`.
- Não hardcodar cores fora dos tokens de `theme.css`.
- Não espalhar textos de marca pelos componentes — centralizar em `src/app/config/brand.ts`.
- Não commitar `.env` nem qualquer token/credencial.
- Não editar os ícones PNG/ICO em `public/` manualmente — regenerar a partir do SVG fonte (ver seção PWA acima).
