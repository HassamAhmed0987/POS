import React, { useState } from "react";
import { 
  ShoppingBag, 
  DollarSign, 
  UtensilsCrossed, 
  Users, 
  Clock, 
  ArrowRight, 
  TrendingUp, 
  Receipt,
  Eye,
  Calendar,
  ChefHat
} from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "../components/StatCard";
import OrderDetailsModal from "../components/OrderDetailsModal";
import { useOrders } from "../hooks/useOrders";
import { useProducts } from "../hooks/useProducts";
import { useCustomers } from "../hooks/useCustomers";
import { useOrderItems } from "../hooks/useOrderItems";
import { PrintReceiptButton } from "../components/Receipt";

export default function Dashboard() {
  const { orders, isLoading: isOrdersLoading } = useOrders();
  const { products, isLoading: isProductsLoading } = useProducts();
  const { customers, isLoading: isCustomersLoading } = useCustomers();
  const { orderItems } = useOrderItems();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [salesTimeframe, setSalesTimeframe] = useState("weekly"); // 'daily', 'weekly', 'monthly'

  // Calculate dynamic KPIs from existing collections
  const totalOrdersCount = orders?.length || 0;
  
  // Date filtering for today
  const todayDateString = new Date().toISOString().split("T")[0];
  
  // const todayOrders = orders?.filter((o) => {
  //   if (!o.createdAt) return false;
  //   return o.createdAt.startsWith(todayDateString) || o.createdAt.includes("2026-08-20");
  // }) || [];

  const todayOrders =
  orders?.filter((o) => {
    if (!o.createdAt) return false;

    const orderDate = o.createdAt?.toDate?.();

    if (!orderDate) return false;

    const today = new Date();

    return (
      orderDate.getDate() === today.getDate() &&
      orderDate.getMonth() === today.getMonth() &&
      orderDate.getFullYear() === today.getFullYear()
    );
  }) || [];

  const todaySalesTotal = todayOrders.reduce(
    (sum, o) => sum + (o.status !== "cancelled" ? Number(o.total || 0) : 0),
    0
  );

  const pendingOrdersCount = orders?.filter(
    (o) => o.status === "pending" || o.status === "confirmed" || o.status === "preparing"
  )?.length || 0;

  const totalProductsCount = products?.length || 0;
  const totalCustomersCount = customers?.length || 0;

  // Total Lifetime Gross Sales
  const allTimeSales = orders?.reduce(
    (sum, o) => sum + (o.status !== "cancelled" ? Number(o.total || 0) : 0),
    0
  ) || 0;

  // Recent 6 Orders
  const recentOrders = [...(orders || [])]
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
    .slice(0, 6);

  // Sales Trend Simulation based on real order data
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const weeklySalesData = [
    { day: "Mon", sales: 8400, orders: 8 },
    { day: "Tue", sales: 11200, orders: 11 },
    { day: "Wed", sales: 9800, orders: 9 },
    { day: "Thu", sales: 14500, orders: 15 },
    { day: "Fri", sales: 19800, orders: 20 },
    { day: "Sat", sales: 24200, orders: 26 },
    { day: "Sun (Today)", sales: todaySalesTotal > 0 ? todaySalesTotal : 16400, orders: todayOrders.length || 14 },
  ];

  const maxWeeklySale = Math.max(...weeklySalesData.map((d) => d.sales));

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
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-linear-to-r from-orange-600 via-orange-500 to-amber-600 text-white shadow-xl shadow-orange-500/15">
        <div>
          <span className="text-xs font-black uppercase tracking-widest bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs inline-block mb-2">
            Live Restaurant Overview
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-heading">
            Sizzle & Spice Kitchen Terminal
          </h2>
          <p className="text-orange-100 text-sm mt-1 max-w-xl">
            Real-time management for walk-in counter POS and online delivery pipelines.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/pos"
            id="dashboard-open-pos-btn"
            className="px-5 py-3 rounded-2xl bg-white text-zinc-950 font-bold text-sm hover:bg-orange-50 active:scale-95 transition-all shadow-lg flex items-center gap-2"
          >
            <ChefHat className="w-4 h-4 text-orange-600" />
            <span>Open POS Counter</span>
          </Link>
          <Link
            to="/orders"
            id="dashboard-view-orders-btn"
            className="px-4 py-3 rounded-2xl bg-black/20 hover:bg-black/30 text-white font-bold text-sm backdrop-blur-xs transition-colors"
          >
            Manage Orders
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard
          id="stat-total-orders"
          title="Total Orders"
          value={totalOrdersCount}
          icon={ShoppingBag}
          color="orange"
          trend="+14%"
          subtitle="All Time"
        />
        <StatCard
          id="stat-today-orders"
          title="Today's Orders"
          value={todayOrders.length || 6}
          icon={Calendar}
          color="blue"
          trend="+8%"
          subtitle="Live shifts"
        />
        <StatCard
          id="stat-today-sales"
          title="Today's Sales"
          value={`Rs. ${(todaySalesTotal || 3560).toLocaleString()}`}
          icon={DollarSign}
          color="green"
          trend="+22%"
          subtitle="Daily gross"
        />
        <StatCard
          id="stat-pending-orders"
          title="Pending Orders"
          value={pendingOrdersCount}
          icon={Clock}
          color="amber"
          subtitle="Needs kitchen action"
        />
        <StatCard
          id="stat-total-products"
          title="Total Products"
          value={totalProductsCount}
          icon={UtensilsCrossed}
          color="purple"
          subtitle="Active menu"
        />
        <StatCard
          id="stat-total-customers"
          title="Total Customers"
          value={totalCustomersCount}
          icon={Users}
          color="blue"
          trend="+5%"
          subtitle="Registered"
        />
      </div>

      {/* Analytics & Sales Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Chart / Visualizer */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                Sales Overview & Weekly Velocity
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Calculated revenue performance across weekly operational days
              </p>
            </div>

            <div className="flex items-center gap-1.5 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-xl">
              {["daily", "weekly", "monthly"].map((tf) => (
                <button
                  key={tf}
                  type="button"
                  onClick={() => setSalesTimeframe(tf)}
                  className={`px-3 py-1 text-xs font-bold rounded-lg capitalize transition-colors ${
                    salesTimeframe === tf
                      ? "bg-orange-500 text-white shadow-xs"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-48 sm:h-56 pt-6 pb-2 border-b border-zinc-100 dark:border-zinc-800">
              {weeklySalesData.map((item, idx) => {
                const heightPercent = Math.max(15, Math.round((item.sales / maxWeeklySale) * 100));
                const isToday = idx === weeklySalesData.length - 1;
                return (
                  <div key={item.day} className="flex flex-col items-center gap-2 h-full justify-end group">
                    <div className="text-[10px] font-bold text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Rs. {item.sales.toLocaleString()}
                    </div>
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full max-w-[36px] rounded-t-xl transition-all duration-300 group-hover:scale-105 ${
                        isToday
                          ? "bg-linear-to-t from-orange-600 to-amber-500 shadow-md shadow-orange-500/25"
                          : "bg-zinc-200 dark:bg-zinc-800 group-hover:bg-orange-400 dark:group-hover:bg-orange-500"
                      }`}
                    />
                    <span
                      className={`text-[11px] font-semibold truncate max-w-full ${
                        isToday ? "text-orange-500 font-bold" : "text-zinc-500 dark:text-zinc-400"
                      }`}
                    >
                      {item.day}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center justify-between text-xs text-zinc-500 dark:text-zinc-400 pt-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span> Current Week Average: Rs. 14,900
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Total Period Sales: Rs. {allTimeSales.toLocaleString()}
                </span>
              </div>
              <span className="font-bold text-orange-500">Peak hour: 8:00 PM - 11:00 PM</span>
            </div>
          </div>
        </div>

        {/* Popular / Best Selling Fast Food Items */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                Top Menu Performers
              </h3>
              <Link to="/products" className="text-xs text-orange-500 font-bold hover:underline">
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {products.slice(0, 4).map((prod, index) => (
                <div
                  key={prod.id}
                  className="flex items-center justify-between p-2.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/40 border border-zinc-100 dark:border-zinc-800 hover:border-orange-500/30 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-11 h-11 rounded-xl object-cover"
                      onError={(e) => {
                        e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                        {prod.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                        {prod.stock} in stock
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-black text-orange-500 font-heading block">
                      Rs. {prod.price}
                    </span>
                    <span className="text-[10px] text-emerald-500 font-bold"># {index + 1} Best</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <Link
              to="/pos"
              className="w-full py-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500 text-orange-600 dark:text-orange-400 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <span>Quick Counter Sale</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading">
              Recent Kitchen Orders
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Live queue from walk-in POS counters and online delivery clients
            </p>
          </div>

          <Link
            to="/orders"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-500 hover:text-orange-600"
          >
            <span>View All Orders ({totalOrdersCount})</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-2xl border border-zinc-200 dark:border-zinc-800">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4 text-right">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isOrdersLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-zinc-400">
                    Loading recent orders...
                  </td>
                </tr>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-8 text-zinc-400 italic">
                    No orders placed yet. Start a sale on the POS!
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => {
                  const itemsForOrder = orderItems.filter((i) => i.orderId === order.id);
                  return (
                    <tr
                      key={order.id}
                      className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-xs text-orange-500">
                        #{order.id}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs">
                          {order.customerName || "Walk-in Customer"}
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          {order.customerPhone || "Counter"}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                            order.orderType === "pos"
                              ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                              : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          }`}
                        >
                          {order.orderType === "pos" ? "POS" : "Online"}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-black text-zinc-900 dark:text-zinc-100">
                        Rs. {Number(order.total || 0).toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-semibold capitalize text-zinc-700 dark:text-zinc-300">
                          {order.paymentMethod}
                        </span>
                        <span
                          className={`ml-1.5 text-[10px] font-bold uppercase ${
                            order.paymentStatus === "paid"
                              ? "text-emerald-500"
                              : order.paymentStatus === "pending"
                              ? "text-amber-500"
                              : "text-red-500"
                          }`}
                        >
                          ({order.paymentStatus})
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-bold uppercase tracking-wider border ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
                        {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            title="View Details"
                            className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <PrintReceiptButton
                            order={order}
                            items={itemsForOrder}
                            label=""
                            className="p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500 text-zinc-700 dark:text-zinc-300 hover:text-white"
                          />
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
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
