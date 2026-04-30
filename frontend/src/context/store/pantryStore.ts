import { useState, useCallback } from "react";
import type { PantryItem, ShoppingItem, Category, User } from "@/types/pantry";

const DEMO_USER: User = {
  name: "Alex Johnson",
  email: "alex@example.com",
};

const today = new Date();
const addDays = (d: Date, days: number) => {
  const r = new Date(d);
  r.setDate(r.getDate() + days);
  return r.toISOString().split("T")[0];
};

const INITIAL_ITEMS: PantryItem[] = [
  {
    id: "1",
    name: "Whole Milk",
    category: "Dairy",
    quantity: 1,
    unit: "gallon",
    expirationDate: addDays(today, 5),
    purchaseDate: addDays(today, -2),
    notes: "Organic",
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Baby Spinach",
    category: "Produce",
    quantity: 1,
    unit: "bag",
    expirationDate: addDays(today, 2),
    purchaseDate: addDays(today, -1),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Chicken Breast",
    category: "Meat & Seafood",
    quantity: 2,
    unit: "lbs",
    expirationDate: addDays(today, -1),
    purchaseDate: addDays(today, -4),
    notes: "Free range",
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Sourdough Bread",
    category: "Grains & Bread",
    quantity: 1,
    unit: "loaf",
    expirationDate: addDays(today, 4),
    purchaseDate: addDays(today, -1),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    name: "Greek Yogurt",
    category: "Dairy",
    quantity: 3,
    unit: "cups",
    expirationDate: addDays(today, 14),
    purchaseDate: addDays(today, -3),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "6",
    name: "Brown Rice",
    category: "Grains & Bread",
    quantity: 5,
    unit: "lbs",
    purchaseDate: addDays(today, -30),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "7",
    name: "Cherry Tomatoes",
    category: "Produce",
    quantity: 1,
    unit: "pint",
    expirationDate: addDays(today, 6),
    purchaseDate: addDays(today, -2),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "8",
    name: "Canned Tomatoes",
    category: "Canned Goods",
    quantity: 4,
    unit: "cans",
    expirationDate: addDays(today, 365),
    purchaseDate: addDays(today, -10),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "9",
    name: "Orange Juice",
    category: "Beverages",
    quantity: 1,
    unit: "carton",
    expirationDate: addDays(today, 8),
    purchaseDate: addDays(today, -3),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "10",
    name: "Frozen Peas",
    category: "Frozen",
    quantity: 2,
    unit: "bags",
    expirationDate: addDays(today, 180),
    purchaseDate: addDays(today, -7),
    addedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const INITIAL_SHOPPING: ShoppingItem[] = [
  { id: "s1", name: "Eggs", category: "Dairy", quantity: 1, unit: "dozen", checked: false, addedAt: new Date().toISOString() },
  { id: "s2", name: "Avocados", category: "Produce", quantity: 3, unit: "pcs", checked: false, addedAt: new Date().toISOString() },
  { id: "s3", name: "Coffee Beans", category: "Beverages", quantity: 1, unit: "bag", checked: true, addedAt: new Date().toISOString() },
];

export function usePantryStore() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [items, setItems] = useState<PantryItem[]>(INITIAL_ITEMS);
  const [shoppingList, setShoppingList] = useState<ShoppingItem[]>(INITIAL_SHOPPING);

  const login = useCallback((email: string, _password: string) => {
    setCurrentUser({ ...DEMO_USER, email });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  const addItem = useCallback((item: Omit<PantryItem, "id" | "addedAt" | "updatedAt">) => {
    const newItem: PantryItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems(prev => [newItem, ...prev]);
    return newItem;
  }, []);

  const updateItem = useCallback((id: string, updates: Partial<PantryItem>) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, ...updates, updatedAt: new Date().toISOString() }
          : item
      )
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const addShoppingItem = useCallback((item: Omit<ShoppingItem, "id" | "addedAt">) => {
    const newItem: ShoppingItem = {
      ...item,
      id: Date.now().toString(),
      addedAt: new Date().toISOString(),
    };
    setShoppingList(prev => [newItem, ...prev]);
  }, []);

  const toggleShoppingItem = useCallback((id: string) => {
    setShoppingList(prev =>
      prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item)
    );
  }, []);

  const deleteShoppingItem = useCallback((id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  }, []);

  const moveShoppingItemToPantry = useCallback((shoppingItemId: string) => {
    const shoppingItem = shoppingList.find(i => i.id === shoppingItemId);
    if (!shoppingItem) return;
    const newPantryItem: PantryItem = {
      id: Date.now().toString(),
      name: shoppingItem.name,
      category: shoppingItem.category,
      quantity: shoppingItem.quantity,
      unit: shoppingItem.unit,
      purchaseDate: new Date().toISOString().split("T")[0],
      addedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setItems(prev => [newPantryItem, ...prev]);
    setShoppingList(prev => prev.filter(item => item.id !== shoppingItemId));
  }, [shoppingList]);

  const getExpirationStatus = useCallback((item: PantryItem) => {
    if (!item.expirationDate) return "no-date";
    const exp = new Date(item.expirationDate);
    const now = new Date();
    const diffDays = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "expired";
    if (diffDays <= 3) return "expiring-soon";
    return "fresh";
  }, []);

  const stats = {
    total: items.length,
    expiringSoon: items.filter(i => getExpirationStatus(i) === "expiring-soon").length,
    expired: items.filter(i => getExpirationStatus(i) === "expired").length,
    fresh: items.filter(i => getExpirationStatus(i) === "fresh").length,
    categories: items.reduce<Record<string, number>>((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {}),
    shoppingCount: shoppingList.filter(i => !i.checked).length,
  };

  return {
    currentUser,
    login,
    logout,
    items,
    addItem,
    updateItem,
    deleteItem,
    shoppingList,
    addShoppingItem,
    toggleShoppingItem,
    deleteShoppingItem,
    moveShoppingItemToPantry,
    getExpirationStatus,
    stats,
  };
}

export type PantryStore = ReturnType<typeof usePantryStore>;
