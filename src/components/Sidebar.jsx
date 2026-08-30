import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  FolderTree,
  Users,
  ReceiptText,
  Settings,
  LogOut,
  X,
  Flame,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import ConfirmDialog from "./ConfirmDialog";
import { useSettings } from "../hooks/useSettings";

export default function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Orders", path: "/orders", icon: ShoppingBag },
    { name: "Products", path: "/products", icon: UtensilsCrossed },
    { name: "Categories", path: "/categories", icon: FolderTree },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "POS", path: "/pos", icon: ReceiptText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          id="sidebar-backdrop"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        id="admin-sidebar"
        className={`fixed top-0 left-0 bottom-0 z-50 w-64 flex flex-col justify-between bg-zinc-900 border-r border-zinc-800 text-zinc-100 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand Header */}
        <div>
          <div className="flex items-center justify-between h-16 px-5 border-b border-zinc-800 bg-zinc-950/40">
            <NavLink
              to="/dashboard"
              className="flex items-center gap-3 group focus:outline-none"
              onClick={() => {
                if (window.innerWidth < 1024) onClose();
              }}
            >
              <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25 group-hover:scale-105 transition-transform">
                <Flame className="w-6 h-6 fill-white" />
              </div>
              <div className="text-left leading-tight">
                <span className="block font-black text-sm tracking-wider uppercase text-zinc-100 font-heading">
                  {settings?.restaurantName ? settings.restaurantName.substring(0, 16) : "FAST FOOD"}
                </span>
                <span className="block text-[10px] font-bold tracking-widest text-orange-500 uppercase">
                  ADMIN DASHBOARD
                </span>
              </div>
            </NavLink>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  id={`nav-${item.name.toLowerCase()}`}
                  onClick={() => {
                    if (window.innerWidth < 1024) onClose();
                  }}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
                      isActive
                        ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20 font-bold"
                        : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/80"
                    }`
                  }
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.name}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Divider & Logout */}
        <div className="p-3 border-t border-zinc-800 bg-zinc-950/20">
          <button
            type="button"
            id="sidebar-logout-btn"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-semibold text-sm text-zinc-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        message="Are you sure you want to logout of the admin dashboard?"
        confirmText="Logout"
        cancelText="Cancel"
        isDestructive={true}
      />
    </>
  );
}
