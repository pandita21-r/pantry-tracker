import { useState } from "react";
import { useApp } from "@/context/AppContext";
import type { Category, PantryItem } from "@/types/pantry";
import { X, Save } from "lucide-react";

const CATEGORIES: Category[] = [
  "Produce", "Dairy", "Meat & Seafood", "Grains & Bread", "Canned Goods",
  "Frozen", "Beverages", "Snacks", "Condiments", "Spices", "Other"
];

const UNITS = ["piece", "pcs", "lbs", "oz", "kg", "g", "gallon", "quart", "cup", "liter", "ml", "bag", "box", "can", "jar", "bottle", "carton", "pack", "loaf", "bunch", "dozen"];

interface AddItemModalProps {
  open: boolean;
  onClose: () => void;
  editItem?: PantryItem | null;
}

export default function AddItemModal({ open, onClose, editItem }: AddItemModalProps) {
  const { addItem, updateItem } = useApp();

  const [form, setForm] = useState({
    name: editItem?.name ?? "",
    category: (editItem?.category ?? "Produce") as Category,
    quantity: editItem?.quantity?.toString() ?? "1",
    unit: editItem?.unit ?? "pcs",
    expirationDate: editItem?.expirationDate ?? "",
    purchaseDate: editItem?.purchaseDate ?? new Date().toISOString().split("T")[0],
    notes: editItem?.notes ?? "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = "Name is required";
    if (!form.quantity || isNaN(Number(form.quantity)) || Number(form.quantity) <= 0) {
      errs.quantity = "Quantity must be a positive number";
    }
    if (!form.purchaseDate) errs.purchaseDate = "Purchase date is required";
    return errs;
  };

  const handleSave = () => {
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const data = {
      name: form.name.trim(),
      category: form.category,
      quantity: Number(form.quantity),
      unit: form.unit,
      expirationDate: form.expirationDate || undefined,
      purchaseDate: form.purchaseDate,
      notes: form.notes.trim() || undefined,
    };

    if (editItem) {
      updateItem(editItem.id, data);
    } else {
      addItem(data);
    }
    onClose();
  };

  const set = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" data-testid="modal-add-item">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-card-border rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-slide-up">
        <div className="sticky top-0 bg-card border-b border-card-border px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-foreground">
            {editItem ? "Edit Item" : "Add Pantry Item"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
            data-testid="button-close-modal"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Item Name *</label>
            <input
              type="text"
              value={form.name}
              onChange={e => set("name", e.target.value)}
              placeholder="e.g. Whole Milk, Baby Spinach..."
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              data-testid="input-item-name"
            />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Category</label>
            <select
              value={form.category}
              onChange={e => set("category", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
              data-testid="select-category"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Quantity *</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={form.quantity}
                onChange={e => set("quantity", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                data-testid="input-quantity"
              />
              {errors.quantity && <p className="text-destructive text-xs mt-1">{errors.quantity}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Unit</label>
              <select
                value={form.unit}
                onChange={e => set("unit", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                data-testid="select-unit"
              >
                {UNITS.map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Purchase Date *</label>
              <input
                type="date"
                value={form.purchaseDate}
                onChange={e => set("purchaseDate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                data-testid="input-purchase-date"
              />
              {errors.purchaseDate && <p className="text-destructive text-xs mt-1">{errors.purchaseDate}</p>}
            </div>
            <div>
              <label className="text-sm font-medium text-foreground block mb-1.5">Expiration Date</label>
              <input
                type="date"
                value={form.expirationDate}
                onChange={e => set("expirationDate", e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm"
                data-testid="input-expiration-date"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-1.5">Notes</label>
            <textarea
              value={form.notes}
              onChange={e => set("notes", e.target.value)}
              placeholder="Optional notes..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm resize-none"
              data-testid="textarea-notes"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              data-testid="button-cancel"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
              data-testid="button-save-item"
            >
              <Save className="w-4 h-4" />
              {editItem ? "Save Changes" : "Add to Pantry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
