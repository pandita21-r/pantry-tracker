import { useState, useMemo } from "react";
import { useApp } from "../../context/AppContext";
import  PantryItemCard  from "../components/PantryItemCard";
import  AddItemModal  from "../components/AddItemModal";
import type { PantryItem, Category, ExpirationStatus, SortField, SortOrder } from "@/types/pantry";
import { Filter, SortAsc, SortDesc, LayoutGrid, List } from "lucide-react";

const CATEGORIES: Array<Category | "All"> = [
  "All", "Produce", "Dairy", "Meat & Seafood", "Grains & Bread", "Canned Goods",
  "Frozen", "Beverages", "Snacks", "Condiments", "Spices", "Other"
];

const STATUSES: Array<ExpirationStatus | "All"> = ["All", "fresh", "expiring-soon", "expired", "no-date"];

interface InventoryPageProps {
  searchQuery: string;
  addItemOpen: boolean;
  onAddItemClose: () => void;
}

export default function InventoryPage({ searchQuery, addItemOpen, onAddItemClose }: InventoryPageProps) {
  const { items, getExpirationStatus } = useApp();
  const [editItem, setEditItem] = useState<PantryItem | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<Category | "All">("All");
  const [statusFilter, setStatusFilter] = useState<ExpirationStatus | "All">("All");
  const [sortField, setSortField] = useState<SortField>("addedAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...items];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.category.toLowerCase().includes(q) ||
        i.notes?.toLowerCase().includes(q)
      );
    }

    if (categoryFilter !== "All") result = result.filter(i => i.category === categoryFilter);
    if (statusFilter !== "All") result = result.filter(i => getExpirationStatus(i) === statusFilter);

    result.sort((a, b) => {
      let va: string | number = 0, vb: string | number = 0;
      if (sortField === "name") { va = a.name.toLowerCase(); vb = b.name.toLowerCase(); }
      else if (sortField === "expirationDate") {
        va = a.expirationDate ? new Date(a.expirationDate).getTime() : Infinity;
        vb = b.expirationDate ? new Date(b.expirationDate).getTime() : Infinity;
      }
      else if (sortField === "category") { va = a.category; vb = b.category; }
      else if (sortField === "quantity") { va = a.quantity; vb = b.quantity; }
      else { va = new Date(a.addedAt).getTime(); vb = new Date(b.addedAt).getTime(); }

      if (va < vb) return sortOrder === "asc" ? -1 : 1;
      if (va > vb) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return result;
  }, [items, searchQuery, categoryFilter, statusFilter, sortField, sortOrder, getExpirationStatus]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortOrder(o => o === "asc" ? "desc" : "asc");
    else { setSortField(field); setSortOrder("asc"); }
  };

  return (
    <div className="space-y-5 animate-fade-in" data-testid="inventory-page">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-foreground">All Items</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} of {items.length} items</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm border transition-colors ${showFilters ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted text-foreground"}`}
            data-testid="button-toggle-filters"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          <div className="flex bg-muted rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              data-testid="button-view-grid"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
              data-testid="button-view-list"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border border-card-border rounded-2xl p-4 space-y-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Category</label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value as Category | "All")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="select-filter-category"
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Status</label>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value as ExpirationStatus | "All")}
                className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                data-testid="select-filter-status"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? "All statuses" : s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Sort by</label>
              <div className="flex gap-1">
                {(["name", "expirationDate", "category", "quantity", "addedAt"] as SortField[]).map(f => {
                  const labels: Record<SortField, string> = {
                    name: "Name", expirationDate: "Expiry", category: "Category", quantity: "Qty", addedAt: "Added"
                  };
                  return (
                    <button
                      key={f}
                      onClick={() => toggleSort(f)}
                      className={`flex-1 py-1.5 text-xs rounded-lg transition-colors ${sortField === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
                      data-testid={`button-sort-${f}`}
                    >
                      {labels[f]}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Order</label>
              <button
                onClick={() => setSortOrder(o => o === "asc" ? "desc" : "asc")}
                className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground hover:bg-muted transition-colors w-full"
                data-testid="button-sort-order"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                {sortOrder === "asc" ? "Ascending" : "Descending"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Items grid/list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-card border border-card-border rounded-2xl">
          <div className="text-5xl mb-4">🔍</div>
          <p className="font-semibold text-foreground mb-1">No items found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className={viewMode === "grid"
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          : "space-y-3"
        }>
          {filtered.map(item => (
            <PantryItemCard
              key={item.id}
              item={item}
              onEdit={setEditItem}
            />
          ))}
        </div>
      )}

      <AddItemModal open={addItemOpen} onClose={onAddItemClose} />
      {editItem && (
        <AddItemModal
          open={true}
          editItem={editItem}
          onClose={() => setEditItem(null)}
        />
      )}
    </div>
  );
}
