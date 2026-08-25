# CLAUDE.md

Guia para sessões de IA (Claude Code ou similar) trabalhando neste repositório. Para contexto de produto, ver [PRD.md](PRD.md); para arquitetura técnica detalhada, ver [SDD.md](SDD.md).

## Visão geral

"NA Clean Distribuidora" é uma SPA (React) de catálogo online com checkout via WhatsApp — sem servidor próprio, sem pagamento online; o "backend" é o Firebase (Firestore + Authentication), usado direto do client, mais o Cloudinary pro upload de foto de produto (Firebase Storage exige plano pago, não usado aqui). O cliente informa o nome, monta o carrinho e o app abre o WhatsApp da loja com o pedido pronto. O lojista gerencia os produtos (sem categorias — lista única, com busca por nome na loja) por um painel em `/admin` (Firebase Auth, separado do login do cliente) — ver [SDD.md](SDD.md) para detalhes técnicos de ambos os sistemas de sessão.

**Em produção**: https://alex-produto-limpeza.vercel.app (deploy automático a cada push em `main`, via integração Git da Vercel).

## Stack e comandos

- React 18 + TypeScript, Vite 6, Tailwind CSS v4 (via `@tailwindcss/vite`), Framer Motion (`motion`), `lucide-react`, `firebase` (Firestore/Authentication — Storage não é usado, ver seção de upload abaixo), `react-router` v7 (**não** `react-router-dom`, e sempre com major preso em `^7` — v8 exige React ≥19.2.7, incompatível com o `react@18.3.1` deste projeto), gerenciado com **pnpm**.
- `pnpm dev` — servidor de desenvolvimento (porta fixa `5180`, ver comentário em `vite.config.ts`).
- `pnpm build` — build de produção em `dist/` (gera também o service worker e o manifest do PWA).
- `pnpm preview` — sobe o build de produção localmente para testar o comportamento real do PWA (o service worker não roda em `pnpm dev`).

## Estrutura de pastas

```
src/
├── main.tsx                       # bootstrap do React
├── app/
│   ├── App.tsx                    # shell do react-router: "/" (loja) e "/admin/*" (painel, lazy)
│   ├── config/
│   │   └── brand.ts                # nome, subtítulo e textos da marca (ponto único de edição)
│   ├── data/products.ts            # catálogo de fallback local (usado quando Firebase não está configurado)
│   ├── types/menu.ts                # tipo compartilhado MenuItem
│   ├── lib/
│   │   ├── firebase.ts              # bootstrap do Firebase App + Firestore (app/db) — auth fica em services/
│   │   └── imageResize.ts           # redimensiona foto no client (canvas) antes do upload
│   ├── services/                    # products, auth falam com Firebase; storage.ts fala com o Cloudinary (não Firebase Storage)
│   ├── hooks/
│   │   ├── useMenuData.ts           # serve o catálogo (Firestore, com fallback local automático)
│   │   ├── useSession.ts            # sessão do CLIENTE (nome em localStorage, sem senha)
│   │   ├── useAdminAuth.ts          # sessão do LOJISTA (Firebase Auth + checagem em admins/{uid})
│   │   └── useTheme.ts              # estado do tema claro/escuro (localStorage + prefers-color-scheme)
│   ├── pages/
│   │   ├── StorePage.tsx            # loja (rota "/") — layout principal, busca, carrinho, checkout
│   │   └── admin/                   # painel: AdminRoutes, RequireAdmin, AdminLoginPage, AdminLayout, AdminProductsPage
│   └── components/                  # BrandMark, LoginScreen, ProductCard, Modal, AddItemModal, CartDrawer...
│       └── admin/                   # ProductForm (modal do painel, usa o Modal compartilhado)
└── styles/                          # fonts.css, tailwind.css, theme.css (tokens de cor)
```

## Design tokens — sempre usar, nunca hardcode

Cores vivem como variáveis CSS em `src/styles/theme.css` (`:root` = claro, `.dark` = escuro), mapeadas para Tailwind via `@theme inline`. Use sempre as classes de token (`bg-primary`, `text-primary`, `bg-accent`, `text-muted-foreground`, `border-border`, `bg-card`, etc.) — nunca cores literais tipo `bg-purple-500` ou `bg-gray-900`. Exceção documentada: o botão de WhatsApp usa `bg-green-500` de propósito (cor oficial da marca WhatsApp, não da nossa marca). Mais detalhes em [guidelines/Guidelines.md](guidelines/Guidelines.md).

