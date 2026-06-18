import { ArrowRight, BadgeCheck, Building2, ClipboardCheck, Search, ShoppingBag, Store } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BusinessCard } from "../components/BusinessCard";
import { CategoryCard } from "../components/CategoryCard";
import { ProductCard } from "../components/ProductCard";
import { useData } from "../hooks/useData";

export const Home = () => {
  const { businesses, products, categories, cities } = useData();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");

  const publicBusinesses = useMemo(
    () => businesses.filter((business) => business.active && business.approved),
    [businesses]
  );
  const featuredBusinesses = publicBusinesses.filter((business) => business.featured).slice(0, 4);
  const featuredProducts = products
    .filter((product) => product.featured && publicBusinesses.some((business) => business.id === product.businessId))
    .slice(0, 4);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set("search", search.trim());
    }
    if (city) {
      params.set("city", city);
    }
    navigate(`/businesses?${params.toString()}`);
  };

  return (
    <div>
      <section
        className="relative overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(2, 6, 23, 0.78), rgba(2, 6, 23, 0.38)), url('https://images.unsplash.com/photo-1534723452862-4c874018d66d?auto=format&fit=crop&w=1800&q=80')"
        }}
      >
        <div className="mx-auto grid min-h-[640px] max-w-7xl content-center gap-10 px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
              <BadgeCheck className="h-4 w-4 text-emerald-300" />
              Локални производи, услуги и брендови
            </span>
            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white sm:text-6xl">
              Откриј го најдоброто од твојата околина
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-100">
              Пронајди локални производи, услуги и бизниси на едно место.
            </p>
            <form onSubmit={handleSubmit} className="mt-8 grid max-w-4xl gap-3 rounded-3xl bg-white p-3 shadow-2xl md:grid-cols-[1fr_220px_auto]">
              <label className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Производ, услуга или бизнис"
                  className="h-14 w-full rounded-2xl border border-transparent bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-900 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
                />
              </label>
              <select
                value={city}
                onChange={(event) => setCity(event.target.value)}
                className="h-14 rounded-2xl border border-transparent bg-slate-50 px-4 text-sm font-semibold text-slate-700 outline-none focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              >
                <option value="">Сите градови</option>
                {cities.map((cityName) => (
                  <option key={cityName} value={cityName}>
                    {cityName}
                  </option>
                ))}
              </select>
              <button className="inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 text-sm font-black text-white transition hover:bg-emerald-700">
                Истражи
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/businesses"
                className="inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-black text-slate-950 transition hover:bg-emerald-50"
              >
                Истражи бизниси
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-full border border-white/40 px-5 py-3 text-sm font-black text-white transition hover:bg-white/15"
              >
                Регистрирај бизнис
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Store className="h-8 w-8 text-emerald-600" />
            <p className="mt-4 text-3xl font-black text-slate-950">{publicBusinesses.length}</p>
            <p className="text-sm font-semibold text-slate-600">локални бизниси</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <ShoppingBag className="h-8 w-8 text-emerald-600" />
            <p className="mt-4 text-3xl font-black text-slate-950">{products.length}</p>
            <p className="text-sm font-semibold text-slate-600">производи и услуги</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Building2 className="h-8 w-8 text-emerald-600" />
            <p className="mt-4 text-3xl font-black text-slate-950">{cities.length}</p>
            <p className="text-sm font-semibold text-slate-600">градови</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Популарни категории</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Започни од она што ти треба</h2>
          </div>
          <Link to="/businesses" className="text-sm font-black text-emerald-700 hover:text-emerald-800">
            Сите категории
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((category) => (
            <CategoryCard key={category} category={category} />
          ))}
        </div>
      </section>

      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Истакнати бизниси</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Места со добра локална приказна</h2>
            </div>
            <Link to="/businesses" className="text-sm font-black text-emerald-700 hover:text-emerald-800">
              Види бизниси
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featuredBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Истакнати производи</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Свеж избор од локалната понуда</h2>
          </div>
          <Link to="/products" className="text-sm font-black text-emerald-700 hover:text-emerald-800">
            Види производи
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              business={publicBusinesses.find((business) => business.id === product.businessId)}
            />
          ))}
        </div>
      </section>

      <section className="bg-emerald-700 py-14 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-100">Како функционира</p>
            <h2 className="mt-2 text-3xl font-black">Локално пребарување без комплицирање</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["Пребарај", "Пронајди производ, услуга или конкретен бизнис."],
              ["Спореди", "Провери цена, достапност, град и контакт."],
              ["Испрати барање", "Бизнисот го гледа барањето во својот dashboard."]
            ].map(([title, description]) => (
              <div key={title} className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
                <ClipboardCheck className="h-7 w-7 text-emerald-100" />
                <h3 className="mt-4 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-emerald-50">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-6 rounded-3xl border border-emerald-100 bg-white p-6 shadow-soft lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-emerald-700">За локални бизниси</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950">Креирај присуство без сопствен веб-сајт</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Додај профил, производи, работно време и контакт за купувачите полесно да те пронајдат.
            </p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center justify-center rounded-2xl bg-slate-950 px-6 py-4 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            Регистрирај бизнис
          </Link>
        </div>
      </section>
    </div>
  );
};
