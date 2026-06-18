import { Send } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import type { RequestFormValues } from "../types";

interface RequestFormProps {
  mode: "product" | "contact";
  initialQuantity?: number;
  onSubmit: (values: RequestFormValues) => void;
}

export const RequestForm = ({ mode, initialQuantity = 1, onSubmit }: RequestFormProps) => {
  const { currentUser } = useAuth();
  const [values, setValues] = useState<RequestFormValues>({
    customerName: currentUser?.name ?? "",
    email: currentUser?.email ?? "",
    phone: currentUser?.phone ?? "",
    quantity: initialQuantity,
    message: ""
  });

  const updateValue = (field: keyof RequestFormValues, value: string | number) => {
    setValues((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(values);
    setValues((current) => ({ ...current, message: "", quantity: initialQuantity }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Име и презиме</span>
          <input
            required
            value={values.customerName}
            onChange={(event) => updateValue("customerName", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Телефон</span>
          <input
            required
            value={values.phone}
            onChange={(event) => updateValue("phone", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-bold text-slate-700">Е-пошта</span>
          <input
            required
            type="email"
            value={values.email}
            onChange={(event) => updateValue("email", event.target.value)}
            className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          />
        </label>
        {mode === "product" ? (
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Количина</span>
            <input
              required
              min={1}
              type="number"
              value={values.quantity ?? 1}
              onChange={(event) => updateValue("quantity", Number(event.target.value))}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        ) : null}
      </div>
      <label className="block">
        <span className="mb-2 block text-sm font-bold text-slate-700">Порака</span>
        <textarea
          required
          rows={5}
          value={values.message}
          onChange={(event) => updateValue("message", event.target.value)}
          className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
          placeholder={mode === "product" ? "Напиши детали за нарачката..." : "Напиши што сакаш да прашаш..."}
        />
      </label>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
      >
        <Send className="h-4 w-4" />
        {mode === "product" ? "Испрати барање" : "Испрати порака"}
      </button>
    </form>
  );
};
