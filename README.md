# Alex — Produtos de Limpeza

Loja online de produtos de limpeza com fluxo simples: o cliente informa o nome, monta o carrinho no catálogo e envia o pedido pronto direto para o WhatsApp da loja.

Este projeto nasceu como adaptação de um sistema de pedidos de lanchonete já existente — a lógica de negócio (cadastro simples, catálogo, carrinho, checkout via WhatsApp) foi reaproveitada, mas a marca, as categorias de produto e o visual são próprios deste projeto.

## Tecnologias

- React 18 e TypeScript
- Vite 6
- Tailwind CSS v4
- Framer Motion (`motion`) para as animações de interface
- Supabase (banco de dados + autenticação do admin + storage de imagens)
- Lucide React para os ícones

## Como funciona

1. O cliente abre o link e informa apenas o nome (sem senha).
2. Navega pelo catálogo, organizado em 4 categorias: Limpeza Geral, Lavanderia, Higiene & Descartáveis, Kits & Combos.
3. Ao adicionar um produto, escolhe a quantidade e pode incluir observações.
4. Revisa o carrinho, informa o endereço de entrega e confirma.
5. O app monta uma mensagem com todos os itens e abre o WhatsApp da loja já com o texto pronto para envio.

O admin acessa um painel (botão discreto "admin" no rodapé/tela de login) onde pode criar, editar, ativar/desativar e excluir qualquer produto, em qualquer categoria, além de trocar a logo do site — tudo direto pelo navegador, sem mexer em código.

## Estrutura do código

```
src/
├── main.tsx
├── app/
│   ├── App.tsx                    # estado global (carrinho, login, admin) e layout principal
│   ├── config/
│   │   ├── brand.ts                # nome, subtítulo e textos da marca (centralizado)
│   │   └── categories.ts           # categorias de produto (chave, rótulo, ícone)
│   ├── types/
│   │   └── menu.ts                 # tipos compartilhados MenuItem / SiteProfile
│   ├── components/
│   │   ├── BrandMark.tsx           # logo em SVG (fallback quando não há logo customizada)
│   │   ├── LoginScreen.tsx         # tela de entrada com o nome do cliente
│   │   ├── ProductCard.tsx         # card de produto (usado em todas as categorias)
│   │   ├── AddItemModal.tsx        # modal de quantidade e observações
│   │   ├── CartDrawer.tsx          # carrinho lateral + checkout via WhatsApp
│   │   └── admin/
│   │       ├── AdminLogin.tsx      # login do admin (Supabase Auth)
│   │       └── AdminPanel.tsx      # painel CRUD de produtos e logo
│   ├── hooks/
│   │   └── useMenuData.ts          # busca catálogo + perfil no Supabase
│   ├── lib/
│   │   └── supabase.ts             # client Supabase
│   └── services/                   # CRUD e integrações com Supabase (menu, perfil, auth, imagens)
├── styles/                         # tema (cores, tipografia) e estilos globais
supabase/
├── schema.sql                      # tabelas, RLS e bucket de storage
└── seed.sql                        # produtos de exemplo
```

## Configurando o Supabase

O projeto precisa de um projeto Supabase próprio (não reaproveitar o de outro sistema):

1. Crie um projeto em [supabase.com](https://supabase.com).
2. Abra o **SQL Editor** do projeto e rode o conteúdo de `supabase/schema.sql` (cria as tabelas, políticas de RLS e o bucket de imagens).
3. Rode o conteúdo de `supabase/seed.sql` para popular produtos de exemplo (substitua pelos produtos reais depois, direto pelo Painel Admin).
4. Em **Authentication → Users**, crie manualmente o usuário admin (email + senha) que vai acessar o painel.
5. Em **Project Settings → API**, copie a Project URL e a anon/public key para o seu `.env`.

## Rodando o projeto localmente

```bash
pnpm install
pnpm dev
```

O app fica disponível em `http://localhost:5173`.

Copie `.env.example` para `.env` e preencha:
- `VITE_WHATSAPP_NUMBER` — número da loja no formato internacional (ex: `5511999999999`)
- `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` — do seu projeto Supabase

## Build

```bash
pnpm build
```

Os arquivos finais ficam em `dist/`.

## Identidade visual

- Paleta: roxo (`#6D28D9`) como cor principal, verde-água (`#14B8A6`) como destaque — definidos como tokens em `src/styles/theme.css` (`--primary`, `--accent`, etc.), com variante escura já incluída.
- Logo: `src/app/components/BrandMark.tsx` (SVG, gota estilizada) — usado como fallback quando o admin ainda não subiu uma logo própria pelo painel.
- Mais variações de logo e a paleta completa estão documentadas no projeto "Alex — Produtos de Limpeza" em [claude.ai/design](https://claude.ai/design).
