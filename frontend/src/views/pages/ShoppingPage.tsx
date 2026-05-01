import { useState } from "react";
import { useApp } from "../../context/AppContext";
import type { Category } from "../../types/pantry";
import CategoryIcon from "../components/CategoryIcon";
import { Plus, Trash2, CheckSquare, Square, ShoppingBag, Package } from "lucide-react";

const CATEGORIES: Category[] = [
  "Produce", "Dairy", "Meat & Seafood", "Grains & Bread", "Canned Goods",
  "Frozen", "Beverages", "Snacks", "Condiments", "Spices", "Other"
];

const UNITS = ["piece", "pcs", "lbs", "oz", "kg", "gallon", "quart", "cup", "liter", "bag", "box", "can", "jar", "bottle", "carton", "pack", "loaf", "bunch", "dozen"];

export default function ShoppingPage() {
  const { shoppingList, addShoppingItem, toggleShoppingItem, deleteShoppingItem, moveShoppingItemToPantry } = useApp();

  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", category: "Produce" as Category, quantity: "1", unit: "pcs" });

  const unchecked = shoppingList.filter(i => !i.checked);
  const checked = shoppingList.filter(i => i.checked);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    addShoppingItem({
      name: form.name.trim(),
      category: form.category,
      quantity: Number(form.quantity) || 1,
      unit: form.unit,
      checked: false,
    });
    setForm(prev => ({ ...prev, name: "" }));
    setShowAdd(false);
  };

  return (
    <div className="space-y-6 animate-fade-in" data-testid="shopping-page">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">Shopping List</h2>
          <p className="text-sm text-muted-foreground">
            {unchecked.length} item{unchecked.length !== 1 ? "s" : ""} to buy
          </p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          data-testid="button-add-shopping-item"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Add form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="bg-card border border-card-border rounded-2xl p-5 space-y-4 animate-slide-up" data-testid="form-add-shopping">
          <h3 className="font-semibold text-foreground">New Shopping Item</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="Item name..."
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              data-testid="input-shopping-name"
              autoFocus
            />
            <select
              value={form.category}
              onChange={e => setForm(p => ({ ...p, category: e.target.value as Category }))}
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              data-testid="select-shopping-category"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <input
              type="number"
              value={form.quantity}
              onChange={e => setForm(p => ({ ...p, quantity: e.target.value }))}
              min="0.1"
              step="0.1"
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              data-testid="input-shopping-quantity"
            />
            <select
              value={form.unit}
              onChange={e => setForm(p => ({ ...p, unit: e.target.value }))}
              className="px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              data-testid="select-shopping-unit"
            >
              {UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all"
              data-testid="button-submit-shopping"
            >
              Add to List
            </button>
          </div>
        </form>
      )}

      {shoppingList.length === 0 ? (
        <div className="text-center py-20 bg-card border border-card-border rounded-2xl">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-5">
            <ShoppingBag className="w-10 h-10 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Your list is empty</h3>
          <p className="text-muted-foreground mb-5">Add items you need to buy on your next trip.</p>
          <button
            onClick={() => setShowAdd(true)}
            className="px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          >
            Add First Item
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Unchecked items */}
          {unchecked.length > 0 && (
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-foreground text-sm">To Buy ({unchecked.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {unchecked.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/40 transition-colors"
                    data-testid={`shopping-item-${item.id}`}
                  >
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0"
                      data-testid={`button-check-${item.id}`}
                    >
                      <Square className="w-5 h-5" />
                    </button>
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground" data-testid={`text-shopping-name-${item.id}`}>{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} · {item.category}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveShoppingItemToPantry(item.id)}
                        title="Move to pantry"
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        data-testid={`button-move-pantry-${item.id}`}
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteShoppingItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`button-delete-shopping-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Checked items */}
          {checked.length > 0 && (
            <div className="bg-card border border-card-border rounded-2xl overflow-hidden opacity-70">
              <div className="px-5 py-4 border-b border-border">
                <h3 className="font-semibold text-muted-foreground text-sm">Done ({checked.length})</h3>
              </div>
              <div className="divide-y divide-border">
                {checked.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 px-5 py-3.5"
                    data-testid={`shopping-done-${item.id}`}
                  >
                    <button
                      onClick={() => toggleShoppingItem(item.id)}
                      className="text-primary flex-shrink-0"
                      data-testid={`button-uncheck-${item.id}`}
                    >
                      <CheckSquare className="w-5 h-5" />
                    </button>
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-muted-foreground line-through">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => moveShoppingItemToPantry(item.id)}
                        title="Move to pantry"
                        className="p-1.5 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        data-testid={`button-move-pantry-done-${item.id}`}
                      >
                        <Package className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteShoppingItem(item.id)}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        data-testid={`button-delete-done-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
