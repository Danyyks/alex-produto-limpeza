import { useEffect, useState } from 'react';
import { ImagePlus, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { ProductForm } from '../../components/admin/ProductForm';
import { deleteProduct, getProducts, setProductActive, type ProductDoc } from '../../services/products';
import { deleteProductImage } from '../../services/storage';

export function AdminProductsPage() {
  const [products, setProducts] = useState<ProductDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductDoc | undefined>(undefined);

  const reload = async () => {
    setIsLoading(true);
    const productDocs = await getProducts();
    setProducts(productDocs);
    setIsLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const filtered = products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleDelete = async (product: ProductDoc) => {
    if (!window.confirm(`Excluir "${product.name}"? Essa ação não pode ser desfeita.`)) return;
    await deleteProduct(product.id);
    if (product.imagePath) await deleteProductImage(product.imagePath);
    await reload();
  };

  const handleToggleActive = async (product: ProductDoc) => {
    await setProductActive(product.id, !product.active);
    await reload();
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando produtos…</p>;
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-foreground">Produtos</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            onClick={() => {
              setEditingProduct(undefined);
              setFormOpen(true);
            }}
          >
            <Plus className="w-4 h-4" /> Novo produto
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Buscar por nome…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[200px] px-4 py-2.5 border border-border rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">Nenhum produto encontrado.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <div
              key={product.id}
              className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
            >
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0 flex items-center justify-center">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground">R$ {product.price.toFixed(2)}</p>
              </div>
              <label className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
                <input
                  type="checkbox"
                  checked={product.active}
                  onChange={() => handleToggleActive(product)}
                  className="w-4 h-4"
                />
                Ativo
              </label>
              <Button
                variant="tertiary"
                size="icon-sm"
                onClick={() => {
                  setEditingProduct(product);
                  setFormOpen(true);
                }}
                aria-label={`Editar ${product.name}`}
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="icon-sm"
                onClick={() => handleDelete(product)}
                aria-label={`Excluir ${product.name}`}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}

      <ProductForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
        product={editingProduct}
      />
    </div>
  );
}
