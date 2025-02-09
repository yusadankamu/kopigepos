import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";
import { X } from "lucide-react";

export default function WelcomeMessage() {
  const [isVisible, setIsVisible] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = auth.currentUser;
    if (user?.email) {
      const name = user.email.split("@")[0];
      setUserName(name.charAt(0).toUpperCase() + name.slice(1));
    }
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-4 right-4 max-w-sm w-full bg-white rounded-lg shadow-lg border border-gray-100 p-4 z-50 animate-slide-in">
      <button
        onClick={() => setIsVisible(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-500"
      >
        <X className="w-5 h-5" />
      </button>

      <div className="flex items-center">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
            <span className="text-white text-lg font-medium">
              {userName.charAt(0)}
            </span>
          </div>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-gray-900">
            Welcome back, {userName}!
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Have a great day at work!
          </p>
        </div>
      </div>
    </div>
  );
}
