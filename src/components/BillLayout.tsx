import { Coffee } from "lucide-react";
import { CartItem } from "../types";

interface BillLayoutProps {
  cartItems: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  cashReceived?: number;
  change?: number;
  note?: string;
}

const formatIDR = (amount: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
};

export default function BillLayout({
  cartItems,
  subtotal,
  tax,
  total,
  paymentMethod,
  cashReceived,
  change,
  note,
}: BillLayoutProps) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currentTime = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="w-[300px] bg-white p-6 mx-auto">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="flex justify-center mb-2">
          <Coffee className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-bold">Kopige Coffee</h1>
        <p className="text-sm text-gray-600">Jl. Nitimandala Renon No.666</p>
        <p className="text-sm text-gray-600">Denpasar, Bali - Indonesia</p>
        <p className="text-sm text-gray-600">Tel: (0361) 555-0123</p>
      </div>

      {/* Date and Time */}
      <div className="border-t border-b border-gray-200 py-2 mb-4">
        <div className="flex justify-between text-sm">
          <span>{currentDate}</span>
          <span>{currentTime}</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">
          Order #: {Math.random().toString(36).substr(2, 9).toUpperCase()}
        </div>
      </div>

      {/* Items */}
      <div className="mb-4">
        <div className="text-xs border-b border-gray-200 pb-2 mb-2">
          <div className="grid grid-cols-12 gap-1">
            <div className="col-span-6 font-semibold">Item</div>
            <div className="col-span-2 text-center font-semibold">Qty</div>
            <div className="col-span-4 text-right font-semibold">Amount</div>
          </div>
        </div>
        {cartItems.map((item, index) => (
          <div key={index} className="text-xs mb-2">
            <div className="grid grid-cols-12 gap-1">
              <div className="col-span-6">
                <div className="font-medium">{item.name}</div>
                <div className="text-gray-500">@ {formatIDR(item.price)}</div>
              </div>
              <div className="col-span-2 text-center">{item.quantity}</div>
              <div className="col-span-4 text-right">
                {formatIDR(item.price * item.quantity)}
              </div>
            </div>
          </div>
        ))}
        <div className="border-t border-gray-200 pt-2 mt-2">
          <div className="text-xs">
            <div className="flex justify-between py-1">
              <span>Subtotal</span>
              <span>{formatIDR(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Tax (11%)</span>
              <span>{formatIDR(tax)}</span>
            </div>
            <div className="flex justify-between py-1 font-bold">
              <span>Total</span>
              <span>{formatIDR(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="border-t border-gray-200 pt-2 mb-4 text-xs">
        <div className="flex justify-between py-1">
          <span>Payment Method</span>
          <span className="capitalize">{paymentMethod}</span>
        </div>
        {paymentMethod === "cash" && (
          <>
            <div className="flex justify-between py-1">
              <span>Cash Received</span>
              <span>{formatIDR(cashReceived || 0)}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Change</span>
              <span>{formatIDR(change || 0)}</span>
            </div>
          </>
        )}
      </div>

      {/* Note */}
      {note && (
        <div className="border-t border-gray-200 pt-2 mb-4 text-xs">
          <div className="font-medium mb-1">Note:</div>
          <div className="text-gray-600">{note}</div>
        </div>
      )}

      {/* Footer */}
      <div className="text-center text-xs text-gray-600 mt-6">
        <p className="font-medium mb-1">Thank you for your purchase!</p>
        <p>Follow us on Instagram @kopigecoffee</p>
      </div>
    </div>
  );
}
