/**
 * Serviço do Cardápio
 *
 * CRUD completo para a tabela menu_items.
 * Cada função faz uma operação específica no banco de dados.
 *
 * Tipos de operação:
 * - fetchMenuItems  → Buscar (READ)
 * - createMenuItem  → Criar (CREATE)
 * - updateMenuItem  → Editar (UPDATE)
 * - deleteMenuItem  → Excluir (DELETE)
 *
 * Por que temos MenuItemRow e MenuItem?
 * - MenuItemRow: como o Supabase guarda (image_url, etc)
 * - MenuItem: como o frontend usa (image, etc)
 * - rowToMenuItem converte entre os dois formatos
 */
import { supabase } from '../lib/supabase';
import { MenuItem } from '../types/menu';

export type Category = 'geral' | 'lavanderia' | 'higiene' | 'kits';

// Representa uma linha exata da tabela no banco de dados
interface MenuItemRow {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: Category;
  active: boolean;
  sort_order: number;
}

// Converte linha do banco → objeto usado no frontend
function rowToMenuItem(row: MenuItemRow): MenuItem {
  return {
    id: row.id,
    name: row.name,
    description: row.description ?? undefined,
    price: Number(row.price),
    image: row.image_url ?? undefined,
    active: row.active,
  };
}

// ─────────────────────────────────────────────────────
// READ — Buscar todos os itens de uma categoria
// ─────────────────────────────────────────────────────

/**
 * Busca todos os itens de uma categoria ordenados pelo sort_order.
 * - Se o usuário não estiver logado (anon): só vê itens ativos (RLS)
 * - Se o admin estiver logado: vê todos, inclusive inativos (RLS)
 */
export async function fetchMenuItems(category: Category): Promise<MenuItem[]> {
  const { data, error } = await supabase
    .from('menu_items')
    .select('*')
    .eq('category', category)
    .order('sort_order', { ascending: true });

  if (error) throw error;
  return (data as MenuItemRow[]).map(rowToMenuItem);
}

// ─────────────────────────────────────────────────────
// CREATE — Criar novo item
// ─────────────────────────────────────────────────────

/**
 * Cria um novo produto no banco.
 * O id é gerado pelo Supabase (UUID automático).
 * Retorna o item criado com o id real do banco.
 */
export async function createMenuItem(
  item: Omit<MenuItem, 'id'>,
  category: Category,
  sortOrder = 0,
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      name: item.name,
      description: item.description || null,
      price: item.price,
      image_url: item.image || null,
      category,
      active: item.active,
      sort_order: sortOrder,
    })
    .select()
    .single(); // .single() porque esperamos apenas 1 linha de retorno

  if (error) throw error;
  return rowToMenuItem(data as MenuItemRow);
}

// ─────────────────────────────────────────────────────
// UPDATE — Atualizar item existente
// ─────────────────────────────────────────────────────

/**
 * Atualiza um produto pelo seu id.
 * Retorna o item atualizado.
 */
export async function updateMenuItem(
  item: MenuItem,
  category: Category,
): Promise<MenuItem> {
  const { data, error } = await supabase
    .from('menu_items')
    .update({
      name: item.name,
      description: item.description || null,
      price: item.price,
      image_url: item.image || null,
      category,
      active: item.active,
    })
    .eq('id', item.id)
    .select()
    .single();

  if (error) throw error;
  return rowToMenuItem(data as MenuItemRow);
}

// ─────────────────────────────────────────────────────
// DELETE — Excluir item
// ─────────────────────────────────────────────────────

/**
 * Remove um produto pelo id.
 * Nota: a imagem no Storage não é removida automaticamente.
 * Se quiser remover a imagem também, use deleteImage() do imageService.
 */
export async function deleteMenuItem(id: string): Promise<void> {
  const { error } = await supabase.from('menu_items').delete().eq('id', id);
  if (error) throw error;
}
