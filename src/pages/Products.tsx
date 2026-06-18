import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { FilterSelect } from "../components/Filters";
import { ProductCard } from "../components/ProductCard";
import { SearchBar } from "../components/SearchBar";
import { useData } from "../hooks/useData";
import { containsText, normalize } from "../utils/format";

export const Products = () => {
  const { businesses, products, categories, cities } = useData();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "Сите категории");
  const [city, setCity] = useState(searchParams.get("city") ?? "Сите градови");
  const [availability, setAvailability] = useState("Сите");
  const [sort, setSort] = useState("Најниска цена");

  const publicBusinessIds = useMemo(
    () => businesses.filter((business) => business.approved && business.active).map((business) => business.id),
    [businesses]
  );

  const results = useMemo(() => {
    const filtered = products
      .filter((product) => publicBusinessIds.includes(product.businessId))
      .filter((product) => {
        const business = businesses.find((candidate) => candidate.id === product.businessId);
        const searchSource = [product.name, product.category, product.city, product.description, business?.name ?? ""].join(" ");
        return containsText(searchSource, search);
      })
      .filter((product) => category === "Сите категории" || product.category === category)
      .filter((product) => city === "Сите градови" || product.city === city)
      .filter((product) => {
        if (availability === "Достапни") {
          return product.available;
        }
        if (availability === "Недостапни") {
          return !product.available;
        }
        return true;
      });

    return [...filtered].sort((first, second) => {
      if (sort === "Највисока цена") {
        return second.price - first.price;
      }
      if (sort === "Име А-Ш") {
        return first.name.localeCompare(second.name, "mk");
      }
      return first.price - second.price;
    });
  }, [availability, businesses, category, city, products, publicBusinessIds, search, sort]);

  const resetFilters = () => {
    setSearch("");
    setCategory("Сите категории");
    setCity("Сите градови");
    setAvailability("Сите");
    setSort("Најниска цена");
  };

  const hasActiveFilters =
    Boolean(normalize(search)) ||
    category !== "Сите категории" ||
    city !== "Сите градови" ||
    availability !== "Сите" ||
    sort !== "Најниска цена";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Локална понуда</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Производи и услуги</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Спореди цена, град, достапност и испрати барање директно до локалниот бизнис.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 xl:grid-cols-[1fr_190px_180px_170px_190px_auto] xl:items-end">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Пребарување</span>
            <SearchBar value={search} onChange={setSearch} placeholder="Производ, услуга или бизнис" />
          </div>
          <FilterSelect label="Категорија" value={category} onChange={setCategory} options={["Сите категории", ...categories]} />
          <FilterSelect label="Град" value={city} onChange={setCity} options={["Сите градови", ...cities]} />
          <FilterSelect label="Достапност" value={availability} onChange={setAvailability} options={["Сите", "Достапни", "Недостапни"]} />
          <FilterSelect label="Сортирање" value={sort} onChange={setSort} options={["Најниска цена", "Највисока цена", "Име А-Ш"]} />
          <button
            type="button"
            onClick={resetFilters}
            disabled={!hasActiveFilters}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-4 w-4" />
            Ресетирај
          </button>
        </div>
      </div>

      <p className="mb-5 text-sm font-bold text-slate-600">
        Пронајдени резултати: <span className="text-slate-950">{results.length}</span>
      </p>

      {results.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {results.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              business={businesses.find((business) => business.id === product.businessId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Нема производи за избраните филтри"
          description="Пробај со друга категорија, град или состојба на достапност."
        />
      )}
    </section>
  );
};
