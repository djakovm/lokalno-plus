import { Outlet } from "react-router-dom";
import { DashboardSidebar } from "../components/DashboardSidebar";
import { Header } from "../components/Header";

export const DashboardLayout = () => (
  <div className="min-h-screen bg-slate-50 text-slate-900">
    <Header />
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[260px_1fr] lg:px-8">
      <DashboardSidebar />
      <section className="min-w-0">
        <Outlet />
      </section>
    </main>
  </div>
);
