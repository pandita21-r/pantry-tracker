import { useApp } from "@/context/AppContext";
import { CATEGORY_COLORS } from "@/views/components/CategoryIcon";
import ExpirationBadge from "@/views/components/ExpirationBadge";
import CategoryIcon from "@/views/components/CategoryIcon";
import type { Category } from "@/types/pantry";
import { Package, AlertTriangle, TrendingDown, ShoppingCart, Clock, Leaf } from "lucide-react";

interface DashboardPageProps {
  onAddItem: () => void;
}

export default function DashboardPage({ onAddItem }: DashboardPageProps) {
  const { stats, items, getExpirationStatus, currentUser } = useApp();

  const expiringSoonItems = items
    .filter(i => getExpirationStatus(i) === "expiring-soon" || getExpirationStatus(i) === "expired")
    .sort((a, b) => {
      if (!a.expirationDate) return 1;
      if (!b.expirationDate) return -1;
      return new Date(a.expirationDate).getTime() - new Date(b.expirationDate).getTime();
    })
    .slice(0, 5);

  const recentItems = [...items]
    .sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
    .slice(0, 5);

  const topCategories = Object.entries(stats.categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const now = new Date();
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Greeting */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {greeting}, {currentUser?.name?.split(" ")[0]}
          </h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
          </p>
        </div>
        <button
          onClick={onAddItem}
          className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all"
          data-testid="button-dashboard-add"
        >
          <Leaf className="w-4 h-4" />
          Add Item
        </button>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            value: stats.total,
            icon: Package,
            bg: "bg-primary/10",
            iconColor: "text-primary",
            badge: null,
          },
          {
            label: "Expired",
            value: stats.expired,
            icon: TrendingDown,
            bg: "bg-destructive/10",
            iconColor: "text-destructive",
            badge: stats.expired > 0 ? "Action needed" : null,
          },
          {
            label: "Expiring Soon",
            value: stats.expiringSoon,
            icon: AlertTriangle,
            bg: "bg-orange-100 dark:bg-orange-900/20",
            iconColor: "text-orange-500",
            badge: null,
          },
          {
            label: "Shopping List",
            value: stats.shoppingCount,
            icon: ShoppingCart,
            bg: "bg-secondary/10",
            iconColor: "text-secondary",
            badge: null,
          },
        ].map(({ label, value, icon: Icon, bg, iconColor, badge }) => (
          <div
            key={label}
            className="bg-card border border-card-border rounded-2xl p-5 hover:shadow-md transition-all"
            data-testid={`stat-card-${label.toLowerCase().replace(/ /g, "-")}`}
          >
            <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${iconColor}`} />
            </div>
            <p className="text-3xl font-bold text-foreground" data-testid={`stat-value-${label}`}>{value}</p>
            <p className="text-sm text-muted-foreground mt-0.5">{label}</p>
            {badge && (
              <span className="mt-2 inline-block text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full font-medium">
                {badge}
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expiring / Expired alert section */}
        <div className="lg:col-span-2 bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              <h3 className="font-semibold text-foreground">Needs Attention</h3>
            </div>
            <span className="text-xs text-muted-foreground">{expiringSoonItems.length} item{expiringSoonItems.length !== 1 ? "s" : ""}</span>
          </div>

          {expiringSoonItems.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-7 h-7 text-green-500" />
              </div>
              <p className="font-semibold text-foreground">All items are fresh!</p>
              <p className="text-sm text-muted-foreground mt-1">Nothing expiring in the next 3 days.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {expiringSoonItems.map(item => {
                const status = getExpirationStatus(item);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
                    data-testid={`alert-item-${item.id}`}
                  >
                    <CategoryIcon category={item.category} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                    </div>
                    <ExpirationBadge status={status} date={item.expirationDate} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Category breakdown */}
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h3 className="font-semibold text-foreground mb-4">By Category</h3>
          <div className="space-y-3">
            {topCategories.map(([category, count]) => {
              const pct = Math.round((count / stats.total) * 100);
              const colors = CATEGORY_COLORS[category as Category];
              return (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-foreground">{category}</span>
                    <span className="text-xs text-muted-foreground">{count} items</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${colors.bg.replace("bg-", "bg-").split(" ")[0]}`}
                      style={{ width: `${pct}%`, background: `var(--color-primary)`, opacity: 0.7 + (pct / 300) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recently added */}
      <div className="bg-card border border-card-border rounded-2xl p-5">
        <h3 className="font-semibold text-foreground mb-4">Recently Added</h3>
        {recentItems.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No items yet. Add your first pantry item!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentItems.map(item => {
              const status = getExpirationStatus(item);
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-xl border border-border hover:bg-muted/40 transition-colors"
                  data-testid={`recent-item-${item.id}`}
                >
                  <CategoryIcon category={item.category} size="sm" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.quantity} {item.unit}</p>
                  </div>
                  <ExpirationBadge status={status} date={item.expirationDate} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
