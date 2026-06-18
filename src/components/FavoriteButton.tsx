import { Heart } from "lucide-react";
import { useData } from "../hooks/useData";
import { useToast } from "../hooks/useToast";

interface FavoriteButtonProps {
  id: string;
  type: "business" | "product";
  label?: string;
}

export const FavoriteButton = ({ id, type, label }: FavoriteButtonProps) => {
  const {
    isFavoriteBusiness,
    isFavoriteProduct,
    toggleFavoriteBusiness,
    toggleFavoriteProduct
  } = useData();
  const { showToast } = useToast();
  const isFavorite = type === "business" ? isFavoriteBusiness(id) : isFavoriteProduct(id);

  const handleClick = () => {
    if (type === "business") {
      toggleFavoriteBusiness(id);
    } else {
      toggleFavoriteProduct(id);
    }

    showToast(isFavorite ? "Отстрането од омилени." : "Додадено во омилени.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-3 py-2 text-sm font-semibold transition ${
        isFavorite
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:text-emerald-700"
      }`}
      aria-label={isFavorite ? "Отстрани од омилени" : "Додај во омилени"}
      title={isFavorite ? "Отстрани од омилени" : "Додај во омилени"}
    >
      <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
      {label ? <span>{label}</span> : null}
    </button>
  );
};
