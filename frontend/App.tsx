import { useState } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppProvider, useApp } from "@/context/AppContext";
import LoginView from "@/views/LoginView";
import AppLayout from "@/views/layout/AppLayout";
import DashboardPage from "@/views/pages/DashboardPage";
import InventoryPage from "@/views/pages/InventoryPage";
import ExpiringPage from "@/views/pages/ExpiringPage";
import ShoppingPage from "@/views/pages/ShoppingPage";
import SettingsPage from "@/views/pages/SettingsPage";
import NotFoundPage from "@/views/pages/NotFoundPage";
import AddItemModal from "@/views/components/AddItemModal";

const queryClient = new QueryClient();

function AuthenticatedApp() {
  const { currentUser } = useApp();
  const [addItemOpen, setAddItemOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  if (!currentUser) return <LoginView />;

  return (
    <AppLayout
      onAddItem={() => setAddItemOpen(true)}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
    >
      <Switch>
        <Route path="/" component={() => <DashboardPage onAddItem={() => setAddItemOpen(true)} />} />
        <Route
          path="/inventory"
          component={() => (
            <InventoryPage
              searchQuery={searchQuery}
              addItemOpen={addItemOpen}
              onAddItemClose={() => setAddItemOpen(false)}
            />
          )}
        />
        <Route path="/expiring" component={() => <ExpiringPage searchQuery={searchQuery} />} />
        <Route path="/shopping" component={() => <ShoppingPage />} />
        <Route path="/settings" component={() => <SettingsPage />} />
        <Route component={() => <NotFoundPage />} />
      </Switch>
      {/* Global add item modal (except on inventory page which has its own) */}
      <Route path="/">
        {() => <AddItemModal open={addItemOpen} onClose={() => setAddItemOpen(false)} />}
      </Route>
      <Route path="/expiring">
        {() => <AddItemModal open={addItemOpen} onClose={() => setAddItemOpen(false)} />}
      </Route>
      <Route path="/shopping">
        {() => <AddItemModal open={addItemOpen} onClose={() => setAddItemOpen(false)} />}
      </Route>
      <Route path="/settings">
        {() => <AddItemModal open={addItemOpen} onClose={() => setAddItemOpen(false)} />}
      </Route>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <AuthenticatedApp />
          </WouterRouter>
        </AppProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
