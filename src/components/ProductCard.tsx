import { MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { Business, Product } from "../types";
import { formatCurrency } from "../utils/format";
import { FavoriteButton } from "./FavoriteButton";

interface ProductCardProps {
  product: Product;
  business?: Business;
}

export const ProductCard = ({ product, business }: ProductCardProps) => (
  <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
    <div className="relative h-52">
      <img src={product.imageUrl} alt={product.name} className="h-full w-full object-cover" />
      <div className="absolute right-3 top-3">
        <FavoriteButton id={product.id} type="product" />
      </div>
      <span
        className={`absolute bottom-3 left-3 rounded-full px-3 py-1 text-xs font-bold ${
          product.available ? "bg-emerald-100 text-emerald-800" : "bg-slate-900 text-white"
        }`}
      >
        {product.available ? "Достапно" : "Недостапно"}
      </span>
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wide text-emerald-700">{product.category}</span>
          <h3 className="mt-1 text-lg font-black leading-tight text-slate-950">{product.name}</h3>
        </div>
        <p className="shrink-0 rounded-2xl bg-emerald-50 px-3 py-2 text-sm font-black text-emerald-800">
          {formatCurrency(product.price)}
        </p>
      </div>
      <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{product.description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-600">
        <span>{business?.name ?? "Локален бизнис"}</span>
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-emerald-600" />
          {product.city}
        </span>
      </div>
      <Link
        to={`/products/${product.id}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
      >
        Детали
      </Link>
    </div>
  </article>
);
