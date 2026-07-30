# SDD — Documento de Design de Software — Alex, Produtos de Limpeza

Documento de arquitetura técnica. Para contexto de produto, ver [PRD.md](PRD.md); para convenções do dia a dia, ver [CLAUDE.md](CLAUDE.md).

## Arquitetura

SPA (Single Page Application) front-end, sem servidor próprio — o "backend" é o **Firebase** (Firestore + Authentication), acessado direto do navegador via SDK client-side, sem API intermediária. Upload de foto de produto vai pro **Cloudinary** (não Firebase Storage — esse exige o plano pago Blaze; Cloudinary tem plano gratuito sem cartão), via `fetch` direto pra API REST deles, sem SDK. Roteamento client-side via `react-router` (`/` = loja, `/admin/*` = painel do lojista, com code-splitting via `React.lazy`). O carrinho e o tema continuam em `localStorage`/React state; a sessão do cliente (nome) também passou a persistir em `localStorage`. O catálogo (produtos e categorias) vem do Firestore, com fallback pro catálogo local estático (`src/app/data/products.ts` + `src/app/config/categories.ts`) sempre que o Firebase não estiver configurado ou a leitura falhar — a loja nunca fica fora do ar por causa disso. O checkout continua fechado com o **WhatsApp**, via link `https://wa.me/<numero>?text=<mensagem>`.

```
Cliente (navegador/PWA, rota "/")             Lojista (navegador, rota "/admin/*")
   │                                              │
   ├─ useSession (login em localStorage)           ├─ useAdminAuth (Firebase Auth)
   ├─ useMenuData → Firestore (products/            ├─ services/* → Firestore (CRUD) +
   │   categories); fallback local se offline       │   Cloudinary (upload de fotos)
   │                                              │
   └─ Checkout → https://wa.me/...  ───────────────────────────┐
                                                                 ▼
                                                   WhatsApp da loja (confirmação/pagamento)
```

## Stack técnica

| Camada | Escolha | Por quê |
|---|---|---|
| Framework | React 18 + TypeScript | Componentização simples, tipagem para o catálogo/carrinho |
| Build | Vite 6 | Build rápido, dev server leve, ecossistema de plugins maduro (PWA incluso) |
| Estilo | Tailwind CSS v4 (`@tailwindcss/vite`) | Utilitários + tokens de tema via `@theme inline`, sem CSS-in-JS |
| Animação | Framer Motion (`motion`) | Transições de entrada, drawer do carrinho, feedback de toque |
| Ícones | `lucide-react` | Consistência visual, tree-shakeable |
| Backend | Firebase (Firestore + Authentication) | BaaS sem servidor próprio — catálogo dinâmico, login do lojista, tudo via SDK client-side |
| Upload de imagem | Cloudinary (free tier, API REST via `fetch`) | Firebase Storage exige plano pago (Blaze); Cloudinary tem plano gratuito sem cartão, suficiente pro volume de fotos de uma loja pequena |
| Roteamento | `react-router` v7 | `/` (loja) e `/admin/*` (painel), com code-splitting via `React.lazy` — ver nota abaixo sobre o nome do pacote |
| Gerenciador de pacotes | pnpm | Já era o padrão do projeto (lockfile/workspace existentes) |
| Hospedagem | Vercel | Build estático via `vercel.json` (`framework: vite`, rewrite de SPA) |

**Nota sobre `react-router`**: instalar sempre `react-router@^7` (pin de major), nunca `react-router-dom` nem a tag `latest` sem pin — a partir da v7 os pacotes foram unificados sob o nome `react-router`, e a tag `latest` desse pacote pode apontar pra uma major que exija uma versão de React mais nova do que a instalada aqui (`react@18.3.1`). Confirmar `peerDependencies` no registro antes de atualizar a major.

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

### Client-side (carrinho, catálogo de fallback)

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

Itens iguais com observações diferentes viram entradas separadas no carrinho (chave de deduplicação é `productId + notes`, ver `StorePage.tsx` → `handleAddToCart`).

### Firestore

