import { useEffect, useState } from 'react';
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../components/Button';
import { CategoryForm } from '../../components/admin/CategoryForm';
import { CATEGORY_ICONS, DEFAULT_CATEGORY_ICON } from '../../config/categoryIcons';
import { deleteCategory, getCategories, reorderCategories, type CategoryDoc } from '../../services/categories';

export function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryDoc[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryDoc | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    setIsLoading(true);
    setCategories(await getCategories());
    setIsLoading(false);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (category: CategoryDoc) => {
    if (!window.confirm(`Excluir a categoria "${category.label}"?`)) return;
    setError(null);
    try {
      await deleteCategory(category.id);
      await reload();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível excluir a categoria.');
    }
  };

  const move = async (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;
    const reordered = [...categories];
    [reordered[index], reordered[targetIndex]] = [reordered[targetIndex], reordered[index]];
    setCategories(reordered);
    await reorderCategories(reordered.map((c) => c.id));
  };

  if (isLoading) {
    return <p className="text-muted-foreground">Carregando categorias…</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-foreground">Categorias</h2>
        <Button
          variant="primary"
          onClick={() => {
            setEditingCategory(undefined);
            setFormOpen(true);
          }}
        >
          <Plus className="w-4 h-4" /> Nova categoria
        </Button>
      </div>

      {error && <p className="text-sm text-destructive mb-4">{error}</p>}

      {categories.length === 0 ? (
        <p className="text-muted-foreground">Nenhuma categoria ainda.</p>
      ) : (
        <div className="space-y-3">
          {categories.map((category, index) => {
            const Icon = CATEGORY_ICONS[category.icon] ?? DEFAULT_CATEGORY_ICON;
            return (
              <div
                key={category.id}
                className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4"
              >
                <div className="bg-primary rounded-full p-2 shrink-0">
                  <Icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <p className="flex-1 text-foreground font-medium truncate">{category.label}</p>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="tertiary"
                    size="icon-sm"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    aria-label={`Mover ${category.label} pra cima`}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="tertiary"
                    size="icon-sm"
                    onClick={() => move(index, 1)}
                    disabled={index === categories.length - 1}
                    aria-label={`Mover ${category.label} pra baixo`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="tertiary"
                    size="icon-sm"
                    onClick={() => {
                      setEditingCategory(category);
                      setFormOpen(true);
                    }}
                    aria-label={`Editar ${category.label}`}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => handleDelete(category)}
                    aria-label={`Excluir ${category.label}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CategoryForm
        isOpen={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
        nextOrder={categories.length}
        category={editingCategory}
      />
    </div>
  );
}
