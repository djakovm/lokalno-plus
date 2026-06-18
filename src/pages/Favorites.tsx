import { Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { BusinessCard } from "../components/BusinessCard";
import { EmptyState } from "../components/EmptyState";
import { ProductCard } from "../components/ProductCard";
import { useData } from "../hooks/useData";

export const Favorites = () => {
  const { businesses, products, favorites } = useData();
  const [tab, setTab] = useState<"businesses" | "products">("businesses");

  const favoriteBusinesses = useMemo(
    () => businesses.filter((business) => favorites.businessIds.includes(business.id)),
    [businesses, favorites.businessIds]
  );
  const favoriteProducts = useMemo(
    () => products.filter((product) => favorites.productIds.includes(product.id)),
    [favorites.productIds, products]
  );

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
          <Heart className="h-4 w-4 fill-current" />
          Зачувани избори
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Омилени</h1>
      </div>

      <div className="mb-6 inline-flex rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
        <button
          type="button"
          onClick={() => setTab("businesses")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            tab === "businesses" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Омилени бизниси ({favoriteBusinesses.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("products")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            tab === "products" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-50"
          }`}
        >
          Омилени производи ({favoriteProducts.length})
        </button>
      </div>

      {tab === "businesses" ? (
        favoriteBusinesses.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {favoriteBusinesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Немаш омилени бизниси"
            description="Додај бизниси во омилени за побрз пристап до нивните профили."
          />
        )
      ) : favoriteProducts.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {favoriteProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              business={businesses.find((business) => business.id === product.businessId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Немаш омилени производи"
          description="Зачувај производи и услуги што сакаш да ги провериш повторно."
        />
      )}
    </section>
  );
};
