import { AtSign, Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => (
  <footer className="border-t border-slate-200 bg-white">
    <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
      <div>
        <Link to="/" className="inline-flex items-center gap-2 text-xl font-black text-slate-950">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white">
            Л+
          </span>
          Локално+
        </Link>
        <p className="mt-4 max-w-md text-sm leading-6 text-slate-600">
          Дигитален каталог за локални бизниси, производи и услуги од Северна Македонија.
        </p>
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-950">Навигација</h3>
        <div className="mt-4 grid gap-2 text-sm font-semibold text-slate-600">
          <Link to="/businesses" className="hover:text-emerald-700">Бизниси</Link>
          <Link to="/products" className="hover:text-emerald-700">Производи</Link>
          <Link to="/favorites" className="hover:text-emerald-700">Омилени</Link>
          <Link to="/register" className="hover:text-emerald-700">Регистрација</Link>
        </div>
      </div>
      <div>
        <h3 className="text-sm font-black uppercase tracking-wide text-slate-950">Контакт</h3>
        <div className="mt-4 grid gap-3 text-sm font-semibold text-slate-600">
          <span className="inline-flex items-center gap-2">
            <MapPin className="h-4 w-4 text-emerald-600" />
            Скопје, Северна Македонија
          </span>
          <span className="inline-flex items-center gap-2">
            <Mail className="h-4 w-4 text-emerald-600" />
            zdravo@lokalno.mk
          </span>
          <span className="inline-flex items-center gap-2">
            <AtSign className="h-4 w-4 text-emerald-600" />
            @lokalno.plus
          </span>
        </div>
      </div>
    </div>
  </footer>
);
