import { BadgeCheck, Clock, Mail, MapPin, Phone, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { FavoriteButton } from "../components/FavoriteButton";
import { Modal } from "../components/Modal";
import { ProductCard } from "../components/ProductCard";
import { RequestForm } from "../components/RequestForm";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { RequestFormValues } from "../types";

export const BusinessDetails = () => {
  const { id } = useParams();
  const { businesses, products, addRequest, recordBusinessView } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [isContactOpen, setIsContactOpen] = useState(false);

  const business = businesses.find((candidate) => candidate.id === id && candidate.active && candidate.approved);
  const businessProducts = useMemo(
    () => products.filter((product) => product.businessId === business?.id),
    [business?.id, products]
  );

  useEffect(() => {
    if (business?.id) {
      recordBusinessView(business.id);
    }
  }, [business?.id, recordBusinessView]);

  if (!business) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Бизнисот не е пронајден"
          description="Профилот можеби е деактивиран или се уште не е одобрен."
        />
      </section>
    );
  }

  const handleContactSubmit = (values: RequestFormValues) => {
    addRequest(values, business.id, undefined, currentUser?.role === "customer" ? currentUser.id : undefined);
    setIsContactOpen(false);
    showToast("Пораката е испратена до бизнисот.");
  };

  return (
    <section>
      <div className="relative h-56 overflow-hidden sm:h-72 lg:h-80">
        <img src={business.coverUrl} alt={business.name} className="h-full w-full object-cover object-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent" />
      </div>
      <div className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row">
              <img
                src={business.logoUrl}
                alt={`Лого на ${business.name}`}
                className="h-28 w-28 rounded-3xl border-4 border-white object-cover shadow-lg"
              />
              <div>
                <div className="flex flex-wrap items-center gap-2">
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
                <h1 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">{business.name}</h1>
                <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-emerald-600" />
                    {business.city}, {business.address}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    {business.rating ? business.rating.toFixed(1) : "Ново"}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <FavoriteButton id={business.id} type="business" label="Омилено" />
              <button
                type="button"
                onClick={() => setIsContactOpen(true)}
                className="rounded-full bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
              >
                Контактирај
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">За бизнисот</h2>
            <p className="mt-4 leading-7 text-slate-600">{business.description}</p>
          </div>
          <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black text-slate-950">Контакт информации</h2>
            <div className="mt-5 grid gap-4 text-sm font-semibold text-slate-600">
              <span className="inline-flex items-center gap-3">
                <Phone className="h-4 w-4 text-emerald-600" />
                {business.phone}
              </span>
              <span className="inline-flex items-center gap-3">
                <Mail className="h-4 w-4 text-emerald-600" />
                {business.email}
              </span>
              <span className="inline-flex items-start gap-3">
                <Clock className="mt-0.5 h-4 w-4 text-emerald-600" />
                {business.hours}
              </span>
            </div>
          </aside>
        </div>

        <div className="mt-10">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Понуда</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950">Производи од {business.name}</h2>
            </div>
            <Link to="/products" className="text-sm font-black text-emerald-700 hover:text-emerald-800">
              Сите производи
            </Link>
          </div>
          {businessProducts.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {businessProducts.map((product) => (
                <ProductCard key={product.id} product={product} business={business} />
              ))}
            </div>
          ) : (
            <EmptyState title="Нема внесени производи" description="Бизнисот наскоро може да ја дополни понудата." />
          )}
        </div>
      </div>

      <Modal title={`Контактирај: ${business.name}`} isOpen={isContactOpen} onClose={() => setIsContactOpen(false)}>
        <RequestForm mode="contact" onSubmit={handleContactSubmit} />
      </Modal>
    </section>
  );
};
