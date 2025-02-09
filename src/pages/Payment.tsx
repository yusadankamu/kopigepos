import { useState, useEffect, useRef } from "react";
import {
  CreditCard,
  Wallet,
  BadgeDollarSign,
  Printer,
  Share2,
  Plus,
  Minus,
  Search,
  CircleX,
} from "lucide-react";
import { MenuItem } from "../types";
import { collection, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import BillLayout from "../components/BillLayout";
import html2canvas from "html2canvas";

interface CartItem extends MenuItem {
  quantity: number;
}

type PaymentMethod = "cash" | "card" | "ewallet";

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function Payment() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [cashReceived, setCashReceived] = useState<number>(0);
  const [note, setNote] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("coffee");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showBill, setShowBill] = useState(false);
  const billRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const menuRef = collection(db, "menu");
      const snapshot = await getDocs(menuRef);
      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MenuItem[];
      setMenuItems(items);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const subtotal = calculateSubtotal();
  const tax = Math.round(subtotal * 0.11); // Ensure tax is rounded to whole number
  const total = subtotal + tax;
  const change = Math.max(0, cashReceived - total);

  const addToCart = (item: MenuItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (item.id === itemId) {
            const newQuantity = item.quantity + delta;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
      return updated;
    });

    // Reset cash received if cart is emptied
    if (cartItems.length === 1 && delta === -1) {
      setCashReceived(0);
    }
  };

  const removeFromCart = (itemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
    // Reset cash received if cart becomes empty
    if (cartItems.length === 1) {
      setCashReceived(0);
    }
  };

  const filteredItems = menuItems.filter(
    (item) =>
      item.category === selectedCategory &&
      (searchQuery === "" ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handlePrint = () => {
    if (cartItems.length === 0) {
      alert("Please add items to cart before printing");
      return;
    }

    setShowBill(true);
    setTimeout(() => {
      if (billRef.current) {
        const printContent = billRef.current;
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload();
      }
    }, 100);
  };

  const handleShare = async () => {
    if (cartItems.length === 0) {
      alert("Please add items to cart before sharing");
      return;
    }

    setShowBill(true);
    setTimeout(async () => {
      if (billRef.current) {
        try {
          const canvas = await html2canvas(billRef.current);
          const imageUrl = canvas.toDataURL("image/png");

          const response = await fetch(imageUrl);
          const blob = await response.blob();

          if (navigator.share) {
            await navigator.share({
              files: [new File([blob], "receipt.png", { type: "image/png" })],
              title: "Kopige Receipt",
              text: "Here is your receipt from Kopige Coffee",
            });
          } else {
            const link = document.createElement("a");
            link.href = imageUrl;
            link.download = "receipt.png";
            link.click();
          }
        } catch (error) {
          console.error("Error sharing receipt:", error);
        }
      }
      setShowBill(false);
    }, 100);
  };

  const handlePayment = async () => {
    if (cartItems.length === 0) {
      alert("Please add items to cart");
      return;
    }

    if (paymentMethod === "cash" && cashReceived < total) {
      alert("Insufficient cash received");
      return;
    }

    try {
      await addDoc(collection(db, "sales"), {
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        subtotal,
        tax,
        total,
        paymentMethod,
        cashReceived: paymentMethod === "cash" ? cashReceived : null,
        change: paymentMethod === "cash" ? change : null,
        note,
        timestamp: Timestamp.now(),
      });

      handlePrint();

      // Reset the form
      setCartItems([]);
      setCashReceived(0);
      setNote("");
      setPaymentMethod("cash");
    } catch (error) {
      console.error("Error processing payment:", error);
      alert("Error processing payment. Please try again.");
    }
  };

  const isPaymentValid = () => {
    if (cartItems.length === 0) return false;
    if (paymentMethod === "cash" && cashReceived < total) return false;
    return true;
  };

  return (
    <div className="h-screen flex flex-col lg:flex-row">
      {/* Menu Selection Section */}
      <div className="w-full lg:w-7/12 h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Search and Category Selection */}
        <div className="p-4 border-b">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search menu items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-gray-200"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2">
            {["coffee", "cookies", "sides"].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  selectedCategory === category
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <button
                key={item.id}
                onClick={() => item.available && addToCart(item)}
                disabled={!item.available}
                className={`relative group p-4 rounded-lg border ${
                  item.available
                    ? "hover:border-gray-300 hover:shadow-md"
                    : "opacity-50 cursor-not-allowed"
                }`}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-32 object-cover rounded-lg mb-2"
                />
                <h3 className="font-medium text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">
                  {item.description}
                </p>
                <p className="font-medium text-gray-900">
                  {formatIDR(item.price)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-5/12 h-full flex flex-col bg-white rounded-lg shadow-sm overflow-hidden lg:mt-0 mt-4">
        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <BadgeDollarSign className="w-12 h-12 mb-2" />
              <p>No items in cart</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-2 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-500">
                        {formatIDR(item.price)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Total: {formatIDR(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-1 rounded-full hover:bg-gray-100 text-red-500"
                    >
                      <CircleX className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="border-t bg-white">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatIDR(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax (11%)</span>
                <span>{formatIDR(tax)}</span>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <span>Total</span>
                <span>{formatIDR(total)}</span>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setPaymentMethod("cash")}
                className={`p-2 rounded-lg flex flex-col items-center text-sm ${
                  paymentMethod === "cash"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <Wallet className="w-5 h-5 mb-1" />
                Cash
              </button>
              <button
                onClick={() => setPaymentMethod("card")}
                className={`p-2 rounded-lg flex flex-col items-center text-sm ${
                  paymentMethod === "card"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <CreditCard className="w-5 h-5 mb-1" />
                Card
              </button>
              <button
                onClick={() => setPaymentMethod("ewallet")}
                className={`p-2 rounded-lg flex flex-col items-center text-sm ${
                  paymentMethod === "ewallet"
                    ? "bg-gray-800 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <BadgeDollarSign className="w-5 h-5 mb-1" />
                E-Wallet
              </button>
            </div>

            {/* Cash Payment Input */}
            {paymentMethod === "cash" && (
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Cash Received
                </label>
                <input
                  type="number"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-200"
                  min={0}
                />
                {cashReceived > 0 && (
                  <div className="flex justify-between text-sm font-medium">
                    <span>Change</span>
                    <span>{formatIDR(change)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Note Input */}
            <div className="hidden lg:block">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Note
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-gray-200"
                rows={2}
              />
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={handlePrint}
                disabled={cartItems.length === 0}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print
              </button>
              <button
                onClick={handleShare}
                disabled={cartItems.length === 0}
                className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </button>
            </div>

            <button
              onClick={handlePayment}
              disabled={!isPaymentValid()}
              className="w-full py-3 px-4 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Process Payment
            </button>
          </div>
        </div>
      </div>

      {/* Hidden Bill for Printing/Sharing */}
      {showBill && (
        <div className="fixed left-0 top-0 -z-10">
          <div ref={billRef}>
            <BillLayout
              cartItems={cartItems}
              subtotal={subtotal}
              tax={tax}
              total={total}
              paymentMethod={paymentMethod}
              cashReceived={cashReceived}
              change={change}
              note={note}
            />
          </div>
        </div>
      )}
    </div>
  );
}
