import type { Category } from "@/types/pantry";

const CATEGORY_COLORS: Record<Category, { bg: string; text: string; emoji: string }> = {
  "Produce": { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-400", emoji: "🥦" },
  "Dairy": { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-400", emoji: "🥛" },
  "Meat & Seafood": { bg: "bg-red-100 dark:bg-red-900/40", text: "text-red-700 dark:text-red-400", emoji: "🥩" },
  "Grains & Bread": { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-400", emoji: "🍞" },
  "Canned Goods": { bg: "bg-gray-100 dark:bg-gray-800", text: "text-gray-700 dark:text-gray-400", emoji: "🥫" },
  "Frozen": { bg: "bg-cyan-100 dark:bg-cyan-900/40", text: "text-cyan-700 dark:text-cyan-400", emoji: "🧊" },
  "Beverages": { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-400", emoji: "🧃" },
  "Snacks": { bg: "bg-pink-100 dark:bg-pink-900/40", text: "text-pink-700 dark:text-pink-400", emoji: "🍿" },
  "Condiments": { bg: "bg-orange-100 dark:bg-orange-900/40", text: "text-orange-700 dark:text-orange-400", emoji: "🧴" },
  "Spices": { bg: "bg-yellow-100 dark:bg-yellow-900/40", text: "text-yellow-700 dark:text-yellow-400", emoji: "🌶️" },
  "Other": { bg: "bg-slate-100 dark:bg-slate-800", text: "text-slate-700 dark:text-slate-400", emoji: "📦" },
};

interface CategoryIconProps {
  category: Category;
  size?: "sm" | "md" | "lg";
}

export default function CategoryIcon({ category, size = "md" }: CategoryIconProps) {
  const config = CATEGORY_COLORS[category];
  const sizes = { sm: "w-7 h-7 text-sm", md: "w-9 h-9 text-base", lg: "w-12 h-12 text-xl" };

  return (
    <div
      className={`${config.bg} ${config.text} ${sizes[size]} rounded-xl flex items-center justify-center flex-shrink-0`}
      data-testid={`icon-category-${category}`}
      title={category}
    >
      {config.emoji}
    </div>
  );
}

export { CATEGORY_COLORS };