## Dark mode

Implementado via `src/app/hooks/useTheme.ts`: aplica/remove a classe `.dark` em `document.documentElement`, persiste a escolha em `localStorage` (`alex-theme`) e usa `prefers-color-scheme` como valor inicial. Há também um script inline em `index.html` que aplica a classe antes do React montar (evita flash de tela clara em quem prefere escuro). O botão de alternância fica no header da loja (`src/app/pages/StorePage.tsx`), entre os botões de sair e carrinho. Qualquer novo componente com cor de fundo/texto deve usar tokens (ver seção acima) para responder automaticamente à troca de tema.

## Componentes compartilhados de UI

- `src/app/components/Button.tsx` — único componente de botão do projeto (variantes `primary|secondary|tertiary|destructive|whatsapp|hero`, tamanhos `default|sm|icon|icon-sm`). Reaproveitar sempre em vez de estilizar um `<button>` na mão.
- `src/app/components/Modal.tsx` — padrão de modal centralizado (overlay + card animado, fecha com `Esc`, foca o botão de fechar ao abrir). Usado por `AddItemModal.tsx` e `components/admin/ProductForm.tsx`. `CartDrawer.tsx` é um padrão visual diferente (drawer lateral deslizante) e não usa esse componente.

## PWA

Configurado via `vite-plugin-pwa` em `vite.config.ts` (manifest inline no config do plugin, `registerType: 'autoUpdate'`). Os ícones (`favicon.ico`, `apple-touch-icon-180x180.png`, `pwa-192x192.png`, `pwa-512x512.png`, `maskable-icon-512x512.png`) vivem em `public/` e foram gerados a partir de `public/favicon.svg` com `@vite-pwa/assets-generator`.

**Se o logo/favicon mudar**, regenerar os ícones em vez de editá-los manualmente:
```
pnpm dlx @vite-pwa/assets-generator --preset minimal-2023 --config pwa-assets.config.ts public/favicon.svg
```
Depois, validar com `pnpm build && pnpm preview` e conferir em DevTools → Application (Manifest / Service Workers) que não há ícones quebrados.

## Variáveis de ambiente

- `VITE_WHATSAPP_NUMBER` — número da loja no formato internacional, sem `+`.
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — config do Web App do Firebase (Firebase Console → Configurações do projeto → Seus apps). Podem ficar **em branco**: `src/app/lib/firebase.ts` detecta a ausência (`isFirebaseConfigured`) e a loja usa o catálogo local fixo como fallback — não quebra o build nem a loja, só o painel `/admin` fica sem funcionar de verdade.
- `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET` — conta gratuita do Cloudinary, usada só pro upload de foto de produto no admin (ver `src/app/services/storage.ts`). Também podem ficar em branco — o resto do painel funciona, só o upload de foto fica desativado.

Copiar `.env.example` para `.env` e preencher — nunca commitar `.env` real nem hardcodar nenhum desses valores no código.

**Importante sobre a Vercel**: variáveis de ambiente do Vite são "assadas" no momento do build — configurar/alterar uma env var no dashboard da Vercel só tem efeito a partir do **próximo deploy**, nunca retroativamente. Se o checkout do WhatsApp (ou a conexão com o Firebase/Cloudinary) parar de funcionar em produção, o primeiro passo é confirmar que a variável realmente está salva (`vercel env ls`, não só olhar o painel) e que existe para o ambiente **Production** especificamente (Production/Preview/Development são escopos independentes na Vercel). Com 8 variáveis no total (6 do Firebase + 2 do Cloudinary), o risco de esquecer uma é maior — conferir uma a uma.

## Troubleshooting: botão "Enviar pedido pelo WhatsApp" não funciona

Já aconteceu mais de uma vez neste projeto — checar nesta ordem:
1. **Link abre com `wa.me/undefined`**: `VITE_WHATSAPP_NUMBER` não estava disponível no build (var não configurada ou configurada só para outro ambiente na Vercel). `handleCheckout` em `src/app/pages/StorePage.tsx` já valida isso e mostra um alerta em vez de tentar abrir um link quebrado — se esse alerta aparecer, é isso.
2. **"Não foi possível abrir este link" no Android**: acontecia quando o código usava `window.open(url, '_blank')` — um PWA instalado (modo standalone) não tem "nova aba" para abrir, e o Android falha ao resolver o link externo. Corrigido usando `window.location.href` (navegação direta), que é a forma correta de sair para uma URL externa a partir de um PWA instalado. Não reintroduzir `window.open` aqui.
3. **Mensagem chega com um caractere `�` estranho**: emojis "astrais" (fora do plano básico do Unicode, a maioria dos emojis modernos tipo 📍📦🛒) são corrompidos pelo próprio redirecionamento do WhatsApp (`wa.me` → `api.whatsapp.com`). Evitar esse tipo de emoji na mensagem — símbolos do plano básico como `•` funcionam bem.

