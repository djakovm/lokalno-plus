import { createId } from "../services/storage";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";
import type { User, UserRole } from "../types";

export const Register = () => {
  const { addUser, addBusinessForOwner, categories, cities } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [role, setRole] = useState<Extract<UserRole, "customer" | "business">>("customer");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("demo123");
  const [phone, setPhone] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessCategory, setBusinessCategory] = useState(categories[0] ?? "Храна и пијалаци");
  const [businessCity, setBusinessCity] = useState(cities[0] ?? "Скопје");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const userId = createId("user");
    const user: User = {
      id: userId,
      name,
      email,
      password,
      phone,
      role
    };

    const created = addUser(user);
    if (!created) {
      showToast("Веќе постои корисник со оваа е-пошта.", "error");
      return;
    }

    if (role === "business") {
      addBusinessForOwner({
        ownerId: userId,
        name: businessName || name,
        category: businessCategory,
        city: businessCity,
        phone,
        email
      });
      showToast("Бизнис профилот е регистриран и чека одобрување.");
    } else {
      showToast("Купувачкиот профил е регистриран.");
    }

    navigate("/login");
  };

  return (
    <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Регистрација</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Креирај демо профил</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">
          Избери дали сакаш да пребаруваш како купувач или да додадеш локален бизнис во каталогот.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setRole("customer")}
            className={`rounded-xl px-4 py-3 text-sm font-black transition ${
              role === "customer" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Купувач
          </button>
          <button
            type="button"
            onClick={() => setRole("business")}
            className={`rounded-xl px-4 py-3 text-sm font-black transition ${
              role === "business" ? "bg-white text-emerald-700 shadow-sm" : "text-slate-600"
            }`}
          >
            Бизнис
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Име</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Телефон</span>
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Е-пошта</span>
            <input
              required
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-bold text-slate-700">Лозинка</span>
            <input
              required
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
            />
          </label>
        </div>

        {role === "business" ? (
          <div className="mt-6 rounded-3xl bg-emerald-50 p-4">
            <h2 className="text-lg font-black text-slate-950">Податоци за бизнис</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <label className="block sm:col-span-3">
                <span className="mb-2 block text-sm font-bold text-slate-700">Име на бизнис</span>
                <input
                  required
                  value={businessName}
                  onChange={(event) => setBusinessName(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-emerald-100 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </label>
              <label className="block sm:col-span-2">
                <span className="mb-2 block text-sm font-bold text-slate-700">Категорија</span>
                <select
                  value={businessCategory}
                  onChange={(event) => setBusinessCategory(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-emerald-100 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Град</span>
                <select
                  value={businessCity}
                  onChange={(event) => setBusinessCity(event.target.value)}
                  className="h-12 w-full rounded-2xl border border-emerald-100 px-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                >
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        ) : null}

        <button
          type="submit"
          className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
        >
          Регистрирај се
        </button>
      </form>
    </section>
  );
};
