import { RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { BusinessCard } from "../components/BusinessCard";
import { EmptyState } from "../components/EmptyState";
import { FilterSelect } from "../components/Filters";
import { SearchBar } from "../components/SearchBar";
import { useData } from "../hooks/useData";
import { containsText, normalize } from "../utils/format";

export const Businesses = () => {
  const { businesses, categories, cities } = useData();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "Сите категории");
  const [city, setCity] = useState(searchParams.get("city") ?? "Сите градови");
  const [sort, setSort] = useState("Највисок рејтинг");

  const results = useMemo(() => {
    const filtered = businesses
      .filter((business) => business.approved && business.active)
      .filter((business) => {
        const searchSource = [
          business.name,
          business.category,
          business.city,
          business.description,
          business.keywords.join(" ")
        ].join(" ");
        return containsText(searchSource, search);
      })
      .filter((business) => category === "Сите категории" || business.category === category)
      .filter((business) => city === "Сите градови" || business.city === city);

    return [...filtered].sort((first, second) => {
      if (sort === "Име А-Ш") {
        return first.name.localeCompare(second.name, "mk");
      }
      if (sort === "Име Ш-А") {
        return second.name.localeCompare(first.name, "mk");
      }
      return second.rating - first.rating;
    });
  }, [businesses, category, city, search, sort]);

  const resetFilters = () => {
    setSearch("");
    setCategory("Сите категории");
    setCity("Сите градови");
    setSort("Највисок рејтинг");
  };

  const hasActiveFilters =
    Boolean(normalize(search)) || category !== "Сите категории" || city !== "Сите градови" || sort !== "Највисок рејтинг";

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Локален каталог</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Бизниси</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          Пребарај продавници, производители, занаетчии и услуги по град или категорија.
        </p>
      </div>

      <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px_220px_auto] lg:items-end">
          <div>
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-slate-500">Пребарување</span>
            <SearchBar value={search} onChange={setSearch} placeholder="Име, производ или клучен збор" />
          </div>
          <FilterSelect label="Категорија" value={category} onChange={setCategory} options={["Сите категории", ...categories]} />
          <FilterSelect label="Град" value={city} onChange={setCity} options={["Сите градови", ...cities]} />
          <FilterSelect
            label="Сортирање"
            value={sort}
            onChange={setSort}
            options={["Највисок рејтинг", "Име А-Ш", "Име Ш-А"]}
          />
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

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-slate-600">
          Пронајдени резултати: <span className="text-slate-950">{results.length}</span>
        </p>
      </div>

      {results.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {results.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Нема бизниси за избраните филтри"
          description="Пробај со друг град, категорија или пократок збор за пребарување."
        />
      )}
    </section>
  );
};
