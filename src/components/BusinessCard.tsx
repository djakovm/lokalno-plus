import { BadgeCheck, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import type { Business } from "../types";
import { FavoriteButton } from "./FavoriteButton";

interface BusinessCardProps {
  business: Business;
}

export const BusinessCard = ({ business }: BusinessCardProps) => (
  <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
    <div className="relative h-40">
      <img src={business.coverUrl} alt={business.name} className="h-full w-full object-cover" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-slate-950/60 to-transparent" />
      <img
        src={business.logoUrl}
        alt={`Лого на ${business.name}`}
        className="absolute bottom-4 left-4 h-16 w-16 rounded-2xl border-4 border-white object-cover shadow-lg"
      />
    </div>
    <div className="p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {business.category}
            </span>
            {business.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-bold text-sky-700">
                <BadgeCheck className="h-3.5 w-3.5" />
                Верификувано
              </span>
            ) : null}
          </div>
          <h3 className="text-lg font-black leading-tight text-slate-950">{business.name}</h3>
        </div>
        <FavoriteButton id={business.id} type="business" />
      </div>
      <p className="mt-3 line-clamp-2 min-h-12 text-sm leading-6 text-slate-600">{business.description}</p>
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-sm font-semibold text-slate-600">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-emerald-600" />
          {business.city}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
          {business.rating ? business.rating.toFixed(1) : "Ново"}
        </span>
      </div>
      <Link
        to={`/businesses/${business.id}`}
        className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
      >
        Отвори профил
      </Link>
    </div>
  </article>
);
