export type Category =
  | "Produce"
  | "Dairy"
  | "Meat & Seafood"
  | "Grains & Bread"
  | "Canned Goods"
  | "Frozen"
  | "Beverages"
  | "Snacks"
  | "Condiments"
  | "Spices"
  | "Other";

export type ExpirationStatus = "fresh" | "expiring-soon" | "expired" | "no-date";

export interface PantryItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  expirationDate?: string;
  purchaseDate: string;
  notes?: string;
  addedAt: string;
  updatedAt: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: Category;
  quantity: number;
  unit: string;
  checked: boolean;
  addedAt: string;
}

export interface User {
  name: string;
  email: string;
  avatar?: string;
}

export type SortField = "name" | "expirationDate" | "category" | "quantity" | "addedAt";
export type SortOrder = "asc" | "desc";

export interface Filters {
  category: Category | "All";
  search: string;
  status: ExpirationStatus | "All";
  sortField: SortField;
  sortOrder: SortOrder;
}
