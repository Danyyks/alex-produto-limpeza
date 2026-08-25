# NA Clean Distribuidora — Produtos de Limpeza

Loja online de produtos de limpeza com fluxo simples: o cliente informa o nome, monta o carrinho no catálogo (com busca por nome e escolha de perfume/variante quando o produto tiver opções) e envia o pedido pronto direto para o WhatsApp da loja. PWA instalável, com tema claro/escuro, sessão do cliente persistente e um painel administrativo (`/admin`, Firebase) para o lojista gerenciar o catálogo de produtos.

🔗 **Em produção**: https://alex-produto-limpeza.vercel.app

📄 **Documentação completa**: [PRD.md](PRD.md) (produto) · [SDD.md](SDD.md) (arquitetura técnica) · [CLAUDE.md](CLAUDE.md) (convenções para desenvolvimento/IA)

## Rodando o projeto localmente

```bash
pnpm install
pnpm dev
```

O app fica disponível em `http://localhost:5180`.

Copie `.env.example` para `.env` e preencha `VITE_WHATSAPP_NUMBER` com o número da loja no formato internacional (ex: `5511999999999`), as 6 variáveis `VITE_FIREBASE_*` do projeto `rb-clean` (Firebase Console → Configurações do projeto → Seus apps) e as 2 `VITE_CLOUDINARY_*` (conta gratuita em cloudinary.com, usada só pro upload de foto de produto). Sem as variáveis do Firebase, a loja ainda funciona (mostra um catálogo local vazio como fallback), mas o painel `/admin` não consegue autenticar de verdade; sem as do Cloudinary, o resto do admin funciona normalmente, só o upload de foto fica desativado.

## Build e preview

```bash
pnpm build     # gera dist/ (inclui manifest e service worker do PWA)
pnpm preview   # sobe o build de produção localmente, para testar o PWA de verdade
```

## Deploy

Já publicado na Vercel com deploy automático a cada push em `main` (`vercel.json` configura build via `pnpm run build`, saída em `dist/`, rewrite de SPA — cobre também as rotas do `/admin`). Variável de ambiente `VITE_WHATSAPP_NUMBER` já configurada no projeto (Production + Development) — se precisar trocar o número, atualizar via `vercel env rm`/`vercel env add` ou pelo dashboard da Vercel (lembrando: só tem efeito no próximo deploy). As 6 variáveis `VITE_FIREBASE_*` do projeto `rb-clean` e as 2 `VITE_CLOUDINARY_*` ainda precisam ser adicionadas lá (já existem e funcionam localmente via `.env`, mas Vercel tem suas próprias env vars, configuradas à parte). Detalhes em [SDD.md](SDD.md#deploy).

## Identidade visual

Paleta roxo (`#6D28D9`) e verde-água (`#14B8A6`), com tema escuro incluso — tokens em `src/styles/theme.css`. O catálogo começa vazio (sem fotos de exemplo) — o lojista cadastra os produtos e fotos reais pelo painel `/admin`.
