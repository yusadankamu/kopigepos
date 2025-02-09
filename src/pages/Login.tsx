import { useState, useEffect } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import { useNavigate } from "react-router-dom";
import { Coffee, X, CircleAlert } from "lucide-react";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const coffeeImages = [
    {
      url: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=800",
      title: "Perfect Morning Coffee",
      description: "Start your day with our signature blend",
    },
    {
      url: "https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800",
      title: "Artisanal Coffee Experience",
      description: "Carefully crafted by our expert baristas",
    },
    {
      url: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800",
      title: "Freshly Baked Treats",
      description: "Perfect companions for your coffee",
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) =>
        prev === coffeeImages.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        if (password.length < 6) {
          setError("Password must be at least 6 characters long");
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        // Update the user's display name
        if (userCredential.user) {
          await updateProfile(userCredential.user, {
            displayName: name,
          });
        }
      }
      navigate("/");
    } catch (err: any) {
      const errorMessages: { [key: string]: string } = {
        "auth/invalid-email": "Invalid email address",
        "auth/user-disabled": "This account has been disabled",
        "auth/user-not-found": "No account found with this email",
        "auth/wrong-password": "Incorrect password",
        "auth/email-already-in-use": "Email already in use",
        "auth/operation-not-allowed": "Operation not allowed",
        "auth/weak-password": "Password is too weak",
      };

      setError(
        errorMessages[err.code] || "An error occurred. Please try again."
      );
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError("");
    setEmail("");
    setPassword("");
    setName("");
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left Column - Image Carousel */}
      <div className="hidden md:flex md:w-1/2 relative overflow-hidden">
        {coffeeImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentImageIndex === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-black/40 z-10" />
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-20">
              <h2 className="text-3xl font-bold mb-2">{image.title}</h2>
              <p className="text-lg">{image.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Right Column - Login/Signup Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Coffee className="mx-auto h-12 w-12 text-gray-800" />
            <h2 className="mt-6 text-3xl font-bold text-gray-900">KopigePOS</h2>
            <p className="mt-2 text-sm text-gray-600">
              {isLogin ? "Sign in to your account" : "Create a new account"}
            </p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 text-red-500 p-4 rounded-md text-sm flex items-center">
                <CircleAlert className="w-5 h-5 mr-2" />
                {error}
                <button
                  type="button"
                  onClick={() => setError("")}
                  className="ml-auto"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="space-y-4">
              {!isLogin && (
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                    required={!isLogin}
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
                  required
                />
              </div>
            </div>

            {isLogin && (
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-gray-600 focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-gray-600 hover:text-gray-500"
                  >
                    Forgot your password?
                  </a>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              {isLogin ? "Sign in" : "Sign up"}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={toggleMode}
                className="text-sm text-gray-600 hover:text-gray-500"
              >
                {isLogin
                  ? "Don't have an account? Sign up"
                  : "Already have an account? Sign in"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
