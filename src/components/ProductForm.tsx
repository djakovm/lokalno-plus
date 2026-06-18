import { Save } from "lucide-react";
import { useState } from "react";
import type { Product, ProductFormValues } from "../types";

interface ProductFormProps {
  categories: string[];
  initialProduct?: Product;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
}

const defaultValues: ProductFormValues = {
  name: "",
  category: "Храна и пијалаци",
  description: "",
  price: 0,
  imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=900&q=80",
  available: true,
  featured: false
};

export const ProductForm = ({ categories, initialProduct, onSubmit, onCancel }: ProductFormProps) => {
  const [values, setValues] = useState<ProductFormValues>(
    initialProduct
      ? {
          name: initialProduct.name,
          category: initialProduct.category,
          description: initialProduct.description,
          price: initialProduct.price,
          imageUrl: initialProduct.imageUrl,
          available: initialProduct.available,
          featured: initialProduct.featured
        }
      : { ...defaultValues, category: categories[0] ?? defaultValues.category }
  );

  const updateText = (field: keyof Pick<ProductFormValues, "name" | "category" | "description" | "imageUrl">, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Име на производ</span>
          <input
            required
            value={values.name}
            onChange={(event) => updateText("name", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Категорија</span>
          <select
            value={values.category}
            onChange={(event) => updateText("category", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Опис</span>
        <textarea
          required
          rows={4}
          value={values.description}
          onChange={(event) => updateText("description", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Цена во денари</span>
          <input
            required
            min={0}
            type="number"
            value={values.price}
            onChange={(event) => setValues((current) => ({ ...current, price: Number(event.target.value) }))}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">URL на слика</span>
          <input
            required
            value={values.imageUrl}
            onChange={(event) => updateText("imageUrl", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={values.available}
            onChange={(event) => setValues((current) => ({ ...current, available: event.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Достапно
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700">
          <input
            type="checkbox"
            checked={values.featured}
            onChange={(event) => setValues((current) => ({ ...current, featured: event.target.checked }))}
            className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
          />
          Истакнат производ
        </label>
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
        >
          Откажи
        </button>
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          <Save className="h-4 w-4" />
          Зачувај
        </button>
      </div>
    </form>
  );
};
