import { BadgeCheck, Building2, MapPin, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { EmptyState } from "../components/EmptyState";
import { FavoriteButton } from "../components/FavoriteButton";
import { Modal } from "../components/Modal";
import { RequestForm } from "../components/RequestForm";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { RequestFormValues } from "../types";
import { formatCurrency } from "../utils/format";

export const ProductDetails = () => {
  const { id } = useParams();
  const { businesses, products, addRequest } = useData();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [isRequestOpen, setIsRequestOpen] = useState(false);

  const product = products.find((candidate) => candidate.id === id);
  const business = useMemo(
    () => businesses.find((candidate) => candidate.id === product?.businessId && candidate.active && candidate.approved),
    [businesses, product?.businessId]
  );

  if (!product || !business) {
    return (
      <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <EmptyState
          title="Производот не е пронајден"
          description="Понудата можеби е избришана, недостапна или бизнисот не е активен."
        />
      </section>
    );
  }

  const handleRequestSubmit = (values: RequestFormValues) => {
    addRequest(
      { ...values, quantity: values.quantity ?? quantity },
      business.id,
      product.id,
      currentUser?.role === "customer" ? currentUser.id : undefined
    );
    setIsRequestOpen(false);
    showToast("Барањето е испратено до бизнисот.");
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="aspect-[4/3] w-full object-cover object-center sm:aspect-[16/11] lg:aspect-[4/3]"
          />
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
              {product.category}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ${
                product.available ? "bg-emerald-100 text-emerald-800" : "bg-slate-900 text-white"
              }`}
            >
              {product.available ? "Достапно" : "Недостапно"}
            </span>
          </div>
          <div className="mt-5 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black leading-tight text-slate-950">{product.name}</h1>
              <p className="mt-3 text-2xl font-black text-emerald-700">{formatCurrency(product.price)}</p>
            </div>
            <FavoriteButton id={product.id} type="product" />
          </div>
          <p className="mt-6 leading-7 text-slate-600">{product.description}</p>

          <div className="mt-6 rounded-3xl bg-slate-50 p-4">
            <Link to={`/businesses/${business.id}`} className="flex items-center gap-4">
              <img src={business.logoUrl} alt={business.name} className="h-14 w-14 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black text-slate-950">{business.name}</p>
                  {business.verified ? <BadgeCheck className="h-4 w-4 text-sky-600" /> : null}
                </div>
                <p className="mt-1 flex items-center gap-1.5 text-sm font-semibold text-slate-600">
                  <MapPin className="h-4 w-4 text-emerald-600" />
                  {business.city}
                </p>
              </div>
            </Link>
          </div>

          <div className="mt-6">
            <span className="mb-2 block text-sm font-bold text-slate-700">Количина</span>
            <div className="flex h-12 w-40 items-center justify-between rounded-2xl border border-slate-200 bg-white px-2">
              <button
                type="button"
                onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Намали количина"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-sm font-black text-slate-950">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((current) => current + 1)}
                className="rounded-xl p-2 text-slate-600 hover:bg-slate-100"
                aria-label="Зголеми количина"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={!product.available}
            onClick={() => setIsRequestOpen(true)}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-4 text-sm font-black text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ShoppingBag className="h-5 w-5" />
            Испрати барање
          </button>
        </div>
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="flex items-center gap-2 text-2xl font-black text-slate-950">
          <Building2 className="h-6 w-6 text-emerald-600" />
          Информации за бизнисот
        </h2>
        <p className="mt-3 leading-7 text-slate-600">{business.description}</p>
      </div>

      <Modal title={`Барање за: ${product.name}`} isOpen={isRequestOpen} onClose={() => setIsRequestOpen(false)}>
        <RequestForm mode="product" initialQuantity={quantity} onSubmit={handleRequestSubmit} />
      </Modal>
    </section>
  );
};
