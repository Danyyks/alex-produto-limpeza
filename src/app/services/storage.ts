/**
 * Upload de foto de produto via Cloudinary (não Firebase Storage — esse exige o
 * plano pago Blaze, que a loja optou por não assinar). Upload direto do navegador
 * usando um "unsigned upload preset", sem precisar de nenhum backend próprio.
 */
const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME as string | undefined;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET as string | undefined;

/**
 * Prefixo fixo de pasta no Cloudinary — deliberadamente separado de BRAND_NAME
 * (que já mudou duas vezes, Alex → RB Clean → NA Clean, e pode mudar de novo).
 * Existe pra manter os assets deste projeto isolados caso a mesma conta Cloudinary
 * seja reaproveitada por outro projeto no futuro — nunca mudar depois de definido,
 * senão os uploads antigos ficam "perdidos" num prefixo diferente dos novos.
 */
const PROJECT_FOLDER = 'rb-clean';

export const isImageUploadConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET);

export async function uploadProductImage(
  productId: string,
  file: File,
): Promise<{ url: string; path: string }> {
  if (!isImageUploadConfigured) {
    throw new Error('Upload de foto não está configurado neste ambiente.');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', UPLOAD_PRESET!);
  formData.append('folder', `${PROJECT_FOLDER}/products/${productId}`);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Não foi possível enviar a imagem. Tente novamente.');
  }

  const data = await response.json();
  return { url: data.secure_url as string, path: data.public_id as string };
}

/**
 * Excluir um asset do Cloudinary exige uma chamada assinada com a API Secret —
 * uma credencial que não pode ficar no client (o app não tem backend próprio pra
 * guardá-la). Por isso esta função é um no-op deliberado: trocar/excluir a foto
 * de um produto deixa o arquivo antigo órfão no Cloudinary. Aceitável pelo volume
 * de fotos de uma loja pequena dentro do plano gratuito; um backend futuro (ex.
 * Cloud Function) poderia usar o `path` (public_id) salvo em cada produto pra
 * fazer a limpeza de verdade.
 */
export async function deleteProductImage(_path: string) {
  // Sem-op intencional — ver comentário acima.
}
