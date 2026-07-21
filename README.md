# Alex — Produtos de Limpeza

Loja online de produtos de limpeza com fluxo simples: o cliente informa o nome, monta o carrinho no catálogo e envia o pedido pronto direto para o WhatsApp da loja.

Este projeto nasceu como adaptação de um sistema de pedidos de lanchonete já existente — a lógica de negócio (cadastro simples, catálogo, carrinho, checkout via WhatsApp) foi reaproveitada, mas a marca, as categorias de produto e o visual são próprios deste projeto.

## Status atual

- **Catálogo**: fixo no código (`src/app/data/products.ts`), com produtos de exemplo. Ainda não há banco de dados nem painel admin.
- **Hospedagem**: pronto para deploy na **Vercel** (build estático via Vite).
- **Próximo passo planejado**: integrar **Firebase** (Firestore para os produtos, Auth para o admin, Storage para as imagens) e trazer de volta um painel de administração. Até lá, produtos são editados direto no código.

## Tecnologias

- React 18 e TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion (`motion`) para as animações de interface
- Lucide React para os ícones

## Como funciona

1. O cliente abre o link e informa apenas o nome (sem senha).
2. Navega pelo catálogo, organizado em 4 categorias: Limpeza Geral, Lavanderia, Higiene & Descartáveis, Kits & Combos.
3. Ao adicionar um produto, escolhe a quantidade e pode incluir observações.
4. Revisa o carrinho, informa o endereço de entrega e confirma.
5. O app monta uma mensagem com todos os itens e abre o WhatsApp da loja já com o texto pronto para envio.

## Estrutura do código

```
src/
├── main.tsx
├── app/
│   ├── App.tsx                    # estado do cliente (carrinho, login) e layout principal
│   ├── config/
│   │   ├── brand.ts                # nome, subtítulo e textos da marca (centralizado)
│   │   └── categories.ts           # categorias de produto (chave, rótulo, ícone)
│   ├── data/
│   │   └── products.ts             # catálogo fixo (temporário, até o Firebase entrar)
│   ├── types/
│   │   └── menu.ts                 # tipo compartilhado MenuItem
│   ├── components/
│   │   ├── BrandMark.tsx           # logo em SVG
│   │   ├── LoginScreen.tsx         # tela de entrada com o nome do cliente
│   │   ├── ProductCard.tsx         # card de produto (usado em todas as categorias)
│   │   ├── AddItemModal.tsx        # modal de quantidade e observações
│   │   └── CartDrawer.tsx          # carrinho lateral + checkout via WhatsApp
│   └── hooks/
│       └── useMenuData.ts          # serve o catálogo (hoje: dados fixos; futuro: Firebase)
├── styles/                         # tema (cores, tipografia) e estilos globais
```

## Rodando o projeto localmente

```bash
pnpm install
pnpm dev
```

O app fica disponível em `http://localhost:5173`.

Copie `.env.example` para `.env` e preencha `VITE_WHATSAPP_NUMBER` com o número da loja no formato internacional (ex: `5511999999999`).

## Build

```bash
pnpm build
```

Os arquivos finais ficam em `dist/`. O `vercel.json` já está configurado (build via `pnpm run build`, saída em `dist/`, rewrite de SPA) — basta importar o repositório na Vercel.

## Identidade visual

- Paleta: roxo (`#6D28D9`) como cor principal, verde-água (`#14B8A6`) como destaque — definidos como tokens em `src/styles/theme.css` (`--primary`, `--accent`, etc.), com variante escura já incluída.
- Logo: `src/app/components/BrandMark.tsx` (SVG, gota estilizada).
- Mais variações de logo e a paleta completa estão documentadas no projeto "Alex — Produtos de Limpeza" em [claude.ai/design](https://claude.ai/design).
- Fotos dos produtos: banco de imagens do [Unsplash](https://unsplash.com) (licença livre, uso comercial permitido) — trocar pelas fotos reais dos produtos quando disponíveis.
