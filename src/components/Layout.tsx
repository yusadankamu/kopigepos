import { ReactNode, useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import Sidebar from "./Sidebar";
import WelcomeMessage from "./WelcomeMessage";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setShowWelcome(true);
      const timer = setTimeout(() => {
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - responsive */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button
          onClick={() =>
            document
              .querySelector(".sidebar")
              ?.classList.toggle("translate-x-0")
          }
          className="bg-gray-800 text-white p-3 rounded-full shadow-lg"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div className="sidebar fixed inset-y-0 left-0 transform -translate-x-full transition-transform duration-300 ease-in-out md:hidden z-40">
        <Sidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 md:ml-64 relative">
        {showWelcome && <WelcomeMessage />}
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
