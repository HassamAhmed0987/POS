import React from "react";
import Modal from "./Modal";
import { PrintReceiptButton } from "./Receipt";
import { useOrderItems } from "../hooks/useOrderItems";
import { useOrders } from "../hooks/useOrders";
import { 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShoppingBag, 
  CheckCircle, 
  Clock, 
  ChefHat, 
  Truck, 
  XCircle,
  AlertCircle
} from "lucide-react";

export default function OrderDetailsModal({ order, isOpen, onClose }) {
  const { orderItems, isLoading: isItemsLoading } = useOrderItems(order?.id);
  const { updateOrderStatus, updatePaymentStatus } = useOrders();

  if (!order) return null;

  const handleStatusChange = async (newStatus) => {
    try {
      await updateOrderStatus({ id: order.id, status: newStatus });
      order.status = newStatus;
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus) => {
    try {
      await updatePaymentStatus({ id: order.id, paymentStatus: newPaymentStatus });
      order.paymentStatus = newPaymentStatus;
    } catch (err) {
      console.error("Failed to update payment status", err);
    }
  };

  const getStatusBadge = (status) => {
    const map = {
      pending: "bg-amber-500/10 text-amber-500 border-amber-500/30",
      confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/30",
      preparing: "bg-orange-500/10 text-orange-500 border-orange-500/30",
      ready: "bg-purple-500/10 text-purple-500 border-purple-500/30",
      delivered: "bg-emerald-500/10 text-emerald-500 border-emerald-500/30",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/30",
    };
    return map[status?.toLowerCase()] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/30";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details #${order.id}`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        {/* Header Ribbon with Actions & Thermal Print */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider border ${getStatusBadge(
                order.status
              )}`}
            >
              {order.status}
            </span>
            <span
              className={`px-3 py-1 rounded-xl text-xs font-bold uppercase tracking-wider ${
                order.orderType === "pos"
                  ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                  : "bg-blue-500/10 text-blue-400 border border-blue-500/30"
              }`}
            >
              {order.orderType === "pos" ? "POS Counter" : "Online Delivery"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <PrintReceiptButton
              order={order}
              items={orderItems}
              label="Print 80mm Receipt"
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20"
            />
          </div>
        </div>

        {/* Customer and Order Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Customer Information */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Name:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                  {order.customerName || "Walk-in Customer"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Phone:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" />
                  {order.customerPhone || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Customer ID:</span>
                <span className="font-mono text-xs text-zinc-700 dark:text-zinc-300">
                  {order.customerId || "WALK-IN"}
                </span>
              </div>
              <div className="pt-1 border-t border-zinc-100 dark:border-zinc-800/80">
                <span className="text-zinc-500 dark:text-zinc-400 block text-xs mb-1">
                  Delivery / Counter Address:
                </span>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 flex items-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                  <span>{order.customerAddress || "Walk-in Counter"}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Order Information */}
          <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
            <h4 className="text-xs font-bold uppercase tracking-wider text-orange-500 mb-3 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Order & Payment Info
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Order ID:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                  #{order.id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">Placed Date:</span>
                <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-zinc-400" />
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Payment Method:</span>
                <span className="font-bold uppercase text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                  {order.paymentMethod}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-500 dark:text-zinc-400">Payment Status:</span>
                <select
                  value={order.paymentStatus}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="text-xs font-bold uppercase px-2 py-1 rounded-lg bg-zinc-100 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Status Progression Buttons */}
        <div className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-2">
            Update Order Status Workflow:
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { key: "pending", label: "Pending", icon: Clock },
              { key: "confirmed", label: "Confirmed", icon: CheckCircle },
              { key: "preparing", label: "Preparing", icon: ChefHat },
              { key: "ready", label: "Ready", icon: CheckCircle },
              { key: "delivered", label: "Delivered", icon: Truck },
              { key: "cancelled", label: "Cancelled", icon: XCircle },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => handleStatusChange(key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  order.status === key
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20 scale-105"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order Items Table (Fetched by orderId) */}
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="px-4 py-3 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 font-heading">
              Order Items Breakdown
            </h4>
            <span className="text-xs text-zinc-500">
              {orderItems.length} {orderItems.length === 1 ? "item" : "items"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-100/60 dark:bg-zinc-800/40 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
                <tr>
                  <th className="py-2.5 px-4">Product Name</th>
                  <th className="py-2.5 px-4 text-center">Quantity</th>
                  <th className="py-2.5 px-4 text-right">Price</th>
                  <th className="py-2.5 px-4 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {isItemsLoading ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-zinc-400">
                      Loading order items...
                    </td>
                  </tr>
                ) : orderItems.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-6 text-zinc-400 italic">
                      No order items found.
                    </td>
                  </tr>
                ) : (
                  orderItems.map((item) => (
                    <tr key={item.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30">
                      <td className="py-3 px-4 font-semibold text-zinc-900 dark:text-zinc-100">
                        {item.productName || "Custom Item"}
                      </td>
                      <td className="py-3 px-4 text-center font-bold text-zinc-700 dark:text-zinc-300">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-600 dark:text-zinc-400">
                        Rs. {Number(item.price).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-zinc-900 dark:text-zinc-100">
                        Rs. {(item.total || item.quantity * item.price).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pricing Summary */}
          <div className="bg-zinc-50 dark:bg-zinc-800/40 p-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
            <div className="w-full max-w-xs space-y-1.5 text-sm">
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Subtotal</span>
                <span>Rs. {Number(order.subtotal || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                <span>Delivery Charges</span>
                <span>Rs. {Number(order.deliveryCharges || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-base font-extrabold text-zinc-900 dark:text-zinc-100 pt-2 border-t border-zinc-200 dark:border-zinc-700 font-heading">
                <span>Total Amount</span>
                <span className="text-orange-500">
                  Rs. {Number(order.total || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
