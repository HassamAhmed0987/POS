import React, { useState, useMemo } from "react";
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Eye, 
  Printer, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  ChefHat, 
  Truck, 
  XCircle,
  Plus
} from "lucide-react";
import { Link } from "react-router-dom";
import { useOrders } from "../hooks/useOrders";
import { useOrderItems } from "../hooks/useOrderItems";
import OrderDetailsModal from "../components/OrderDetailsModal";
import ConfirmDialog from "../components/ConfirmDialog";
import { PrintReceiptButton } from "../components/Receipt";

export default function Orders() {
  const { orders, isLoading, isError, updateOrderStatus, deleteOrder, refetch } = useOrders();
  const { orderItems } = useOrderItems();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all"); // 'all', 'online', 'pos'
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState("all"); // 'all', 'pending', 'paid', 'failed'
  
  const [activeOrder, setActiveOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return (orders || []).filter((order) => {
      // Search term matching ID, customer name, phone
      const matchesSearch =
        searchTerm === "" ||
        order.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatus === "all" || order.status === selectedStatus;

      // Type filter
      const matchesType = selectedType === "all" || order.orderType === selectedType;

      // Payment Status filter
      const matchesPayment =
        selectedPaymentStatus === "all" || order.paymentStatus === selectedPaymentStatus;

      return matchesSearch && matchesStatus && matchesType && matchesPayment;
    }).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, searchTerm, selectedStatus, selectedType, selectedPaymentStatus]);

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

  const handleQuickStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus({ id: orderId, status: newStatus });
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDeleteOrder = async () => {
    if (orderToDelete) {
      try {
        await deleteOrder(orderToDelete.id);
      } catch (err) {
        console.error("Failed to delete order", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Fast Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-heading">
            Orders Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Monitor and fulfill online delivery orders and counter POS checkouts
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-300 hover:text-orange-500 hover:border-orange-500/30 transition-colors shadow-2xs"
            title="Refresh Orders"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <Link
            to="/pos"
            id="orders-create-pos-btn"
            className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New POS Order</span>
          </Link>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="order-search-input"
              type="text"
              placeholder="Search Order ID, Name, Phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              id="order-status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Order Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Order Type Filter */}
          <div>
            <select
              id="order-type-filter"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Order Types (Online & POS)</option>
              <option value="online">Online Delivery Only</option>
              <option value="pos">POS / Counter Only</option>
            </select>
          </div>

          {/* Payment Status Filter */}
          <div>
            <select
              id="order-payment-filter"
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Payment Statuses</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Counts Tag Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <span className="text-zinc-400 font-medium">Quick Filters:</span>
          {[
            { label: "All", value: "all", count: orders?.length || 0 },
            { label: "Pending", value: "pending", count: orders?.filter((o) => o.status === "pending").length || 0 },
            { label: "Preparing", value: "preparing", count: orders?.filter((o) => o.status === "preparing").length || 0 },
            { label: "Ready", value: "ready", count: orders?.filter((o) => o.status === "ready").length || 0 },
            { label: "Delivered", value: "delivered", count: orders?.filter((o) => o.status === "delivered").length || 0 },
          ].map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setSelectedStatus(tab.value)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedStatus === tab.value
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table Container */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Order Type</th>
                <th className="py-3.5 px-4 text-right">Total</th>
                <th className="py-3.5 px-4">Payment Method</th>
                <th className="py-3.5 px-4">Payment Status</th>
                <th className="py-3.5 px-4">Order Status</th>
                <th className="py-3.5 px-4">Date / Time</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-zinc-400">
                    Loading orders database...
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-red-500">
                    Failed to load orders. Please retry.
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-12 text-zinc-400 italic">
                    No matching orders found. Try adjusting your search or filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => {
                  const itemsForOrder = orderItems.filter((i) => i.orderId === order.id);
                  return (
                    <tr
                      key={order.id}
                      id={`order-row-${order.id}`}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-4 px-4 font-mono font-bold text-xs text-orange-500">
                        #{order.id}
                      </td>
                      <td className="py-4 px-4">
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 text-xs">
                          {order.customerName || "Walk-in Customer"}
                        </div>
                        <div className="text-[11px] text-zinc-400">
                          {order.customerPhone || "Counter"}
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase tracking-wider ${
                            order.orderType === "pos"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {order.orderType === "pos" ? "POS" : "Online"}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right font-black text-sm text-zinc-900 dark:text-zinc-100 font-heading">
                        Rs. {Number(order.total || 0).toLocaleString()}
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-xs font-semibold capitalize text-zinc-800 dark:text-zinc-200">
                          {order.paymentMethod}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                              : order.paymentStatus === "pending"
                              ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                              : "bg-red-500/10 text-red-500 border border-red-500/20"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <select
                          value={order.status}
                          onChange={(e) => handleQuickStatusChange(order.id, e.target.value)}
                          className={`text-xs font-bold uppercase px-2.5 py-1 rounded-xl border focus:outline-none focus:border-orange-500 cursor-pointer ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          <option value="pending" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            Pending
                          </option>
                          <option value="confirmed" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            Confirmed
                          </option>
                          <option value="preparing" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            Preparing
                          </option>
                          <option value="ready" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            Ready
                          </option>
                          <option value="delivered" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            Delivered
                          </option>
                          <option value="cancelled" className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                            Cancelled
                          </option>
                        </select>
                      </td>
                      <td className="py-4 px-4 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString([], {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "N/A"}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setActiveOrder(order)}
                            title="View Full Order Details"
                            className="p-2 rounded-xl text-zinc-500 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          
                          <PrintReceiptButton
                            order={order}
                            items={itemsForOrder}
                            label=""
                            className="p-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 text-zinc-700 dark:text-zinc-300 hover:text-white"
                          />

                          <button
                            type="button"
                            onClick={() => setOrderToDelete(order)}
                            title="Delete Order"
                            className="p-2 rounded-xl text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Details Modal */}
      {activeOrder && (
        <OrderDetailsModal
          order={activeOrder}
          isOpen={!!activeOrder}
          onClose={() => setActiveOrder(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!orderToDelete}
        onClose={() => setOrderToDelete(null)}
        onConfirm={handleDeleteOrder}
        title="Delete Order Record"
        message={`Are you sure you want to permanently remove Order #${orderToDelete?.id}? This will also delete its linked order items.`}
        confirmText="Delete Order"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