## Troubleshooting: painel `/admin` não funciona / catálogo não atualiza

1. **Login em `/admin/login` sempre falha com "Firebase ainda não foi configurado neste ambiente"**: as 6 env vars `VITE_FIREBASE_*` não estão preenchidas neste ambiente (local ou Vercel) — ver seção "Variáveis de ambiente". Comportamento esperado até o projeto Firebase real existir.
2. **Login funciona mas cai com "Esta conta não tem permissão de administrador"**: o usuário existe no Firebase Authentication, mas não tem um documento correspondente em `admins/{uid}` no Firestore. Precisa ser criado manualmente no Firestore Console (o app nunca faz isso sozinho, de propósito).
3. **Editou um produto no admin e a loja não mudou**: catálogo público usa busca única (`getDocs`), não tempo real — precisa recarregar a página da loja pra ver a mudança.
4. **Loja carregando produtos "errados"/antigos mesmo com o Firestore populado**: confirmar que `isFirebaseConfigured` está `true` neste ambiente (env vars presentes) — senão a loja está servindo o catálogo de fallback local (`src/app/data/products.ts`), não o Firestore.
5. **Upload de foto falha com "Upload de foto não está configurado neste ambiente"**: as 2 env vars `VITE_CLOUDINARY_*` não estão preenchidas neste ambiente — resto do formulário de produto funciona normalmente, só a foto que não sobe.
6. **Upload de foto falha com outro erro**: confirmar no [dashboard do Cloudinary](https://cloudinary.com) que o upload preset referenciado em `VITE_CLOUDINARY_UPLOAD_PRESET` ainda existe e continua com "Signing Mode" = **Unsigned** (Settings → Upload → Upload presets) — se alguém mudar pra "Signed" sem querer, todo upload direto do navegador para de funcionar.

## O que NÃO fazer

- Não rodar `vercel` CLI, login ou deploy de produção (`vercel --prod`) sem o usuário pedir explicitamente e fornecer um token — essa ação também é bloqueada pelo classificador de modo automático do Claude Code por padrão. Se precisar forçar um novo deploy depois de mudar uma env var, preferir `git commit --allow-empty && git push` (o projeto já tem auto-deploy via GitHub) em vez de insistir no `vercel --prod`.
- Não hardcodar cores fora dos tokens de `theme.css`.
- Não espalhar textos de marca pelos componentes — centralizar em `src/app/config/brand.ts`.
- Não commitar `.env` nem qualquer token/credencial.
- Não editar os ícones PNG/ICO em `public/` manualmente — regenerar a partir do SVG fonte (ver seção PWA acima).
- Não criar um caminho de auto-cadastro de admin no app (ex: um formulário de "criar conta" em `/admin`). Virar admin é sempre um ato manual no Firebase Console (criar o usuário em Authentication + o documento em `admins/{uid}` no Firestore) — ver [SDD.md](SDD.md#sessão-e-autenticação).
- Não adicionar `firebase-admin` nem credencial de service account a este projeto — ele não tem (e não deveria ganhar) nenhum código server-side; tudo que o admin faz passa pelo SDK client do Firebase, já autenticado, com permissão controlada por `firestore.rules`.
- Não instalar `react-router-dom` nem `react-router` sem pin de major — ver nota em "Stack e comandos" sobre a v8 exigir React ≥19.2.7.
- Não colocar a **API Secret** do Cloudinary em nenhum lugar do código/client — só o Cloud name e o nome do upload preset (ambos não-sensíveis) são usados no app. A API Secret só seria necessária pra operações admin (ex: excluir imagem), que este projeto deliberadamente não faz do client — ver "Painel administrativo" no [SDD.md](SDD.md).
- Não reativar Firebase Storage neste projeto sem antes confirmar com o usuário — ele optou por Cloudinary especificamente pra não precisar cadastrar cartão (Storage exige o plano pago Blaze).
