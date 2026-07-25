# Alex — Produtos de Limpeza

Loja online de produtos de limpeza com fluxo simples: o cliente informa o nome, monta o carrinho no catálogo e envia o pedido pronto direto para o WhatsApp da loja. PWA instalável, com tema claro/escuro.

📄 **Documentação completa**: [PRD.md](PRD.md) (produto) · [SDD.md](SDD.md) (arquitetura técnica) · [CLAUDE.md](CLAUDE.md) (convenções para desenvolvimento/IA)

## Rodando o projeto localmente

```bash
pnpm install
pnpm dev
```

O app fica disponível em `http://localhost:5180`.

Copie `.env.example` para `.env` e preencha `VITE_WHATSAPP_NUMBER` com o número da loja no formato internacional (ex: `5511999999999`).

## Build e preview

```bash
pnpm build     # gera dist/ (inclui manifest e service worker do PWA)
pnpm preview   # sobe o build de produção localmente, para testar o PWA de verdade
```

## Deploy

O `vercel.json` já está configurado (build via `pnpm run build`, saída em `dist/`, rewrite de SPA) — basta importar o repositório na Vercel e configurar `VITE_WHATSAPP_NUMBER` nas variáveis de ambiente do projeto. Detalhes em [SDD.md](SDD.md#deploy).

## Identidade visual

Paleta roxo (`#6D28D9`) e verde-água (`#14B8A6`), com tema escuro incluso — tokens em `src/styles/theme.css`. Fotos dos produtos vêm do [Unsplash](https://unsplash.com) (uso comercial permitido) até serem substituídas pelas fotos reais.
