import { Link, useLocation } from "wouter";
import { useApp } from "../../context/AppContext";
import {
  LayoutDashboard, Package, ShoppingCart, AlertTriangle,
  LogOut, Leaf, Settings, X, ChevronRight
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/expiring", label: "Expiring Soon", icon: AlertTriangle },
  { href: "/shopping", label: "Shopping List", icon: ShoppingCart },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  const { currentUser, logout, stats } = useApp();
  const [location] = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-sidebar border-r border-sidebar-border z-40 flex flex-col transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        data-testid="sidebar"
      >
        {/* Header */}
        <div className="p-5 border-b border-sidebar-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
              <Leaf className="text-primary-foreground w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sidebar-foreground text-sm">PantryTrack</p>
              <p className="text-xs text-muted-foreground">Home Inventory</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground" data-testid="button-close-sidebar">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = location === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                data-testid={`nav-${label.toLowerCase().replace(/ /g, "-")}`}
              >
                <div
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group
                    ${isActive
                      ? "bg-primary text-primary-foreground font-medium"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                    }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm flex-1">{label}</span>
                  {label === "Expiring Soon" && stats.expiringSoon + stats.expired > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-destructive text-destructive-foreground"}`}>
                      {stats.expiringSoon + stats.expired}
                    </span>
                  )}
                  {label === "Shopping List" && stats.shoppingCount > 0 && (
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${isActive ? "bg-white/20 text-white" : "bg-secondary text-secondary-foreground"}`}>
                      {stats.shoppingCount}
                    </span>
                  )}
                  {!isActive && <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" />}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* User info + Logout */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary font-bold text-sm">
                {currentUser?.name?.charAt(0) ?? "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-sidebar-foreground truncate">{currentUser?.name}</p>
              <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
