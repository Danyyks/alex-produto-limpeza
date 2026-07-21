-- ─────────────────────────────────────────────────────────────
-- Dados de exemplo — Alex, Produtos de Limpeza
--
-- Rode isso DEPOIS do schema.sql. Estes são produtos genéricos
-- só para o site não ficar vazio — substitua pelos produtos
-- reais direto no Painel Admin do site (o admin pode adicionar,
-- editar e excluir qualquer item livremente).
-- ─────────────────────────────────────────────────────────────

insert into menu_items (name, description, price, category, active, sort_order) values
  -- Limpeza Geral
  ('Desinfetante Multiuso 1L', 'Elimina 99,9% dos germes. Fragrância lavanda.', 9.90, 'geral', true, 0),
  ('Detergente Neutro 500ml', 'Remove gordura sem agredir as mãos.', 3.50, 'geral', true, 1),
  ('Água Sanitária 1L', 'Alvejante e desinfetante multiuso.', 6.90, 'geral', true, 2),
  ('Limpador Multiuso 500ml', 'Uso geral em pisos, azulejos e superfícies.', 7.50, 'geral', true, 3),

  -- Lavanderia
  ('Sabão em Pó 1kg', 'Remove manchas difíceis, ação prolongada.', 14.90, 'lavanderia', true, 0),
  ('Amaciante Concentrado 2L', 'Perfume duradouro, rende até 40 lavagens.', 12.50, 'lavanderia', true, 1),
  ('Sabão em Barra (pacote c/5)', 'Ideal para pré-lavagem e tira-manchas.', 8.90, 'lavanderia', true, 2),

  -- Higiene & Descartáveis
  ('Papel Toalha (pacote c/2)', 'Alta absorção, folha dupla.', 8.50, 'higiene', true, 0),
  ('Luvas de Látex (par)', 'Proteção para limpeza pesada, tamanho M.', 4.90, 'higiene', true, 1),
  ('Álcool 70% 1L', 'Higienização de superfícies.', 11.90, 'higiene', true, 2),
  ('Sacos de Lixo 30L (pacote c/20)', 'Reforçado, resistente a vazamentos.', 9.90, 'higiene', true, 3),

  -- Kits & Combos
  ('Kit Limpeza Banheiro', 'Desinfetante + limpador de vaso + pano multiuso.', 24.90, 'kits', true, 0),
  ('Kit Limpeza Cozinha', 'Detergente + desengordurante + esponjas (3un).', 19.90, 'kits', true, 1),
  ('Kit Lavanderia Completo', 'Sabão em pó 1kg + amaciante 2L.', 26.90, 'kits', true, 2);
