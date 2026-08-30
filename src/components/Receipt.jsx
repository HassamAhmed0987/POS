import React, { forwardRef, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { Printer } from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export const Receipt = forwardRef(({ order, items = [] }, ref) => {
  const { settings } = useSettings();

  if (!order) return null;

  const formattedDate = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : new Date().toLocaleDateString("en-GB");

  return (
    <div
      ref={ref}
      id={`receipt-${order.id}`}
      className="receipt-container bg-white text-black p-4 text-xs font-mono max-w-[80mm] mx-auto select-none"
      style={{
        width: "78mm",
        color: "#000",
        backgroundColor: "#fff",
        lineHeight: "1.35",
      }}
    >
      {/* Restaurant Header */}
      <div className="text-center pb-2 border-b border-dashed border-zinc-800">
        <h2 className="text-base font-black tracking-wider uppercase">
          {settings?.restaurantName || "FAST FOOD RESTAURANT"}
        </h2>
        {settings?.tagline && (
          <p className="text-[10px] text-zinc-700 italic">{settings.tagline}</p>
        )}
        <p className="text-[11px] text-zinc-800 mt-1">{settings?.address || "Karachi, Pakistan"}</p>
        <p className="text-[11px] text-zinc-800">Tel: {settings?.phone || "03001234567"}</p>
      </div>

      {/* Order Info */}
      <div className="py-2 border-b border-dashed border-zinc-800 text-[11px] space-y-0.5">
        <div className="flex justify-between">
          <span className="font-bold">Order ID:</span>
          <span className="font-bold">#{order.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="uppercase font-semibold">
            {order.orderType === "pos" ? "POS / Counter" : "Online Delivery"}
          </span>
        </div>
        <div className="flex justify-between">
          <span>Date:</span>
          <span>{formattedDate}</span>
        </div>
        <div className="flex justify-between">
          <span>Customer:</span>
          <span className="font-medium truncate max-w-[140px]">
            {order.customerName || "Walk-in Customer"}
          </span>
        </div>
        {order.customerPhone && order.customerPhone !== "03000000000" && (
          <div className="flex justify-between">
            <span>Phone:</span>
            <span>{order.customerPhone}</span>
          </div>
        )}
        {order.orderType === "online" && order.customerAddress && (
          <div className="pt-0.5 text-[10px] text-zinc-700">
            <span className="font-semibold">Address: </span>
            {order.customerAddress}
          </div>
        )}
      </div>

      {/* Items Table */}
      <div className="py-2 border-b border-dashed border-zinc-800">
        <div className="flex justify-between font-bold pb-1 text-[11px] border-b border-zinc-300">
          <span className="w-1/2">Item</span>
          <span className="w-1/4 text-center">Qty × Price</span>
          <span className="w-1/4 text-right">Total</span>
        </div>

        <div className="divide-y divide-zinc-100 text-[11px] pt-1 space-y-1">
          {items && items.length > 0 ? (
            items.map((item, idx) => (
              <div key={item.id || idx} className="pt-1 flex items-start justify-between">
                <div className="w-1/2 pr-1 font-semibold leading-tight">
                  {item.productName || item.name}
                </div>
                <div className="w-1/4 text-center text-zinc-700">
                  {item.quantity} × {item.price}
                </div>
                <div className="w-1/4 text-right font-bold">
                  {(item.total || item.quantity * item.price).toLocaleString()}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-2 text-zinc-500 italic">No items listed</div>
          )}
        </div>
      </div>

      {/* Summary Calculation */}
      <div className="py-2 border-b border-dashed border-zinc-800 text-[11px] space-y-1">
        <div className="flex justify-between text-zinc-800">
          <span>Subtotal</span>
          <span>Rs. {Number(order.subtotal || 0).toLocaleString()}</span>
        </div>
        {Number(order.deliveryCharges || 0) > 0 && (
          <div className="flex justify-between text-zinc-800">
            <span>Delivery Charges</span>
            <span>Rs. {Number(order.deliveryCharges).toLocaleString()}</span>
          </div>
        )}
        <div className="flex justify-between text-sm font-black pt-1 border-t border-zinc-400">
          <span>TOTAL</span>
          <span>Rs. {Number(order.total || 0).toLocaleString()}</span>
        </div>
      </div>

      {/* Payment and Status */}
      <div className="py-2 border-b border-dashed border-zinc-800 text-[11px] space-y-0.5">
        <div className="flex justify-between">
          <span>Payment Method:</span>
          <span className="uppercase font-bold">{order.paymentMethod || "Cash"}</span>
        </div>
        <div className="flex justify-between">
          <span>Payment Status:</span>
          <span className="uppercase font-semibold">{order.paymentStatus || "Paid"}</span>
        </div>
        <div className="flex justify-between">
          <span>Order Status:</span>
          <span className="uppercase font-semibold">{order.status || "Completed"}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center pt-3 pb-1 space-y-0.5">
        <p className="font-bold text-[11px]">Thank You For Your Business!</p>
        <p className="text-[10px] text-zinc-600">Please visit again</p>
        <p className="text-[9px] text-zinc-500 mt-1">*** Customer Copy ***</p>
      </div>
    </div>
  );
});

Receipt.displayName = "Receipt";

export function PrintReceiptButton({ order, items = [], className = "", label = "Print Receipt" }) {
  const receiptRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: receiptRef,
    documentTitle: `Receipt-${order?.id || "Order"}`,
  });

  return (
    <>
      {/* Hidden Thermal Receipt for Print */}
      <div style={{ display: "none" }}>
        <Receipt ref={receiptRef} order={order} items={items} />
      </div>

      <button
        type="button"
        id={`print-receipt-btn-${order?.id}`}
        onClick={handlePrint}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all ${
          className ||
          "bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-95"
        }`}
      >
        <Printer className="w-4 h-4" />
        <span>{label}</span>
      </button>
    </>
  );
}

export default Receipt;
