import { useEffect, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Button } from '../Button';
import { CATEGORY_ICONS, CATEGORY_ICON_NAMES } from '../../config/categoryIcons';
import { createCategory, updateCategory, type CategoryDoc } from '../../services/categories';

interface CategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  nextOrder: number;
  category?: CategoryDoc;
}

export function CategoryForm({ isOpen, onClose, onSaved, nextOrder, category }: CategoryFormProps) {
  const isEditing = Boolean(category);
  const [label, setLabel] = useState('');
  const [icon, setIcon] = useState(CATEGORY_ICON_NAMES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    setLabel(category?.label ?? '');
    setIcon(category?.icon ?? CATEGORY_ICON_NAMES[0]);
    setError(null);
  }, [isOpen, category]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!label.trim()) {
      setError('Dê um nome pra categoria.');
      return;
    }

    setIsSubmitting(true);
    try {
      if (isEditing && category) {
        await updateCategory(category.id, { label: label.trim(), icon });
      } else {
        await createCategory({ label: label.trim(), icon, order: nextOrder });
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Não foi possível salvar a categoria.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 md:left-1/2 md:-translate-x-1/2 md:max-w-md bg-card rounded-2xl shadow-2xl z-50 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3>{isEditing ? 'Editar categoria' : 'Nova categoria'}</h3>
              <Button variant="tertiary" size="icon-sm" onClick={onClose} aria-label="Fechar">
                <X className="w-6 h-6" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category-label" className="block mb-2 text-foreground">
                  Nome
                </label>
                <input
                  id="category-label"
                  type="text"
                  required
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <span className="block mb-2 text-foreground">Ícone</span>
                <div className="grid grid-cols-5 gap-2">
                  {CATEGORY_ICON_NAMES.map((name) => {
                    const Icon = CATEGORY_ICONS[name];
                    const isSelected = name === icon;
                    return (
                      <button
                        key={name}
                        type="button"
                        onClick={() => setIcon(name)}
                        aria-label={name}
                        aria-pressed={isSelected}
                        className={`flex items-center justify-center rounded-xl p-3 border transition-colors ${
                          isSelected
                            ? 'bg-primary border-primary text-primary-foreground'
                            : 'bg-background border-border text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? 'Salvando…' : 'Salvar categoria'}
              </Button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
