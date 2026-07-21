/**
 * Serviço de Imagens (Supabase Storage)
 *
 * Gerencia o upload e a remoção de imagens no bucket 'menu-images'.
 *
 * Como funciona:
 * 1. Admin seleciona uma foto no formulário
 * 2. uploadImage() envia o arquivo para o Supabase Storage
 * 3. Supabase retorna uma URL pública (ex: https://xxx.supabase.co/storage/...)
 * 4. Essa URL é salva no campo image_url da tabela menu_items
 * 5. O site carrega a imagem diretamente por essa URL
 */
import { supabase } from '../lib/supabase';

const BUCKET = 'menu-images';

/**
 * Faz upload de um arquivo para o Supabase Storage.
 * Retorna a URL pública da imagem.
 */
export async function uploadImage(file: File): Promise<string> {
  // Gera um nome de arquivo único para evitar colisões
  const ext = file.name.split('.').pop() ?? 'jpg';
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(filename, file, { upsert: false });

  if (error) throw error;

  // Pega a URL pública do arquivo recém-enviado
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(filename);
  return data.publicUrl;
}

/**
 * Remove uma imagem do Storage a partir da sua URL pública.
 * Se a URL não for do nosso bucket, ignora silenciosamente.
 */
export async function deleteImage(url: string): Promise<void> {
  // Extrai o caminho do arquivo a partir da URL pública
  const parts = url.split(`/${BUCKET}/`);
  if (parts.length < 2) return; // Não é uma imagem do nosso bucket

  const path = parts[1];
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) console.warn('[Storage] Erro ao deletar imagem:', error.message);
}
