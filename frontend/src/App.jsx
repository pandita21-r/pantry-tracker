import { Switch, Route, Redirect } from "wouter";
import { useApp } from "./context/AppContext";
// Layouts
import AppLayout from "./views/layout/AppLayout";
// Pages
import LoginView from "./views/LoginView"; // This is your Landing Page
import DashboardPage from "./views/pages/DashboardPage";
import InventoryPage from "./views/pages/InventoryPage";
import ShoppingPage from "./views/pages/ShoppingPage";
import SettingsPage from "./views/pages/SettingsPage";
import ExpiringPage from "./views/pages/ExpiringPage";
import NotFoundPage from "./views/pages/NotFoundPage";

export default function App() {
  const { currentUser } = useApp();

  // 1. If NOT logged in, show ONLY LoginView (Landing Page)
  if (!currentUser) {
    return (
      <Switch>
        <Route path="/login" component={LoginView} />
        <Route>
          <Redirect to="/login" />
        </Route>
      </Switch>
    );
  }

  // 2. Once logged in, show the AppLayout (Sidebar/Topbar) and Pages
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={DashboardPage} />
        <Route path="/inventory" component={InventoryPage} />
        <Route path="/expiring" component={ExpiringPage} />
        <Route path="/shopping" component={ShoppingPage} />
        <Route path="/settings" component={SettingsPage} />
        <Route component={NotFoundPage} />
      </Switch>
    </AppLayout>
  );
}