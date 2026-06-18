import { Edit3, Plus, Power, Trash2 } from "lucide-react";
import { useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { Modal } from "../components/Modal";
import { ProductForm } from "../components/ProductForm";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { Product, ProductFormValues } from "../types";
import { formatCurrency } from "../utils/format";

export const DashboardProducts = () => {
  const { currentUser } = useAuth();
  const { businesses, products, categories, addProduct, updateProduct, deleteProduct, toggleProductAvailability } = useData();
  const { showToast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);
  const business = businesses.find(
    (candidate) => candidate.id === currentUser?.businessId || candidate.ownerId === currentUser?.id
  );

  if (!business) {
    return <EmptyState title="Нема поврзан бизнис" description="Овој профил нема активен бизнис запис." />;
  }

  const businessProducts = products.filter((product) => product.businessId === business.id);

  const openCreate = () => {
    setEditingProduct(undefined);
    setIsModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleSubmit = (values: ProductFormValues) => {
    if (editingProduct) {
      updateProduct(editingProduct.id, values);
      showToast("Производот е ажуриран.");
    } else {
      addProduct(business.id, values);
      showToast("Производот е додаден.");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Да се избрише производот „${product.name}“?`)) {
      deleteProduct(product.id);
      showToast("Производот е избришан.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Понуда</p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">Производи</h1>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Додај производ
        </button>
      </div>

      {businessProducts.length ? (
        <div className="grid gap-4">
          {businessProducts.map((product) => (
            <article key={product.id} className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm lg:grid-cols-[120px_1fr_auto] lg:items-center">
              <img src={product.imageUrl} alt={product.name} className="h-28 w-full rounded-2xl object-cover lg:w-28" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                    {product.category}
                  </span>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${product.available ? "bg-emerald-100 text-emerald-800" : "bg-slate-900 text-white"}`}>
                    {product.available ? "Достапно" : "Недостапно"}
                  </span>
                  {product.featured ? (
                    <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-bold text-amber-800">Истакнато</span>
                  ) : null}
                </div>
                <h2 className="mt-3 text-xl font-black text-slate-950">{product.name}</h2>
                <p className="mt-1 text-sm font-bold text-emerald-700">{formatCurrency(product.price)}</p>
                <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{product.description}</p>
              </div>
              <div className="flex flex-wrap gap-2 lg:justify-end">
                <button
                  type="button"
                  onClick={() => toggleProductAvailability(product.id)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
                >
                  <Power className="h-4 w-4" />
                  {product.available ? "Исклучи" : "Вклучи"}
                </button>
                <button
                  type="button"
                  onClick={() => openEdit(product)}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                >
                  <Edit3 className="h-4 w-4" />
                  Уреди
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(product)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-bold text-rose-700 transition hover:bg-rose-50"
                >
                  <Trash2 className="h-4 w-4" />
                  Избриши
                </button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="Нема производи" description="Додај прв производ или услуга во понудата." />
      )}

      <Modal
        title={editingProduct ? "Уреди производ" : "Додај производ"}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      >
        <ProductForm
          categories={categories}
          initialProduct={editingProduct}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};
