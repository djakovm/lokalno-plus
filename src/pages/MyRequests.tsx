import { ClipboardList } from "lucide-react";
import { useMemo } from "react";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { formatDate, statusClassName } from "../utils/format";

export const MyRequests = () => {
  const { currentUser } = useAuth();
  const { businesses, products, requests } = useData();

  const myRequests = useMemo(
    () =>
      requests
        .filter(
          (request) =>
            request.customerId === currentUser?.id ||
            request.email.toLocaleLowerCase("mk-MK") === currentUser?.email.toLocaleLowerCase("mk-MK")
        )
        .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()),
    [currentUser?.email, currentUser?.id, requests]
  );

  return (
    <section className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
          <ClipboardList className="h-4 w-4" />
          Историја
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Мои барања</h1>
      </div>

      {myRequests.length ? (
        <div className="grid gap-4">
          {myRequests.map((request) => {
            const business = businesses.find((candidate) => candidate.id === request.businessId);
            const product = products.find((candidate) => candidate.id === request.productId);
            return (
              <article key={request.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClassName(request.status)}`}>
                      {request.status}
                    </span>
                    <h2 className="mt-3 text-xl font-black text-slate-950">
                      {product?.name ?? "Контакт барање"}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">{business?.name ?? "Локален бизнис"}</p>
                  </div>
                  <p className="text-sm font-bold text-slate-500">{formatDate(request.createdAt)}</p>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
                  {request.quantity ? (
                    <p>
                      <span className="font-bold text-slate-800">Количина:</span> {request.quantity}
                    </p>
                  ) : null}
                  <p>
                    <span className="font-bold text-slate-800">Телефон:</span> {request.phone}
                  </p>
                </div>
                <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">{request.message}</p>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Се уште немаш испратени барања"
          description="Отвори производ или бизнис профил и испрати порака до локалниот продавач."
        />
      )}
    </section>
  );
};
