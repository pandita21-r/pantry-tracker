import { Menu, Bell, Search, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { useState } from "react";

interface TopbarProps {
  onMenuClick: () => void;
  onAddItem: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  pageTitle: string;
}

export default function Topbar({
  onMenuClick,
  onAddItem,
  searchQuery,
  onSearchChange,
  pageTitle,
}: TopbarProps) {
  const { stats } = useApp();
  const alertCount = stats.expiringSoon + stats.expired;
  const [showAlert, setShowAlert] = useState(false);

  return (
    <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border px-4 lg:px-6 py-3 flex items-center gap-3" data-testid="topbar">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        data-testid="button-menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-semibold text-foreground hidden sm:block">{pageTitle}</h1>

      {/* Search */}
      <div className="flex-1 max-w-md mx-auto relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search pantry items..."
          className="w-full pl-9 pr-4 py-2 rounded-xl border border-border bg-card text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
          data-testid="input-search"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowAlert(v => !v)}
            className="relative p-2 rounded-xl hover:bg-muted transition-colors"
            data-testid="button-notifications"
          >
            <Bell className="w-5 h-5 text-muted-foreground" />
            {alertCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                {alertCount}
              </span>
            )}
          </button>

          {showAlert && alertCount > 0 && (
            <div className="absolute right-0 top-12 w-72 bg-card border border-card-border rounded-2xl shadow-xl p-4 z-50 animate-fade-in">
              <p className="font-semibold text-sm mb-3 text-foreground">Alerts</p>
              {stats.expired > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-destructive/10 mb-2">
                  <span className="w-2 h-2 bg-destructive rounded-full flex-shrink-0" />
                  <p className="text-sm text-destructive font-medium">{stats.expired} item{stats.expired > 1 ? "s" : ""} expired</p>
                </div>
              )}
              {stats.expiringSoon > 0 && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-orange-500/10 mb-2">
                  <span className="w-2 h-2 bg-orange-500 rounded-full flex-shrink-0" />
                  <p className="text-sm text-orange-600 font-medium">{stats.expiringSoon} item{stats.expiringSoon > 1 ? "s" : ""} expiring soon</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add item button */}
        <button
          onClick={onAddItem}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-semibold rounded-xl hover:opacity-90 transition-all active:scale-[0.98]"
          data-testid="button-add-item"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add Item</span>
        </button>
      </div>
    </header>
  );
}
