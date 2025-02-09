export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: "coffee" | "cookies" | "sides";
  imageUrl: string;
  available: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface SalesData {
  id: string;
  amount: number;
  timestamp: Date;
  items: {
    menuItemId: string;
    quantity: number;
    price: number;
  }[];
  paymentMethod: "cash" | "card";
  note?: string;
}

export interface DashboardStats {
  dailyEarnings: number;
  monthlyEarnings: number;
  annualEarnings: number;
  topSellingItems: {
    name: string;
    quantity: number;
  }[];
}

export interface CafeUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "cashier" | "barista";
  status: "active" | "inactive";
  phoneNumber: string;
  joinDate: Date;
  imageUrl?: string;
}

export interface UserRole {
  id: string;
  name: "admin" | "manager" | "cashier" | "barista";
  permissions: string[];
  description: string;
}
