// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import AdminLayout from "../layouts/AdminLayout";
// import Dashboard from "../pages/Dashboard";
// import Orders from "../pages/Orders";
// import Products from "../pages/Products";
// import Categories from "../pages/Categories";
// import Customers from "../pages/Customers";
// import POS from "../pages/POS";
// import Settings from "../pages/Settings";
// import Login from "../pages/Login";
// import { useAuth } from "../context/AuthContext";

// function ProtectedLayout() {
//   const { user } = useAuth();
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//   return <AdminLayout />;
// }

// export default function AppRoutes() {
//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />

//       {/* Main Admin Routes */}
//       <Route element={<ProtectedLayout />}>
//         <Route path="/" element={<Navigate to="/dashboard" replace />} />
//         <Route path="/dashboard" element={<Dashboard />} />
//         <Route path="/orders" element={<Orders />} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/categories" element={<Categories />} />
//         <Route path="/customers" element={<Customers />} />
//         <Route path="/pos" element={<POS />} />
//         <Route path="/settings" element={<Settings />} />
//       </Route>

//       {/* Fallback */}
//       <Route path="*" element={<Navigate to="/dashboard" replace />} />
//     </Routes>
//   );
// }


import React from "react";
import {
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

import AdminLayout from "../layouts/AdminLayout";

import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Products from "../pages/Products";
import Categories from "../pages/Categories";
import Customers from "../pages/Customers";
import POS from "../pages/POS";
import Settings from "../pages/Settings";
import Login from "../pages/Login";

import { useAuth } from "../context/AuthContext";
import RoleRoute from "./RoleRoute";

function ProtectedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500">
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}

export default function AppRoutes() {
  return (
    <Routes>

      {/* Public */}
      <Route path="/login" element={<Login />} />

      {/* Authentication Required */}
      <Route element={<ProtectedLayout />}>

        {/* Default */}
        <Route
          path="/"
          element={<Navigate to="/dashboard" replace />}
        />

        {/* Admin + Cashier */}
        <Route element={<RoleRoute allowedRoles={["admin", "cashier"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/pos" element={<POS />} />
        </Route>

        {/* Admin Only */}
        <Route element={<RoleRoute allowedRoles={["admin"]} />}>
          <Route path="/products" element={<Products />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

      </Route>

      {/* Fallback */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />

    </Routes>
  );
}
