import { Inbox } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { RequestStatus } from "../types";
import { formatDate, statusClassName } from "../utils/format";

const statuses: RequestStatus[] = ["Испратено", "Во обработка", "Одговорено"];

export const DashboardRequests = () => {
  const { currentUser } = useAuth();
  const { businesses, products, requests, updateRequestStatus } = useData();
  const { showToast } = useToast();
  const business = businesses.find(
    (candidate) => candidate.id === currentUser?.businessId || candidate.ownerId === currentUser?.id
  );

  if (!business) {
    return <EmptyState title="Нема поврзан бизнис" description="Овој профил нема активен бизнис запис." />;
  }

  const businessRequests = requests
    .filter((request) => request.businessId === business.id)
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());

  const handleStatusChange = (requestId: string, status: RequestStatus) => {
    updateRequestStatus(requestId, status);
    showToast("Статусот е ажуриран.");
  };

  return (
    <div>
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
          <Inbox className="h-4 w-4" />
          Купувачи
        </p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">Пристигнати барања</h1>
      </div>

      {businessRequests.length ? (
        <div className="grid gap-4">
          {businessRequests.map((request) => {
            const product = products.find((candidate) => candidate.id === request.productId);
            return (
              <article key={request.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_220px] lg:items-start">
                  <div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${statusClassName(request.status)}`}>
                      {request.status}
                    </span>
                    <h2 className="mt-3 text-xl font-black text-slate-950">{request.customerName}</h2>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      {product?.name ?? "Контакт барање"}
                      {request.quantity ? ` · количина ${request.quantity}` : ""}
                    </p>
                    <p className="mt-3 rounded-2xl bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-700">
                      {request.message}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-3 text-sm font-semibold text-slate-600">
                      <span>{request.email}</span>
                      <span>{request.phone}</span>
                      <span>{formatDate(request.createdAt)}</span>
                    </div>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Промени статус</span>
                    <select
                      value={request.status}
                      onChange={(event) => handleStatusChange(request.id, event.target.value as RequestStatus)}
                      className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm font-bold text-slate-700 outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                    >
                      {statuses.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <EmptyState
          title="Нема пристигнати барања"
          description="Кога купувач ќе испрати порака или барање за производ, ќе се појави тука."
        />
      )}
    </div>
  );
};
