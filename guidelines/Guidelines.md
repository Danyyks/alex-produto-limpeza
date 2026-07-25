# Guidelines — Alex, Produtos de Limpeza

Resumo das convenções deste projeto, para não se perder no código depois de um tempo parado.

## Marca e textos

Nome, subtítulo e textos de hero/footer ficam centralizados em `src/app/config/brand.ts`. Para trocar qualquer texto de marca, editar só ali — evite espalhar strings novas pelos componentes.

## Cores

Todas as cores da marca são tokens CSS em `src/styles/theme.css` (`:root` para modo claro, `.dark` para escuro), mapeados para classes Tailwind via `@theme inline`. Use sempre os tokens (`bg-primary`, `text-primary`, `bg-accent`, `text-muted-foreground`, `border-border` etc.) — nunca cores hardcoded tipo `bg-purple-500`. Para trocar a paleta inteira, basta editar as variáveis em `theme.css`.

Exceção: o botão de WhatsApp usa verde (`bg-green-500`) de propósito — é a cor oficial do WhatsApp, não da marca.

## Categorias de produto

Categorias ficam definidas em `src/app/config/categories.ts` (chave, rótulo exibido, ícone, e o `type Category`). Para adicionar uma categoria nova:
1. Adicionar a chave no `type Category`.
2. Adicionar a entrada em `CATEGORIES` com rótulo e ícone do `lucide-react`.
3. Adicionar a chave nova em `PRODUCTS` (`src/app/data/products.ts`), mesmo que com array vazio.

O restante (seções do catálogo) é gerado automaticamente a partir desse array — não precisa duplicar código em `App.tsx`.

## Catálogo (estado atual: dados fixos no código)

Não há banco de dados neste momento. Os produtos ficam em `src/app/data/products.ts`, servidos pelo hook `src/app/hooks/useMenuData.ts`. Para adicionar, editar ou remover um produto, editar esse arquivo diretamente e rodar `pnpm build` para conferir.

**Plano futuro**: migrar para Firebase (Firestore para os produtos, Auth para login do admin, Storage para upload de imagens) e trazer de volta um painel de administração via navegador. Quando isso acontecer, `useMenuData.ts` é o único lugar que precisa trocar a fonte dos dados — o resto do app (App.tsx, ProductCard, etc.) não depende de como os dados chegam.

## Checkout / WhatsApp

A mensagem é montada em `App.tsx` (`handleCheckout`), com nome do cliente, endereço, itens e total, e aberta via `window.location.href = "https://wa.me/<número>?text=..."`. O número vem de `VITE_WHATSAPP_NUMBER` no `.env`/na Vercel — nunca hardcoded no código. `handleCheckout` valida que o número existe antes de montar o link (mostra um alerta se faltar, em vez de abrir um `wa.me/undefined`).

Dois cuidados específicos, aprendidos com bugs reais em produção: usar sempre `window.location.href` (não `window.open`) — um PWA instalado em modo standalone não sabe abrir "nova aba", e o Android recusa o link; e evitar emojis fora do plano básico do Unicode (ex. 📍) na mensagem — o redirecionamento do próprio `wa.me` os corrompe. Detalhes em [SDD.md](../SDD.md#incidentes-conhecidos-2026-07-25).

## Tipos compartilhados

`MenuItem` fica em `src/app/types/menu.ts`. É usado pelo hook `useMenuData`, pelos dados estáticos em `products.ts` e pelo `ProductCard`.

## Deploy

O projeto está pronto para deploy na Vercel (`vercel.json` já configurado: build via `pnpm run build`, saída em `dist/`, rewrite de SPA). Não depende de nenhuma variável de ambiente além de `VITE_WHATSAPP_NUMBER` no momento.
