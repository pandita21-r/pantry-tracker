import { useState } from "react";
import { useLocation } from "wouter";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface AppLayoutProps {
  children: React.ReactNode;
  onAddItem: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/inventory": "Inventory",
  "/expiring": "Expiring Soon",
  "/shopping": "Shopping List",
  "/settings": "Settings",
};

export default function AppLayout({ children, onAddItem, searchQuery, onSearchChange }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const pageTitle = PAGE_TITLES[location] ?? "PantryTrack";

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        <Topbar
          onMenuClick={() => setSidebarOpen(true)}
          onAddItem={onAddItem}
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
          pageTitle={pageTitle}
        />
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