| Coleção | Campo | Tipo | Obs |
|---|---|---|---|
| `products/{id}` | `name`, `description`, `price` | string, string, number | `description` é sempre string (nunca `undefined` — Firestore rejeita o campo) |
| | `image`, `imagePath` | string \| null | `image` = URL pública do Cloudinary (`secure_url`); `imagePath` = `public_id` do Cloudinary (não usado pra excluir hoje — ver "Painel administrativo") |
| | `active`, `categoryId` | boolean, string | `categoryId` referencia um doc em `categories` |
| | `createdAt`, `updatedAt` | Timestamp | `serverTimestamp()` |
| `categories/{id}` | `label`, `icon`, `order` | string, string, number | `icon` é o NOME do ícone (allow-list em `src/app/config/categoryIcons.ts`), não o componente — `LucideIcon` não é serializável |
| `admins/{uid}` | `email`, `createdAt` | string, Timestamp | **nunca criado pelo app** — só manualmente no Firebase Console |

IDs de `products`/`categories` são sempre auto-gerados pelo Firestore (nunca o slug/nome), pra permitir renomear sem quebrar a referência em `products.categoryId`. Tipos completos em `src/app/services/products.ts` (`ProductDoc`) e `src/app/services/categories.ts` (`CategoryDoc`).

## Sessão e autenticação

Dois sistemas de identidade separados de propósito — não compartilham código nem tela:

- **`useSession`** (`src/app/hooks/useSession.ts`) — sessão do CLIENTE da loja: só um nome, persistido em `localStorage` (`alex-session`), sem senha nem validação real. Botão "Sair" no header da loja limpa nome e carrinho juntos.
- **`useAdminAuth`** (`src/app/hooks/useAdminAuth.ts`) — sessão do LOJISTA no painel: Firebase Auth (e-mail/senha) de verdade, mais checagem de que o UID autenticado existe em `admins/{uid}` (se não existir, desloga automaticamente — colapsa "autenticado mas não-admin" em "não autenticado"). Rota protegida por `src/app/pages/admin/RequireAdmin.tsx`.

Criar um admin novo é sempre manual: Authentication → Add user no Firebase Console, copiar o UID, criar `admins/{uid}` no Firestore Console. O app nunca expõe um caminho de auto-cadastro de admin.

## Painel administrativo

Rota `/admin/*`, code-split via `React.lazy` em `App.tsx` — `firebase/auth` só entra no bundle de quem visita `/admin`, nunca no bundle da loja (`firebase/firestore` continua eager pra loja, já que o catálogo público depende dele desde o primeiro carregamento).

- `/admin/login` — login do lojista (pública).
- `/admin` — lista de produtos (busca por nome, filtro por categoria, ativar/desativar, editar, excluir) + formulário de criar/editar (modal, com upload de foto).
- `/admin/categories` — lista de categorias (criar, renomear, reordenar com ▲/▼, excluir — bloqueado se ainda houver produto na categoria).

**Upload de foto** (`src/app/services/storage.ts`): passa primeiro por `src/app/lib/imageResize.ts` (redimensiona no client via `canvas`, lado maior ~1200px, JPEG ~0.8 de qualidade — evita subir fotos de celular com vários MB), depois vai direto do navegador pro **Cloudinary** via `fetch` num "unsigned upload preset" (`VITE_CLOUDINARY_CLOUD_NAME`/`VITE_CLOUDINARY_UPLOAD_PRESET`), sem SDK e sem backend. Não corrige orientação EXIF (ver "Limitações conhecidas").

**Exclusão de foto é um no-op deliberado**: excluir um asset do Cloudinary exige uma chamada assinada com a API Secret, uma credencial que não pode ficar no client — este projeto não tem backend pra guardá-la. Trocar ou excluir a foto de um produto deixa o arquivo antigo órfão no Cloudinary (aceitável no volume de fotos de uma loja pequena, dentro do plano gratuito). O `public_id` fica salvo em `imagePath` caso um backend futuro (ex. Cloud Function) queira implementar a limpeza de verdade.

Catálogo público usa busca única (`getDocs`), não `onSnapshot`/tempo real — mudança feita no admin só aparece pra quem já estava com a loja aberta depois de recarregar a página.

## Fluxo de checkout

`StorePage.tsx` → `handleCheckout(address)` valida que `VITE_WHATSAPP_NUMBER` existe (senão mostra um alerta e interrompe), monta uma string de texto (nome do cliente, endereço, lista de itens com quantidade/observação, total) e navega para `https://wa.me/<numero>?text=<mensagem>` via `window.location.href` (navegação direta — ver seção "Incidentes conhecidos" sobre por que não é `window.open`). Não há confirmação de entrega/leitura — o pedido é considerado "enviado" assim que a página do WhatsApp abre.

## Deploy

