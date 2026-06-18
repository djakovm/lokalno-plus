import { LogOut, Menu, RotateCcw, UserCircle, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";

const navLinks = [
  { to: "/businesses", label: "Бизниси" },
  { to: "/products", label: "Производи" },
  { to: "/favorites", label: "Омилени" }
];

const dashboardPath = (role: string) => {
  if (role === "admin") {
    return "/admin";
  }

  if (role === "business") {
    return "/dashboard";
  }

  return "/my-requests";
};

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const { resetDemoData } = useData();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleReset = () => {
    if (window.confirm("Дали сакаш да ги вратиш оригиналните демо податоци?")) {
      resetDemoData();
      showToast("Демо податоците се ресетирани.");
      navigate("/");
      setIsOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    showToast("Успешно се одјави.");
    navigate("/");
    setIsOpen(false);
  };

  const renderLinks = () => (
    <>
      {navLinks.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          onClick={() => setIsOpen(false)}
          className={({ isActive }) =>
            `rounded-full px-4 py-2 text-sm font-bold transition ${
              isActive ? "bg-emerald-50 text-emerald-700" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
            }`
          }
        >
          {link.label}
        </NavLink>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-black text-slate-950" onClick={() => setIsOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            Л+
          </span>
          Локално+
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">{renderLinks()}</nav>

        <div className="hidden items-center gap-2 lg:flex">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-bold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700"
          >
            <RotateCcw className="h-4 w-4" />
            Ресетирај демо податоци
          </button>
          {currentUser ? (
            <>
              <Link
                to={dashboardPath(currentUser.role)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <UserCircle className="h-4 w-4" />
                {currentUser.name}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950"
                aria-label="Одјави се"
                title="Одјави се"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-700"
            >
              <UserCircle className="h-4 w-4" />
              Најава
            </Link>
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="rounded-full p-2 text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Отвори мени"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg lg:hidden">
          <nav className="grid gap-2">{renderLinks()}</nav>
          <div className="mt-4 grid gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-600"
            >
              <RotateCcw className="h-4 w-4" />
              Ресетирај демо податоци
            </button>
            {currentUser ? (
              <>
                <Link
                  to={dashboardPath(currentUser.role)}
                  onClick={() => setIsOpen(false)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
                >
                  <UserCircle className="h-4 w-4" />
                  {currentUser.name}
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"
                >
                  <LogOut className="h-4 w-4" />
                  Одјави се
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white"
              >
                <UserCircle className="h-4 w-4" />
                Најава
              </Link>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
};
