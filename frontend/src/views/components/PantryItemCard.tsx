import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { PantryItem } from "@/types/pantry";
import CategoryIcon from "./CategoryIcon";
import ExpirationBadge from "./ExpirationBadge";
import { Pencil, Trash2, Plus, Minus, ShoppingCart } from "lucide-react";

interface PantryItemCardProps {
  item: PantryItem;
  onEdit: (item: PantryItem) => void;
}

export default function PantryItemCard({ item, onEdit }: PantryItemCardProps) {
  const { deleteItem, updateItem, getExpirationStatus, addShoppingItem } = useApp();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const status = getExpirationStatus(item);

  const handleDelete = () => {
    if (confirmDelete) {
      deleteItem(item.id);
    } else {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
    }
  };

  const adjustQuantity = (delta: number) => {
    const newQty = Math.max(0.1, item.quantity + delta);
    updateItem(item.id, { quantity: Math.round(newQty * 10) / 10 });
  };

  const handleAddToShopping = () => {
    addShoppingItem({
      name: item.name,
      category: item.category,
      quantity: 1,
      unit: item.unit,
      checked: false,
    });
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 2000);
  };

  const statusBorder = {
    fresh: "border-l-green-400",
    "expiring-soon": "border-l-orange-400",
    expired: "border-l-red-400",
    "no-date": "border-l-gray-300",
  };

  return (
    <div
      className={`bg-card border border-card-border rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all border-l-4 ${statusBorder[status]} animate-fade-in`}
      data-testid={`card-item-${item.id}`}
    >
      <CategoryIcon category={item.category} size="md" />

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <h3 className="font-semibold text-foreground text-sm leading-tight" data-testid={`text-item-name-${item.id}`}>{item.name}</h3>
            <p className="text-xs text-muted-foreground mt-0.5">{item.category}</p>
          </div>
          <ExpirationBadge status={status} date={item.expirationDate} />
        </div>

        {item.notes && (
          <p className="text-xs text-muted-foreground italic mt-1 truncate">{item.notes}</p>
        )}

        <div className="flex items-center justify-between mt-3 flex-wrap gap-2">
          {/* Quantity controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => adjustQuantity(-1)}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              data-testid={`button-decrease-${item.id}`}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="text-sm font-semibold text-foreground min-w-[2.5rem] text-center" data-testid={`text-quantity-${item.id}`}>
              {item.quantity} {item.unit}
            </span>
            <button
              onClick={() => adjustQuantity(1)}
              className="w-7 h-7 rounded-lg bg-muted hover:bg-muted/80 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              data-testid={`button-increase-${item.id}`}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={handleAddToShopping}
              className={`p-1.5 rounded-lg transition-all ${justAdded ? "bg-green-100 dark:bg-green-900/40 text-green-600" : "hover:bg-muted text-muted-foreground hover:text-foreground"}`}
              title="Add to shopping list"
              data-testid={`button-add-shopping-${item.id}`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(item)}
              className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              title="Edit item"
              data-testid={`button-edit-${item.id}`}
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={handleDelete}
              className={`p-1.5 rounded-lg transition-all ${confirmDelete
                ? "bg-destructive text-destructive-foreground"
                : "hover:bg-destructive/10 text-muted-foreground hover:text-destructive"}`}
              title={confirmDelete ? "Confirm delete?" : "Delete item"}
              data-testid={`button-delete-${item.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
