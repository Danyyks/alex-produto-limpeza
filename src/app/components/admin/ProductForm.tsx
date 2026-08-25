import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Camera, ImagePlus, Loader2 } from 'lucide-react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { resizeImageFile } from '../../lib/imageResize';
import { createProduct, newProductId, updateProduct, type ProductDoc } from '../../services/products';
import { deleteProductImage, isImageUploadConfigured, uploadProductImage } from '../../services/storage';

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  product?: ProductDoc;
}

export function ProductForm({ isOpen, onClose, onSaved, product }: ProductFormProps) {
  const isEditing = Boolean(product);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [active, setActive] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    setName(product?.name ?? '');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setActive(product?.active ?? true);
    setFile(null);
    setPreviewUrl(null);
    setError(null);
  }, [isOpen, product]);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const priceNumber = Number(price.replace(',', '.'));
    if (!name.trim() || !Number.isFinite(priceNumber) || priceNumber <= 0) {
      setError('Preencha nome e um preço válido.');
      return;
    }

    setIsSubmitting(true);
    try {
      const previousImagePath = product?.imagePath ?? null;

      if (file) {
        const id = product?.id ?? newProductId();
        setIsUploadingImage(true);
        let uploaded;
        try {
          const resized = await resizeImageFile(file);
          uploaded = await uploadProductImage(id, resized);
        } finally {
          setIsUploadingImage(false);
        }

        if (isEditing && product) {
          await updateProduct(product.id, {
            name,
            description,
            price: priceNumber,
            active,
            image: uploaded.url,
            imagePath: uploaded.path,
          });
          if (previousImagePath) await deleteProductImage(previousImagePath);
        } else {
          await createProduct(id, {
            name,
            description,
            price: priceNumber,
            active,
            image: uploaded.url,
            imagePath: uploaded.path,
          });
        }
      } else if (isEditing && product) {
        await updateProduct(product.id, { name, description, price: priceNumber, active });
      } else {
        const id = newProductId();
        await createProduct(id, {
          name,
          description,
          price: priceNumber,
          active,
          image: null,
          imagePath: null,
        });
      }

      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar o produto.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar produto' : 'Novo produto'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product-name" className="block mb-2 text-foreground">
            Nome
          </label>
          <input
            id="product-name"
            type="text"
            required
            placeholder="Ex: Detergente neutro 500ml"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="product-description" className="block mb-2 text-foreground">
            Descrição <span className="text-muted-foreground font-normal">(opcional)</span>
          </label>
          <textarea
            id="product-description"
            placeholder="Ex: Ideal para limpeza geral, rende até 3x mais"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary resize-none"
          />
        </div>

        <div>
          <label htmlFor="product-price" className="block mb-2 text-foreground">
            Preço (R$)
          </label>
          <input
            id="product-price"
            type="text"
            inputMode="decimal"
            required
            placeholder="Ex: 12,90"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <p className="block mb-2 text-foreground">
            Foto <span className="text-muted-foreground font-normal">(opcional)</span>
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="hidden"
          />
          {isImageUploadConfigured ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label={previewUrl || product?.image ? 'Trocar foto do produto' : 'Adicionar foto do produto'}
              className="relative w-32 h-32 rounded-2xl border-2 border-dashed border-border bg-muted overflow-hidden flex items-center justify-center hover:border-primary hover:bg-muted/70 transition-colors"
            >
              {previewUrl || product?.image ? (
                <>
                  <img
                    src={previewUrl ?? product?.image ?? ''}
                    alt="Pré-visualização da foto do produto"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-black/60 text-white text-xs font-medium py-1.5">
                    <Camera className="w-3.5 h-3.5" /> Trocar foto
                  </span>
                </>
              ) : (
                <span className="flex flex-col items-center gap-1.5 text-muted-foreground px-2 text-center">
                  <ImagePlus className="w-7 h-7" />
                  <span className="text-xs font-medium">Toque para adicionar foto</span>
                </span>
              )}
              {isUploadingImage && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-black/60 text-white text-xs font-medium">
                  <Loader2 className="w-5 h-5 animate-spin" /> Enviando foto…
                </span>
              )}
            </button>
          ) : (
            <p className="text-sm text-muted-foreground border border-dashed border-border rounded-2xl px-4 py-3">
              Upload de foto indisponível neste ambiente.
            </p>
          )}
          <p className="mt-2 text-xs text-muted-foreground">
            JPG ou PNG • a imagem é redimensionada automaticamente.
          </p>
        </div>

        <label className="flex items-center gap-2 text-foreground">
          <input
            type="checkbox"
            checked={active}
            onChange={(e) => setActive(e.target.checked)}
            className="w-4 h-4"
          />
          Ativo (visível na loja)
        </label>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
          {isUploadingImage ? 'Enviando foto…' : isSubmitting ? 'Salvando…' : 'Salvar produto'}
        </Button>
      </form>
    </Modal>
  );
}
