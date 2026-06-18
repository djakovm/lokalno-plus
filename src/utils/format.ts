import type { RequestStatus } from "../types";

export const formatCurrency = (value: number) =>
  `${new Intl.NumberFormat("mk-MK").format(value)} ден.`;

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("mk-MK", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(value));

export const statusClassName = (status: RequestStatus) => {
  if (status === "Одговорено") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (status === "Во обработка") {
    return "bg-amber-100 text-amber-800";
  }

  return "bg-slate-100 text-slate-700";
};

export const normalize = (value: string) => value.trim().toLocaleLowerCase("mk-MK");

export const containsText = (source: string, query: string) => {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) {
    return true;
  }

  return normalize(source).includes(normalizedQuery);
};
