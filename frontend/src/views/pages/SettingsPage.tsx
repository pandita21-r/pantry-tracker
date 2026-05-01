import { useState } from "react";
import { useApp } from "../../context/AppContext";
import { User, Bell, Palette, Shield, ChevronRight, Moon, Sun, Download, Trash2, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  const { currentUser, items, shoppingList, deleteItem, deleteShoppingItem, logout } = useApp();
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [notifications, setNotifications] = useState({
    expiringSoon: true,
    expired: true,
    lowStock: false,
    weeklySummary: true,
  });
  const [threshold, setThreshold] = useState(3);
  const [displayName, setDisplayName] = useState(currentUser?.name ?? "");
  const [email, setEmail] = useState(currentUser?.email ?? "");
  const [savedProfile, setSavedProfile] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDarkMode(v => !v);
  };

  const handleSaveProfile = () => {
    setSavedProfile(true);
    setTimeout(() => setSavedProfile(false), 2000);
  };

  const handleExportCSV = () => {
    const headers = ["ID", "Name", "Category", "Quantity", "Unit", "Expiration Date", "Purchase Date", "Notes"];
    const rows = items.map(item => [
      item.id,
      item.name,
      item.category,
      item.quantity,
      item.unit,
      item.expirationDate ?? "",
      item.purchaseDate ?? "",
      item.notes ?? "",
    ]);
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `pantry-inventory-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleClearShopping = () => {
    if (!window.confirm("Clear all shopping list items?")) return;
    shoppingList.forEach(item => deleteShoppingItem(item.id));
  };

  const handleResetAllData = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 4000);
      return;
    }
    localStorage.removeItem("pantry_items");
    localStorage.removeItem("pantry_shopping");
    localStorage.removeItem("pantry_user");
    logout();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl space-y-6 animate-fade-in" data-testid="settings-page">
      <div>
        <h2 className="text-xl font-bold text-foreground mb-1">Settings</h2>
        <p className="text-sm text-muted-foreground">Manage your preferences and account</p>
      </div>

      {/* Profile */}
      <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Profile</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center">
              <span className="text-primary text-2xl font-bold">{displayName?.charAt(0) || "U"}</span>
            </div>
            <div>
              <p className="font-semibold text-foreground" data-testid="text-user-name">{displayName}</p>
              <p className="text-sm text-muted-foreground" data-testid="text-user-email">{email}</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Display Name</label>
              <input
                type="text"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                data-testid="input-display-name"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground block mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                data-testid="input-email-settings"
              />
            </div>
          </div>
          <button
            onClick={handleSaveProfile}
            className={`mt-4 px-4 py-2 text-sm font-medium rounded-xl transition-all ${savedProfile ? "bg-green-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90"}`}
            data-testid="button-save-profile"
          >
            {savedProfile ? "Saved!" : "Save Profile"}
          </button>
        </div>
      </section>

      {/* Appearance */}
      <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Palette className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Appearance</h3>
        </div>
        <div className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground text-sm">Dark Mode</p>
              <p className="text-xs text-muted-foreground">Toggle between light and dark theme</p>
            </div>
            <button
              onClick={toggleDark}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${darkMode ? "bg-primary" : "bg-muted"}`}
              data-testid="button-toggle-dark-mode"
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 flex items-center justify-center ${darkMode ? "translate-x-6" : ""}`}>
                {darkMode ? <Moon className="w-3 h-3 text-primary" /> : <Sun className="w-3 h-3 text-amber-500" />}
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Notifications</h3>
        </div>
        <div className="p-5 space-y-4">
          {[
            { key: "expiringSoon" as const, label: "Expiring Soon Alerts", desc: "Get notified when items are about to expire" },
            { key: "expired" as const, label: "Expired Item Alerts", desc: "Get notified when items have expired" },
            { key: "lowStock" as const, label: "Low Stock Alerts", desc: "Get notified when running low on items" },
            { key: "weeklySummary" as const, label: "Weekly Summary", desc: "Receive a weekly pantry summary email" },
          ].map(({ key, label, desc }) => (
            <div key={key} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">{label}</p>
                <p className="text-xs text-muted-foreground">{desc}</p>
              </div>
              <button
                onClick={() => setNotifications(p => ({ ...p, [key]: !p[key] }))}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${notifications[key] ? "bg-primary" : "bg-muted"}`}
                data-testid={`toggle-${key}`}
              >
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${notifications[key] ? "translate-x-6" : ""}`} />
              </button>
            </div>
          ))}

          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-foreground text-sm">Expiry Warning Threshold</p>
              <span className="text-sm font-bold text-primary">{threshold} days</span>
            </div>
            <input
              type="range"
              min={1}
              max={14}
              value={threshold}
              onChange={e => setThreshold(Number(e.target.value))}
              className="w-full accent-primary"
              data-testid="slider-threshold"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 day</span>
              <span>14 days</span>
            </div>
          </div>
        </div>
      </section>

      {/* Data & Privacy */}
      <section className="bg-card border border-card-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-2">
          <Shield className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Data & Privacy</h3>
        </div>
        <div className="divide-y divide-border">
          <button
            onClick={handleExportCSV}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-muted/50 transition-colors text-left"
            data-testid="button-export-inventory-data"
          >
            <div>
              <p className="font-medium text-foreground text-sm">Export Inventory Data</p>
              <p className="text-xs text-muted-foreground">Download a CSV of all {items.length} pantry items</p>
            </div>
            <Download className="w-4 h-4 text-muted-foreground" />
          </button>

          <button
            onClick={handleClearShopping}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors text-left"
            data-testid="button-clear-shopping-list"
          >
            <div>
              <p className="font-medium text-foreground text-sm">Clear Shopping List</p>
              <p className="text-xs text-muted-foreground">Remove all {shoppingList.length} items from shopping list</p>
            </div>
            <Trash2 className="w-4 h-4 text-orange-500" />
          </button>

          <button
            onClick={handleResetAllData}
            className={`w-full flex items-center justify-between px-5 py-4 transition-colors text-left ${confirmReset ? "bg-destructive/10 hover:bg-destructive/20" : "hover:bg-destructive/5"}`}
            data-testid="button-reset-all-data"
          >
            <div>
              <p className={`font-medium text-sm ${confirmReset ? "text-destructive" : "text-foreground"}`}>
                {confirmReset ? "Click again to confirm reset" : "Reset All Data"}
              </p>
              <p className="text-xs text-muted-foreground">
                {confirmReset ? "This cannot be undone!" : "Delete all pantry items and settings"}
              </p>
            </div>
            <RefreshCw className={`w-4 h-4 ${confirmReset ? "text-destructive" : "text-muted-foreground"}`} />
          </button>
        </div>
      </section>
    </div>
  );
}
