import { Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { BusinessProfileValues } from "../types";

export const DashboardProfile = () => {
  const { currentUser } = useAuth();
  const { businesses, categories, cities, updateBusiness } = useData();
  const { showToast } = useToast();
  const business = businesses.find(
    (candidate) => candidate.id === currentUser?.businessId || candidate.ownerId === currentUser?.id
  );

  const [values, setValues] = useState<BusinessProfileValues>(() => ({
    name: business?.name ?? "",
    category: business?.category ?? categories[0] ?? "Храна и пијалаци",
    description: business?.description ?? "",
    city: business?.city ?? cities[0] ?? "Скопје",
    address: business?.address ?? "",
    phone: business?.phone ?? "",
    email: business?.email ?? "",
    hours: business?.hours ?? "",
    logoUrl: business?.logoUrl ?? "",
    coverUrl: business?.coverUrl ?? ""
  }));

  if (!business) {
    return <EmptyState title="Нема поврзан бизнис" description="Овој профил нема активен бизнис запис." />;
  }

  const updateValue = (field: keyof BusinessProfileValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateBusiness(business.id, values);
    showToast("Профилот е зачуван.");
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Уредување</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Бизнис профил</h1>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Име на бизнис</span>
            <input
              required
              value={values.name}
              onChange={(event) => updateValue("name", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Категорија</span>
            <select
              value={values.category}
              onChange={(event) => updateValue("category", event.target.value)}
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
        <label className="mt-4 block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Опис</span>
          <textarea
            required
            rows={5}
            value={values.description}
            onChange={(event) => updateValue("description", event.target.value)}
            className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Град</span>
            <select
              value={values.city}
              onChange={(event) => updateValue("city", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            >
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Адреса</span>
            <input
              required
              value={values.address}
              onChange={(event) => updateValue("address", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Телефон</span>
            <input
              required
              value={values.phone}
              onChange={(event) => updateValue("phone", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Е-пошта</span>
            <input
              required
              type="email"
              value={values.email}
              onChange={(event) => updateValue("email", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Работно време</span>
            <input
              required
              value={values.hours}
              onChange={(event) => updateValue("hours", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Лого URL</span>
            <input
              required
              value={values.logoUrl}
              onChange={(event) => updateValue("logoUrl", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">URL за насловна слика</span>
            <input
              required
              value={values.coverUrl}
              onChange={(event) => updateValue("coverUrl", event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>
        <button
          type="submit"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          <Save className="h-4 w-4" />
          Зачувај профил
        </button>
      </form>
    </div>
  );
};
