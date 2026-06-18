import { ClipboardList, Home, LayoutDashboard, Package, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Преглед", icon: LayoutDashboard, end: true },
  { to: "/dashboard/profile", label: "Профил", icon: Settings },
  { to: "/dashboard/products", label: "Производи", icon: Package },
  { to: "/dashboard/requests", label: "Барања", icon: ClipboardList }
];

export const DashboardSidebar = () => (
  <aside className="rounded-3xl border border-slate-200 bg-white p-3 shadow-sm lg:sticky lg:top-24">
    <NavLink
      to="/"
      className="mb-3 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950"
    >
      <Home className="h-4 w-4" />
      Почетна
    </NavLink>
    <nav className="grid gap-1">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition ${
                isActive ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-800"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </NavLink>
        );
      })}
    </nav>
  </aside>
);
