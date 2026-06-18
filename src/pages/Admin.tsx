import { BadgeCheck, Building2, CheckCircle2, Package, Power, ShieldCheck, Users } from "lucide-react";
import { StatCard } from "../components/StatCard";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";

export const Admin = () => {
  const { businesses, products, users, updateBusinessAdminState } = useData();
  const { showToast } = useToast();
  const pendingBusinesses = businesses.filter((business) => !business.approved);

  const handleUpdate = (businessId: string, label: string, values: Parameters<typeof updateBusinessAdminState>[1]) => {
    updateBusinessAdminState(businessId, values);
    showToast(label);
  };

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <p className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wide text-emerald-700">
          <ShieldCheck className="h-4 w-4" />
          Администрација
        </p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Платформски преглед</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Бизниси" value={businesses.length} icon={Building2} />
        <StatCard label="Производи" value={products.length} icon={Package} tone="blue" />
        <StatCard label="Корисници" value={users.length} icon={Users} tone="amber" />
        <StatCard label="Бизниси во чекање" value={pendingBusinesses.length} icon={BadgeCheck} tone="rose" />
      </div>

      <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-black text-slate-950">Регистрирани бизниси</h2>
            <p className="mt-1 text-sm font-semibold text-slate-600">Одобрување, верификација и активирање.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[860px] border-separate border-spacing-y-3">
            <thead>
              <tr className="text-left text-xs font-black uppercase tracking-wide text-slate-500">
                <th className="px-4">Бизнис</th>
                <th className="px-4">Категорија</th>
                <th className="px-4">Град</th>
                <th className="px-4">Статус</th>
                <th className="px-4 text-right">Акции</th>
              </tr>
            </thead>
            <tbody>
              {businesses.map((business) => (
                <tr key={business.id} className="rounded-2xl bg-slate-50">
                  <td className="rounded-l-2xl px-4 py-4">
                    <div className="flex items-center gap-3">
                      <img src={business.logoUrl} alt={business.name} className="h-11 w-11 rounded-2xl object-cover" />
                      <div>
                        <p className="font-black text-slate-950">{business.name}</p>
                        <p className="text-xs font-semibold text-slate-500">{business.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-700">{business.category}</td>
                  <td className="px-4 py-4 text-sm font-bold text-slate-700">{business.city}</td>
                  <td className="px-4 py-4">
                    <div className="flex flex-wrap gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${business.approved ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {business.approved ? "Одобрен" : "Во чекање"}
                      </span>
                      <span className={`rounded-full px-3 py-1 text-xs font-black ${business.active ? "bg-sky-100 text-sky-800" : "bg-slate-200 text-slate-700"}`}>
                        {business.active ? "Активен" : "Неактивен"}
                      </span>
                      {business.verified ? (
                        <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">
                          Верификуван
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="rounded-r-2xl px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(
                            business.id,
                            business.approved ? "Бизнисот е вратен во чекање." : "Бизнисот е одобрен.",
                            { approved: !business.approved }
                          )
                        }
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
                        aria-label="Одобри бизнис"
                        title={business.approved ? "Врати во чекање" : "Одобри"}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(
                            business.id,
                            business.verified ? "Верификацијата е отстранета." : "Бизнисот е верификуван.",
                            { verified: !business.verified }
                          )
                        }
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-sky-200 hover:text-sky-700"
                        aria-label="Верификувај бизнис"
                        title={business.verified ? "Отстрани верификација" : "Верификувај"}
                      >
                        <BadgeCheck className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate(
                            business.id,
                            business.active ? "Бизнисот е деактивиран." : "Бизнисот е активиран.",
                            { active: !business.active }
                          )
                        }
                        className="rounded-full border border-slate-200 p-2 text-slate-600 transition hover:border-rose-200 hover:text-rose-700"
                        aria-label="Активирај или деактивирај"
                        title={business.active ? "Деактивирај" : "Активирај"}
                      >
                        <Power className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