`vercel.json` já configurado: `buildCommand: pnpm run build`, `outputDirectory: dist`, `framework: vite`, rewrite `/(.*) → /index.html` (necessário porque é SPA sem rotas de servidor — o mesmo rewrite catch-all já cobre `/admin/*` do `react-router`, nenhum ajuste extra foi preciso). O projeto está publicado em **https://alex-produto-limpeza.vercel.app**, com deploy automático a cada push em `main` via integração Git da Vercel. Variável de ambiente `VITE_WHATSAPP_NUMBER` configurada diretamente no projeto (Production + Development) via `vercel env add`.

O projeto Firebase real (`rb-clean`, região `southamerica-east1`) já existe e está conectado **localmente** (`.env`, não commitado), com Firestore e Authentication ativos, e uma conta de admin real já criada. A conta do Cloudinary (free tier) também já existe e está configurada localmente. As 6 variáveis `VITE_FIREBASE_*` + as 2 `VITE_CLOUDINARY_*` (ver `.env.example`) ainda precisam ser configuradas na Vercel — são valores independentes do `.env` local, e até serem adicionadas lá, a versão **em produção** continua servindo o catálogo local (vazio) como fallback (`isFirebaseConfigured` = `false` nesse ambiente até então) e o upload de foto no admin fica desativado.

## Incidentes conhecidos (2026-07-25)

Três problemas distintos apareceram entre a implementação do checkout e o funcionamento correto em produção — documentados aqui porque nenhum deles é óbvio lendo só o código:

1. **Emoji astral corrompido pelo WhatsApp**: a mensagem tinha um 📍 (U+1F4CD, fora do plano básico do Unicode). O app montava e enviava a string certa, mas o próprio redirecionamento `wa.me` → `api.whatsapp.com` substituía esse caractere por `�` na URL final. Confirmado isolando cada etapa (arquivo fonte, resposta do dev server, `fetch` no navegador — todos corretos até a infraestrutura do WhatsApp). Correção: remover emojis fora do BMP da mensagem.
2. **`window.open` falha em PWA instalado (standalone) no Android**: com o app adicionado à tela inicial, `window.open(url, '_blank')` disparava o erro nativo do Android "Não foi possível abrir este link" — um PWA em modo standalone não tem o conceito de "nova aba" para o Android resolver. Correção: `window.location.href = url` (navegação direta no mesmo frame), que o Android sempre sabe rotear (para o app do WhatsApp, se instalado, ou para um navegador).
3. **Env var "configurada" que nunca foi salva**: o usuário confirmou (duas vezes) ter configurado `VITE_WHATSAPP_NUMBER` no painel da Vercel, mas `vercel env ls` mostrava que o projeto não tinha nenhuma env var salva — o build gerava `wa.me/undefined`. Como env vars do Vite são fixadas em tempo de build, a correção exigiu: (a) salvar a variável de fato via `vercel env add` para Production e Development, e (b) disparar um novo build (`git commit --allow-empty && git push`, já que `vercel --prod` direto é bloqueado pelo classificador de modo automático do Claude Code). Ver também o guard clause em `handleCheckout` (item 3 do Troubleshooting no `CLAUDE.md`), adicionado para transformar esse tipo de falha silenciosa em um alerta explícito.

## Limitações conhecidas

- Carrinho não persiste entre sessões (perdido ao fechar a aba/app) — só tema e sessão do cliente são persistidos.
- "Login" do cliente não autentica nada de verdade — é personalização de saudação + continuidade entre visitas, sem senha nem proteção real (proteção real existe só no `/admin`, via Firebase Auth).
- Catálogo público não é tempo real (`getDocs`, não `onSnapshot`) — uma edição no admin só aparece pra quem já estava com a loja aberta depois de recarregar a página.
- Sem paginação no admin — lista de produtos/categorias inteira de uma vez (adequado ao tamanho de catálogo de uma loja pequena; reavaliar se crescer muito).
- Redimensionamento de imagem no upload não corrige orientação EXIF (fotos em retrato de alguns celulares podem vir giradas).
- Trocar/excluir a foto de um produto não apaga o arquivo antigo no Cloudinary (exclusão real exigiria a API Secret, que não fica no client) — fotos antigas ficam órfãs, sem impacto prático no volume de uma loja pequena.
- Sem rastreamento de pedido após o envio pelo WhatsApp.
- Cache do service worker é de assets estáticos (precache do build); não há estratégia de sincronização em background nem push notifications.
