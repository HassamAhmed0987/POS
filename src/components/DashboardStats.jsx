import {
  ShoppingBag,
  DollarSign,
  UtensilsCrossed,
  Users,
  Clock,
  Calendar,
} from "lucide-react";

import StatCard from "../StatCard";

function DashboardStats({
  totalOrders,
  todayOrders,
  todaySales,
  pendingOrders,
  totalProducts,
  totalCustomers,
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      <StatCard
        id="stat-total-orders"
        title="Total Orders"
        value={totalOrders}
        icon={ShoppingBag}
        color="orange"
        trend="+14%"
        subtitle="All Time"
      />

      <StatCard
        id="stat-today-orders"
        title="Today's Orders"
        value={todayOrders}
        icon={Calendar}
        color="blue"
        trend="+8%"
        subtitle="Live shifts"
      />

      <StatCard
        id="stat-today-sales"
        title="Today's Sales"
        value={`Rs. ${todaySales.toLocaleString()}`}
        icon={DollarSign}
        color="green"
        trend="+22%"
        subtitle="Daily gross"
      />

      <StatCard
        id="stat-pending-orders"
        title="Pending Orders"
        value={pendingOrders}
        icon={Clock}
        color="amber"
        subtitle="Needs kitchen action"
      />

      <StatCard
        id="stat-total-products"
        title="Total Products"
        value={totalProducts}
        icon={UtensilsCrossed}
        color="purple"
        subtitle="Active menu"
      />

      <StatCard
        id="stat-total-customers"
        title="Total Customers"
        value={totalCustomers}
        icon={Users}
        color="blue"
        trend="+5%"
        subtitle="Registered"
      />
    </div>
  );
}

export default DashboardStats;