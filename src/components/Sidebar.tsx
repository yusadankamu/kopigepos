import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Coffee,
  CreditCard,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { auth } from "../lib/firebase";
import { signOut } from "firebase/auth";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/" },
  { icon: Coffee, label: "Menu", path: "/menu" },
  { icon: CreditCard, label: "Payment", path: "/payment" },
  { icon: Users, label: "Users", path: "/users" },
  { icon: Settings, label: "Settings", path: "/settings" },
];

export default function Sidebar() {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 z-30 transition-transform duration-300 ease-in-out">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">KopigePOS</h1>
      </div>

      <nav className="mt-6">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 ${
                isActive ? "bg-gray-100" : ""
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full p-6">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
