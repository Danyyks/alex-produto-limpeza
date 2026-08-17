import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '../Button';
import { Modal } from '../Modal';
import { resizeImageFile } from '../../lib/imageResize';
import { createProduct, newProductId, updateProduct, type ProductDoc } from '../../services/products';
import { deleteProductImage, uploadProductImage } from '../../services/storage';

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
  const [error, setError] = useState<string | null>(null);

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
        const resized = await resizeImageFile(file);
        const uploaded = await uploadProductImage(id, resized);

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
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="product-description" className="block mb-2 text-foreground">
            Descrição
          </label>
          <textarea
            id="product-description"
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
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div>
          <label htmlFor="product-image" className="block mb-2 text-foreground">
            Foto
          </label>
          <input
            id="product-image"
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm text-muted-foreground"
          />
          {(previewUrl || product?.image) && (
            <img
              src={previewUrl ?? product?.image ?? ''}
              alt="Pré-visualização"
              className="mt-3 w-24 h-24 object-cover rounded-xl border border-border"
            />
          )}
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
          {isSubmitting ? 'Salvando…' : 'Salvar produto'}
        </Button>
      </form>
    </Modal>
  );
}
