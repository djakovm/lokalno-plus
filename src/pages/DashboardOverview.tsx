import { Heart, Inbox, Package, TrendingUp } from "lucide-react";
import { EmptyState } from "../components/EmptyState";
import { StatCard } from "../components/StatCard";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { formatDate, statusClassName } from "../utils/format";

export const DashboardOverview = () => {
  const { currentUser } = useAuth();
  const { businesses, products, requests, favorites } = useData();
  const business = businesses.find(
    (candidate) => candidate.id === currentUser?.businessId || candidate.ownerId === currentUser?.id
  );

  if (!business) {
    return <EmptyState title="Нема поврзан бизнис" description="Овој профил нема активен бизнис запис." />;
  }

  const businessProducts = products.filter((product) => product.businessId === business.id);
  const businessRequests = requests
    .filter((request) => request.businessId === business.id)
    .sort((first, second) => new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime());
  const favoriteCount =
    (favorites.businessIds.includes(business.id) ? 1 : 0) +
    favorites.productIds.filter((productId) => businessProducts.some((product) => product.id === productId)).length;

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Бизнис контролна табла</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">{business.name}</h1>
        <p className="mt-2 text-sm font-semibold text-slate-600">
          {business.approved ? "Профилот е одобрен" : "Профилот чека одобрување"} · {business.active ? "Активен" : "Неактивен"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Прегледи на профил" value={business.views} icon={TrendingUp} />
        <StatCard label="Вкупно производи" value={businessProducts.length} icon={Package} tone="blue" />
        <StatCard label="Барања од купувачи" value={businessRequests.length} icon={Inbox} tone="amber" />
        <StatCard label="Омилени" value={favoriteCount} icon={Heart} tone="rose" />
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Последни барања</h2>
        {businessRequests.length ? (
          <div className="mt-5 grid gap-3">
            {businessRequests.slice(0, 5).map((request) => {
              const product = products.find((candidate) => candidate.id === request.productId);
              return (
                <article key={request.id} className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                    <div>
                      <p className="font-black text-slate-950">{request.customerName}</p>
                      <p className="mt-1 text-sm font-semibold text-slate-600">{product?.name ?? "Контакт барање"}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-black ${statusClassName(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{request.message}</p>
                  <p className="mt-2 text-xs font-bold text-slate-500">{formatDate(request.createdAt)}</p>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-2xl bg-slate-50 px-4 py-6 text-sm font-semibold text-slate-600">
            Се уште нема пристигнати барања.
          </p>
        )}
      </div>
    </div>
  );
};
