# Guidelines — Alex, Produtos de Limpeza

Resumo das convenções deste projeto, para não se perder no código depois de um tempo parado.

## Marca e textos

Nome, subtítulo e textos de hero/footer ficam centralizados em `src/app/config/brand.ts`. Para trocar qualquer texto de marca, editar só ali — evite espalhar strings novas pelos componentes.

## Cores

Todas as cores da marca são tokens CSS em `src/styles/theme.css` (`:root` para modo claro, `.dark` para escuro), mapeados para classes Tailwind via `@theme inline`. Use sempre os tokens (`bg-primary`, `text-primary`, `bg-accent`, `text-muted-foreground`, `border-border` etc.) — nunca cores hardcoded tipo `bg-purple-500`. Para trocar a paleta inteira, basta editar as variáveis em `theme.css`.

Exceção: o botão de WhatsApp usa verde (`bg-green-500`) de propósito — é a cor oficial do WhatsApp, não da marca.

## Categorias de produto

Categorias ficam definidas em `src/app/config/categories.ts` (chave, rótulo exibido, ícone) e no `type Category` de `src/app/services/menuService.ts`. Para adicionar uma categoria nova:
1. Adicionar a chave no `type Category`.
2. Adicionar a entrada em `CATEGORIES` (categories.ts) com rótulo e ícone do `lucide-react`.
3. Atualizar o `check` de `category` em `supabase/schema.sql` para incluir a nova chave.

O restante (seções do catálogo, abas do admin) é gerado automaticamente a partir desse array — não precisa duplicar código em `App.tsx` ou `AdminPanel.tsx`.

## Fluxo de dados

```
Supabase (menu_items, site_profile)
  → services/menuService.ts, profileService.ts (CRUD)
    → hooks/useMenuData.ts (busca tudo em paralelo, expõe refresh())
      → App.tsx (estado do carrinho/login) e admin/AdminPanel.tsx (CRUD via UI)
```

O RLS do Supabase já filtra itens inativos para visitantes anônimos; o frontend filtra de novo por segurança (`item.active`).

## Checkout / WhatsApp

A mensagem é montada em `App.tsx` (`handleCheckout`), com nome do cliente, endereço, itens e total, e aberta via `https://wa.me/<número>?text=...`. O número vem de `VITE_WHATSAPP_NUMBER` no `.env` — nunca hardcoded no código.

## Tipos compartilhados

`MenuItem` e `SiteProfile` ficam em `src/app/types/menu.ts`. São usados pelos services, pelo hook `useMenuData` e pelo `AdminPanel`.

## Banco de dados

Não há CLI/migrations do Supabase neste projeto — `supabase/schema.sql` e `supabase/seed.sql` rodam manualmente no SQL Editor. Se alterar a estrutura do banco (nova coluna, nova tabela), atualizar o `schema.sql` também, para o arquivo continuar sendo a fonte de verdade reproduzível.
