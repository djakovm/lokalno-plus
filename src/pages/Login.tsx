import { LogIn } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import type { UserRole } from "../types";

const rolePath = (role: UserRole) => {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "business") {
    return "/dashboard";
  }

  return "/my-requests";
};

const demoAccounts = [
  { label: "Купувач", email: "customer@lokalno.mk", password: "demo123" },
  { label: "Бизнис", email: "business@lokalno.mk", password: "demo123" },
  { label: "Админ", email: "admin@lokalno.mk", password: "demo123" }
];

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState("customer@lokalno.mk");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const submitLogin = (loginEmail: string, loginPassword: string) => {
    const result = login(loginEmail, loginPassword);
    if (!result.success || !result.user) {
      setError(result.message ?? "Најавата не успеа.");
      showToast(result.message ?? "Најавата не успеа.", "error");
      return;
    }

    setError("");
    showToast("Успешна најава.");
    navigate(from ?? rolePath(result.user.role), { replace: true });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    submitLogin(email, password);
  };

  return (
    <section className="mx-auto grid min-h-[calc(100vh-160px)] max-w-7xl items-center gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_480px] lg:px-8">
      <div>
        <p className="text-sm font-black uppercase tracking-wide text-emerald-700">Демо најава</p>
        <h1 className="mt-2 text-4xl font-black text-slate-950">Продолжи како купувач, бизнис или администратор</h1>
        <p className="mt-4 max-w-xl leading-7 text-slate-600">
          Сметките се симулирани за универзитетски проект и се користат само во оваа клиентска апликација.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {demoAccounts.map((account) => (
            <button
              key={account.email}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
                submitLogin(account.email, account.password);
              }}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-left shadow-sm transition hover:border-emerald-200 hover:shadow-soft"
            >
              <span className="text-sm font-black text-slate-950">{account.label}</span>
              <span className="mt-1 block text-xs font-semibold text-slate-500">{account.email}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft">
        <h2 className="text-2xl font-black text-slate-950">Најава</h2>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
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
          {error ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-700">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-black text-white transition hover:bg-emerald-700"
          >
            <LogIn className="h-4 w-4" />
            Најави се
          </button>
        </form>
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          Немаш профил?{" "}
          <Link to="/register" className="font-black text-emerald-700 hover:text-emerald-800">
            Регистрирај се
          </Link>
        </p>
      </div>
    </section>
  );
};
