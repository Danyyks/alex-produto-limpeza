/**
 * Painel Admin
 *
 * Versão com Supabase: cada aba busca e salva dados diretamente no banco.
 * Não precisa mais receber os dados como props do App.tsx.
 *
 * Mudanças em relação à versão localStorage:
 * - CategoryTab: busca seus próprios dados no mount
 * - Operações são async (add/edit/delete viram chamadas ao Supabase)
 * - Imagens: upload para Supabase Storage em vez de base64
 * - ProfileTab: salva logo_url na tabela site_profile
 * - Feedback de loading e erro em cada operação
 */
import { useState, useEffect, useRef } from 'react';
import {
  LogOut,
  Plus,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Upload,
  ChevronLeft,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { MenuItem } from '../../types/menu';
import {
  fetchMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  Category,
} from '../../services/menuService';
import { fetchProfile, saveProfile } from '../../services/profileService';
import { uploadImage } from '../../services/imageService';
import { signOut } from '../../services/authService';
import { CATEGORIES } from '../../config/categories';
import { BRAND_NAME } from '../../config/brand';

// ─────────────────────────────────────────
// Tipos
// ─────────────────────────────────────────
type Tab = 'profile' | Category;

interface AdminPanelProps {
  /** Chamado quando o admin clica em Sair */
  onLogout: () => void;
}

// ─────────────────────────────────────────
// Painel Admin Principal
// ─────────────────────────────────────────
export function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>(CATEGORIES[0].key);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'profile', label: 'Perfil' },
    ...CATEGORIES.map((c) => ({ key: c.key as Tab, label: c.label })),
  ];

  const handleLogout = async () => {
    await signOut(); // Limpa a sessão do Supabase
    onLogout();
  };

  return (
    <div className="fixed inset-0 bg-background z-[100] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
        <h2 className="text-base font-semibold tracking-tight">
          Painel Admin — {BRAND_NAME}
        </h2>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sair
        </button>
      </div>

      {/* Tabs */}
      <div className="bg-muted border-b border-border flex shrink-0 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
              activeTab === tab.key
                ? 'border-primary text-primary bg-card'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-card/50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Conteúdo da aba */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'profile' && <ProfileTab />}
        {CATEGORIES.map(
          (c) =>
            activeTab === c.key && (
              <CategoryTab
                key={c.key}
                title={c.label}
                category={c.key}
                hasImage
                hasDescription
              />
            ),
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Aba: Perfil
// ─────────────────────────────────────────
function ProfileTab() {
  const [preview, setPreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Carrega o logo atual do banco
  useEffect(() => {
    fetchProfile()
      .then((p) => setPreview(p?.logo ?? ''))
      .catch(() => setError('Erro ao carregar perfil.'))
      .finally(() => setLoading(false));
  }, []);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // Mostra preview local antes do upload
    setPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      let logoUrl = preview;

      // Se o admin escolheu um novo arquivo, faz upload primeiro
      if (imageFile) {
        logoUrl = await uploadImage(imageFile);
        setImageFile(null);
      }

      await saveProfile({ logo: logoUrl });
      setPreview(logoUrl);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-md mx-auto p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">
        Logo do Estabelecimento
      </h3>

      <div className="mb-6 flex justify-center">
        <div className="w-40 h-48 border-2 border-dashed border-border rounded-xl overflow-hidden flex items-center justify-center bg-muted">
          {preview ? (
            <img
              src={preview}
              alt="Logo"
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-muted-foreground text-sm">Sem imagem</span>
          )}
        </div>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      <input
        type="file"
        accept="image/*"
        ref={fileRef}
        onChange={handleFile}
        className="hidden"
      />

      <div className="flex gap-3">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={saving}
          className="flex-1 flex items-center justify-center gap-2 border border-border hover:border-muted-foreground text-foreground py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          Selecionar imagem
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
            saved
              ? 'bg-green-500 text-white'
              : 'bg-primary hover:bg-primary/90 text-primary-foreground'
          }`}
        >
          {saving && <Loader2 className="w-4 h-4 animate-spin" />}
          {saved ? 'Salvo!' : saving ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Aba genérica: Lanches / Combos / Bebidas
// ─────────────────────────────────────────
interface CategoryTabProps {
  title: string;
  category: Category;
  hasImage: boolean;
  hasDescription: boolean;
}

function CategoryTab({
  title,
  category,
  hasImage,
  hasDescription,
}: CategoryTabProps) {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  // Carrega os itens desta categoria do Supabase
  useEffect(() => {
    setLoading(true);
    fetchMenuItems(category)
      .then(setItems)
      .catch(() => setError('Erro ao carregar itens.'))
      .finally(() => setLoading(false));
  }, [category]);

  // Ativa/desativa um item (atualiza no banco imediatamente)
  const handleToggleActive = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    const toggled = { ...item, active: !item.active };

    // Atualização otimista: atualiza na tela antes da resposta do banco
    setItems((prev) => prev.map((i) => (i.id === id ? toggled : i)));

    try {
      await updateMenuItem(toggled, category);
    } catch {
      // Se falhou, reverte para o estado anterior
      setItems((prev) => prev.map((i) => (i.id === id ? item : i)));
      setError('Erro ao atualizar item.');
    }
  };

  // Exclui um item
  const handleDelete = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este item?')) return;

    const backup = [...items];
    setItems((prev) => prev.filter((i) => i.id !== id));

    try {
      await deleteMenuItem(id);
    } catch {
      setItems(backup);
      setError('Erro ao excluir item.');
    }
  };

  // Abre o formulário de edição
  const handleEdit = (item: MenuItem) => {
    setEditingItem({ ...item });
    setIsAdding(false);
  };

  // Abre o formulário de novo item (com valores padrão)
  const handleAdd = () => {
    setEditingItem({
      id: '',
      name: '',
      description: '',
      price: 0,
      image: undefined,
      active: true,
    });
    setIsAdding(true);
  };

  // Salva o formulário (cria ou atualiza)
  const handleFormSave = async (item: MenuItem, imageFile?: File) => {
    setSaving(true);
    setError('');
    try {
      let imageUrl = item.image;

      // Se selecionou um novo arquivo de imagem, faz upload para o Storage
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const itemWithImage = { ...item, image: imageUrl };

      if (isAdding) {
        // CRIAR: gera um novo UUID no banco
        const created = await createMenuItem(itemWithImage, category, items.length);
        setItems((prev) => [...prev, created]);
      } else {
        // ATUALIZAR: usa o id existente
        const updated = await updateMenuItem(itemWithImage, category);
        setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      }

      setEditingItem(null);
      setIsAdding(false);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro ao salvar item.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleFormCancel = () => {
    setEditingItem(null);
    setIsAdding(false);
  };

  // Modo de formulário (adicionar ou editar)
  if (editingItem) {
    return (
      <ItemForm
        item={editingItem}
        isNew={isAdding}
        hasImage={hasImage}
        hasDescription={hasDescription}
        saving={saving}
        errorMessage={error}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />
    );
  }

  if (loading) return <LoadingSpinner />;

  // Modo lista
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <button
          onClick={handleAdd}
          className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <Plus className="w-4 h-4" />
          Adicionar
        </button>
      </div>

      {error && <ErrorMessage message={error} className="mb-4" />}

      {items.length === 0 && (
        <p className="text-muted-foreground text-center py-16 text-sm">
          Nenhum item cadastrado. Clique em "Adicionar" para começar.
        </p>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 flex items-center gap-4 transition-opacity ${
              item.active
                ? 'border-border bg-card'
                : 'border-border bg-muted opacity-50'
            }`}
          >
            {hasImage && (
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                    —
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{item.name}</p>
              <p className="text-primary text-sm font-medium">
                R$ {item.price.toFixed(2)}
              </p>
              {!item.active && (
                <span className="text-xs text-muted-foreground">Desativado</span>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                onClick={() => handleToggleActive(item.id)}
                title={item.active ? 'Desativar' : 'Ativar'}
                className={`p-2 rounded-lg transition-colors ${
                  item.active
                    ? 'text-green-600 hover:bg-green-50'
                    : 'text-muted-foreground hover:bg-muted'
                }`}
              >
                {item.active ? (
                  <Eye className="w-4 h-4" />
                ) : (
                  <EyeOff className="w-4 h-4" />
                )}
              </button>
              <button
                onClick={() => handleEdit(item)}
                className="p-2 text-accent hover:bg-accent/10 rounded-lg transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
                className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// Formulário de item (adicionar / editar)
// ─────────────────────────────────────────
interface ItemFormProps {
  item: MenuItem;
  isNew: boolean;
  hasImage: boolean;
  hasDescription: boolean;
  saving: boolean;
  errorMessage: string;
  onSave: (item: MenuItem, imageFile?: File) => void;
  onCancel: () => void;
}

function ItemForm({
  item,
  isNew,
  hasImage,
  hasDescription,
  saving,
  errorMessage,
  onSave,
  onCancel,
}: ItemFormProps) {
  const [form, setForm] = useState<MenuItem>({ ...item });
  const [imageFile, setImageFile] = useState<File | undefined>();
  // preview: mostra a imagem atual ou a nova selecionada localmente
  const [preview, setPreview] = useState<string | undefined>(item.image);
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    // Mostra preview local imediato sem fazer upload ainda
    setPreview(URL.createObjectURL(file));
  };

  const validate = (): boolean => {
    const errs: { name?: string; price?: string } = {};
    if (!form.name.trim()) errs.name = 'Nome é obrigatório.';
    if (!form.price || form.price <= 0)
      errs.price = 'Preço deve ser maior que zero.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Passa o item E o arquivo (se houver) para o pai tratar o upload
    onSave({ ...form, name: form.name.trim(), image: preview }, imageFile);
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Voltar"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold text-foreground">
          {isNew ? 'Novo item' : 'Editar item'}
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Imagem */}
        {hasImage && (
          <div>
            <label className="block text-sm text-foreground mb-2">Imagem</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                {preview ? (
                  <img
                    src={preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-muted-foreground text-xs">Sem foto</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                disabled={saving}
                className="flex items-center gap-1.5 border border-border hover:border-muted-foreground text-foreground px-3 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                {preview ? 'Trocar foto' : 'Selecionar foto'}
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileRef}
              onChange={handleImageChange}
              className="hidden"
            />
          </div>
        )}

        {/* Nome */}
        <div>
          <label className="block text-sm text-foreground mb-1">
            Nome <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            disabled={saving}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 ${
              errors.name ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.name && (
            <p className="text-destructive text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* Descrição */}
        {hasDescription && (
          <div>
            <label className="block text-sm text-foreground mb-1">
              Descrição
            </label>
            <textarea
              value={form.description ?? ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              rows={3}
              disabled={saving}
              placeholder="Modo de uso, volume, detalhes..."
              className="w-full px-3 py-2.5 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm resize-none disabled:opacity-50"
            />
          </div>
        )}

        {/* Preço */}
        <div>
          <label className="block text-sm text-foreground mb-1">
            Preço (R$) <span className="text-destructive">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.price || ''}
            onChange={(e) =>
              setForm((f) => ({
                ...f,
                price: parseFloat(e.target.value) || 0,
              }))
            }
            disabled={saving}
            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm disabled:opacity-50 ${
              errors.price ? 'border-destructive' : 'border-border'
            }`}
          />
          {errors.price && (
            <p className="text-destructive text-xs mt-1">{errors.price}</p>
          )}
        </div>

        {/* Ativo */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="item-active"
            checked={form.active}
            onChange={(e) =>
              setForm((f) => ({ ...f, active: e.target.checked }))
            }
            disabled={saving}
            className="w-4 h-4 accent-primary cursor-pointer"
          />
          <label
            htmlFor="item-active"
            className="text-sm text-foreground cursor-pointer"
          >
            Item ativo (visível para clientes)
          </label>
        </div>

        {errorMessage && (
          <ErrorMessage message={errorMessage} />
        )}

        {/* Botões */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={saving}
            className="flex-1 border border-border hover:border-muted-foreground text-foreground py-2.5 rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground py-2.5 rounded-lg text-sm font-medium transition-colors disabled:opacity-60"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {saving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </form>
    </div>
  );
}

// ─────────────────────────────────────────
// Componentes auxiliares
// ─────────────────────────────────────────

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center py-20">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );
}

function ErrorMessage({
  message,
  className = '',
}: {
  message: string;
  className?: string;
}) {
  return (
    <div
      className={`flex items-center gap-2 text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 text-sm ${className}`}
    >
      <AlertCircle className="w-4 h-4 shrink-0" />
      {message}
    </div>
  );
}
