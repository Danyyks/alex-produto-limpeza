# PRD — Alex, Produtos de Limpeza

Documento de produto. Para arquitetura técnica, ver [SDD.md](SDD.md); para convenções de código, ver [CLAUDE.md](CLAUDE.md).

## Problema / contexto

Lojas de produtos de limpeza de bairro costumam receber pedidos manualmente pelo WhatsApp (cliente manda mensagem de texto livre, lojista organiza o pedido "de cabeça"). Isso gera erros de anotação, demora na resposta e nenhuma padronização de itens/preços. O Alex resolve isso oferecendo um catálogo online simples que **monta a mensagem do pedido automaticamente**, mantendo o WhatsApp como canal final de confirmação — sem exigir que a loja adote um sistema de pagamento ou gestão complexo.

## Público-alvo

- **Cliente final**: pessoa que já compra da loja pelo WhatsApp e quer montar o pedido de forma mais rápida e visual, sem digitar cada item manualmente.
- **Lojista**: pequeno comércio de produtos de limpeza que já usa WhatsApp para vender e quer profissionalizar o atendimento sem trocar de canal de venda.

## Proposta de valor

- Catálogo visual organizado por categoria, sem necessidade de cadastro/senha (só o nome).
- Pedido chega pronto e formatado no WhatsApp da loja — sem digitação manual do cliente.
- Instalável como app (PWA) no celular, com ícone próprio, funcionando como um atalho nativo sem precisar de loja de aplicativos.

## Funcionalidades atuais

1. **Login simples** — cliente informa apenas o nome (sem senha, sem cadastro).
2. **Catálogo por categoria** — Limpeza Geral, Lavanderia, Higiene & Descartáveis, Kits & Combos.
3. **Carrinho** — adicionar item com quantidade e observações, editar quantidade, remover item.
4. **Checkout via WhatsApp** — cliente informa endereço de entrega; app monta mensagem com todos os itens, quantidades, observações e total, e abre o WhatsApp da loja com o texto pronto.
5. **PWA instalável** — manifest e ícones próprios (192/512/maskable/apple-touch-icon), instalável na tela inicial do celular ou desktop, com service worker para carregamento rápido.
6. **Tema claro/escuro** — alternância manual no header, respeitando a preferência do sistema operacional por padrão e lembrando a escolha do usuário entre visitas.

## Fluxo do usuário

1. Cliente abre o link/app instalado.
2. Informa o nome (tela de login simples).
3. Navega pelo catálogo, filtra visualmente por categoria.
4. Ao adicionar um produto, escolhe quantidade e pode incluir observação (ex: "sem perfume").
5. Abre o carrinho, revisa itens, ajusta quantidades.
6. Informa o endereço de entrega e confirma.
7. App abre o WhatsApp da loja com a mensagem do pedido já formatada — cliente só confirma o envio.

## Fora de escopo hoje

- Pagamento online (o pagamento é combinado depois, fora do app).
- Rastreamento de status do pedido (o pedido "sai" do app assim que vai para o WhatsApp).
- Painel de administração para o lojista editar produtos pela interface (hoje é feito editando código-fonte).
- Conta de usuário persistente (o "login" não autentica nada, é só personalização da saudação).

## Roadmap

- **Curto prazo** (em andamento): substituir fotos de exemplo (Unsplash) pelas fotos reais dos produtos da loja — fotos próprias entram em `public/products/` e são referenciadas em `products.ts` (ex: Álcool Gel 70%).
- **Médio prazo**: integrar **Firebase** — Firestore para catálogo dinâmico (parar de editar `products.ts` no código), Auth para login do lojista, Storage para upload de imagens dos produtos.
- **Médio/longo prazo**: trazer de volta um **painel de administração** simples (CRUD de produtos, ativar/desativar itens) uma vez que o Firebase estiver integrado.
