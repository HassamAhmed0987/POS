import React from "react";
import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom";
import {
  Menu,
  Sun,
  Moon,
  Search,
  Bell,
  User,
  ShoppingBag,
  ExternalLink
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useOrders } from "../hooks/useOrders";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firbase";

export default function Header({ onToggleSidebar, isSidebarOpen }) {
  const location = useLocation();
  const { theme, toggleTheme, isDark } = useTheme();
  const { user } = useAuth();
  const { orders } = useOrders();

  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const getUserData = async () => {
      if (!user?.uid) return;

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          setUserData(userSnap.data());
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    getUserData();
  }, [user?.uid]);

  // Determine current page title
  const getPageTitle = (pathname) => {
    switch (pathname) {
      case "/":
      case "/dashboard":
        return "Dashboard";
      case "/orders":
        return "Orders Management";
      case "/products":
        return "Product Catalog";
      case "/categories":
        return "Categories";
      case "/customers":
        return "Customer Management";
      case "/pos":
        return "Point of Sale (POS)";
      case "/settings":
        return "Restaurant Settings";
      default:
        return "Fast Food Admin";
    }
  };

  const pendingOrdersCount = orders?.filter(
    (o) => o.status === "pending" || o.status === "confirmed"
  )?.length || 0;

  return (
    <header
      id="admin-header"
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 transition-colors duration-200"
    >
      {/* Left section: Sidebar Hamburger + Title */}
      <div className="flex items-center gap-3 md:gap-4">
        <button
          id="sidebar-toggle-btn"
          type="button"
          onClick={onToggleSidebar}
          aria-label="Toggle Sidebar"
          className="p-2 rounded-xl text-zinc-600 dark:text-zinc-300 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1
            id="header-page-title"
            className="text-lg md:text-xl font-extrabold text-zinc-900 dark:text-zinc-100 font-heading tracking-tight"
          >
            {getPageTitle(location.pathname)}
          </h1>
        </div>
      </div>

      {/* Right section: Search / Actions / Theme Toggle / Admin Profile */}
      <div className="flex items-center gap-2 md:gap-4">
        {/* Global Live Orders Indicator */}
        {pendingOrdersCount > 0 && (
          <div
            id="pending-orders-indicator"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 dark:bg-orange-500/15 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span>{pendingOrdersCount} Active {pendingOrdersCount === 1 ? "Order" : "Orders"}</span>
          </div>
        )}

        {/* Theme Toggle Button (MANDATED TO BE IN HEADER) */}
        <button
          id="header-theme-toggle-btn"
          type="button"
          onClick={toggleTheme}
          aria-label={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          title={`Switch to ${isDark ? "Light" : "Dark"} Mode`}
          className="p-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 hover:text-orange-500 dark:hover:text-orange-400 hover:border-orange-500/40 transition-all duration-200 shadow-2xs"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in spin-in-180 duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-zinc-700 animate-in spin-in-180 duration-300" />
          )}
        </button>

        {/* Admin Profile */}
        <div
          id="header-admin-profile"
          className="flex items-center gap-3 pl-2 sm:pl-3 border-l border-zinc-200 dark:border-zinc-800"
        >
          <div className="relative">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"}
              alt="Admin Profile"
              referrerPolicy="no-referrer"
              className="w-9 h-9 rounded-xl object-cover ring-2 ring-orange-500/30"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80";
              }}
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
          </div>

          <div className="hidden md:block text-left">
            <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-heading">
              {userData?.name}
            </p>
            <p className="text-[10px] font-semibold text-orange-500 uppercase tracking-wider">
              {userData?.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
