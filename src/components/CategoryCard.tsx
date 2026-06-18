import { ArrowRight, Boxes, CakeSlice, Hammer, Leaf, Palette, Scissors, Shirt, Sofa, Store, Wheat } from "lucide-react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  category: string;
}

const iconMap: Record<string, typeof Store> = {
  "Храна и пијалаци": Store,
  "Пекари": Wheat,
  "Слаткарници": CakeSlice,
  "Земјоделски производи": Leaf,
  "Рачни изработки": Palette,
  "Облека": Shirt,
  "Дом и декорација": Sofa,
  "Убавина и нега": Scissors,
  "Услуги": Hammer,
  "Локални брендови": Boxes
};

export const CategoryCard = ({ category }: CategoryCardProps) => {
  const Icon = iconMap[category] ?? Store;

  return (
    <Link
      to={`/businesses?category=${encodeURIComponent(category)}`}
      className="group flex min-h-32 flex-col justify-between rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-soft"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
        <Icon className="h-5 w-5" />
      </div>
      <div className="mt-5 flex items-end justify-between gap-3">
        <h3 className="text-base font-bold text-slate-950">{category}</h3>
        <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" />
      </div>
    </Link>
  );
};
