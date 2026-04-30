import { useMemo } from "react";
import { useApp } from "@/context/AppContext";
import CategoryIcon from "@/views/components/CategoryIcon";
import ExpirationBadge from "@/views/components/ExpirationBadge";
import { AlertTriangle, XCircle, ShoppingCart, Trash2 } from "lucide-react";
import type { PantryItem } from "@/types/pantry";

interface ExpiringPageProps {
  searchQuery: string;
}

export default function ExpiringPage({ searchQuery }: ExpiringPageProps) {
  const { items, getExpirationStatus, deleteItem, addShoppingItem } = useApp();

  const { expired, expiringSoon } = useMemo(() => {
    const q = searchQuery.toLowerCase();
    const relevant = items
      .filter(i => {
        const status = getExpirationStatus(i);
        return status === "expired" || status === "expiring-soon";
      })
      .filter(i => !q || i.name.toLowerCase().includes(q) || i.category.toLowerCase().includes(q));

    const sorted = relevant.sort((a, b) => {
      const da = a.expirationDate ? new Date(a.expirationDate).getTime() : 0;
      const db = b.expirationDate ? new Date(b.expirationDate).getTime() : 0;
      return da - db;
    });

    return {
      expired: sorted.filter(i => getExpirationStatus(i) === "expired"),
      expiringSoon: sorted.filter(i => getExpirationStatus(i) === "expiring-soon"),
    };
  }, [items, searchQuery, getExpirationStatus]);

  const handleAddToShopping = (item: PantryItem) => {
    addShoppingItem({
      name: item.name,
      category: item.category,
      quantity: 1,
      unit: item.unit,
      checked: false,
    });
  };

  const SectionCard = ({ item }: { item: PantryItem }) => {
    const status = getExpirationStatus(item);
    return (
      <div
        className="bg-card border border-card-border rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-all"
        data-testid={`expiring-card-${item.id}`}
      >
        <CategoryIcon category={item.category} size="md" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <p className="font-semibold text-foreground text-sm" data-testid={`text-expiring-name-${item.id}`}>{item.name}</p>
              <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} · {item.category}</p>
            </div>
            <ExpirationBadge status={status} date={item.expirationDate} />
          </div>
          {item.notes && <p className="text-xs text-muted-foreground italic truncate">{item.notes}</p>}
        </div>
        <div className="flex items-center gap-1 flex-shrink-0">
          <button
            onClick={() => handleAddToShopping(item)}
            className="p-2 rounded-xl hover:bg-green-100 dark:hover:bg-green-900/30 text-muted-foreground hover:text-green-600 transition-colors"
            title="Add replacement to shopping list"
            data-testid={`button-expiring-shop-${item.id}`}
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
          <button
            onClick={() => deleteItem(item.id)}
            className="p-2 rounded-xl hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
            title="Remove from pantry"
            data-testid={`button-expiring-delete-${item.id}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (expired.length === 0 && expiringSoon.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-3xl flex items-center justify-center mx-auto mb-5">
          <span className="text-4xl">🌿</span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-2">Everything's Fresh!</h3>
        <p className="text-muted-foreground max-w-sm mx-auto">
          No items are expiring in the next 3 days. Great job managing your pantry!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in" data-testid="expiring-page">
      {expired.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-destructive/10 rounded-xl flex items-center justify-center">
              <XCircle className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Expired Items</h2>
              <p className="text-xs text-muted-foreground">{expired.length} item{expired.length !== 1 ? "s" : ""} past expiration</p>
            </div>
          </div>
          <div className="space-y-3">
            {expired.map(item => <SectionCard key={item.id} item={item} />)}
          </div>
        </section>
      )}

      {expiringSoon.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/20 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Expiring Soon</h2>
              <p className="text-xs text-muted-foreground">{expiringSoon.length} item{expiringSoon.length !== 1 ? "s" : ""} expiring within 3 days</p>
            </div>
          </div>
          <div className="space-y-3">
            {expiringSoon.map(item => <SectionCard key={item.id} item={item} />)}
          </div>
        </section>
      )}
    </div>
  );
}
