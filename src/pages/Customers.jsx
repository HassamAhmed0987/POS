import React, { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Plus, 
  Eye, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingBag, 
  DollarSign, 
  Calendar,
  UserCheck,
  UserX,
  Edit3,
  Trash2
} from "lucide-react";
import { useCustomers } from "../hooks/useCustomers";
import { useOrders } from "../hooks/useOrders";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Customers() {
  const { 
    customers, 
    isLoading, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
  } = useCustomers();
  const { orders } = useOrders();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    isActive: true,
  });

  const filteredCustomers = useMemo(() => {
    return (customers || []).filter((c) => {
      return (
        searchTerm === "" ||
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [customers, searchTerm]);

  // Customer's order history linked from orders collection
  const customerOrders = useMemo(() => {
    if (!selectedCustomer) return [];
    return (orders || []).filter(
      (o) =>
        o.customerId === selectedCustomer.id ||
        (o.customerPhone && o.customerPhone === selectedCustomer.phone)
    ).sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
  }, [orders, selectedCustomer]);

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      address: "",
      isActive: true,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingCustomer(c);
    setFormData({
      name: c.name || "",
      email: c.email || "",
      phone: c.phone || "",
      address: c.address || "",
      isActive: c.isActive ?? true,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        isActive: Boolean(formData.isActive),
      };

      if (editingCustomer) {
        await updateCustomer({
          id: editingCustomer.id,
          data: { ...editingCustomer, ...payload },
        });
      } else {
        payload.id = `CU00${(customers?.length || 0) + 1}`;
        payload.totalOrders = 0;
        payload.totalSpent = 0;
        payload.createdAt = new Date().toISOString();
        await createCustomer(payload);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save customer", err);
    }
  };

  const handleDelete = async () => {
    if (customerToDelete) {
      try {
        await deleteCustomer(customerToDelete.id);
      } catch (err) {
        console.error("Failed to delete customer", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-heading">
            Customer Directory
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Track customer profiles, loyalty order history, and delivery addresses
          </p>
        </div>

        <button
          type="button"
          id="add-customer-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Customer</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="customer-search-input"
            type="text"
            placeholder="Search by name, email, phone or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="text-xs text-zinc-500 font-semibold">
          Total Customers: <span className="text-orange-500 font-bold">{customers?.length || 0}</span>
        </div>
      </div>

      {/* Customers Table */}
      <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="py-3.5 px-4">Customer ID</th>
                <th className="py-3.5 px-4">Name</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Address</th>
                <th className="py-3.5 px-4 text-center">Total Orders</th>
                <th className="py-3.5 px-4 text-right">Total Spent</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-zinc-400">
                    Loading customer profiles...
                  </td>
                </tr>
              ) : filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-12 text-zinc-400 italic">
                    No customer records match your query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => (
                  <tr
                    key={cust.id}
                    id={`customer-row-${cust.id}`}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="py-4 px-4 font-mono font-bold text-xs text-orange-500">
                      {cust.id}
                    </td>
                    <td className="py-4 px-4 font-bold text-zinc-900 dark:text-zinc-100">
                      {cust.name}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-xs text-zinc-800 dark:text-zinc-200 font-medium">
                        {cust.phone}
                      </div>
                      <div className="text-[11px] text-zinc-400 truncate max-w-[180px]">
                        {cust.email || "No email"}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-xs text-zinc-600 dark:text-zinc-400 max-w-[200px] truncate">
                      {cust.address || "Counter / Dine-in"}
                    </td>
                    <td className="py-4 px-4 text-center font-bold text-zinc-900 dark:text-zinc-100">
                      {cust.totalOrders || 0}
                    </td>
                    <td className="py-4 px-4 text-right font-black text-orange-500 font-heading">
                      Rs. {Number(cust.totalSpent || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase ${
                          cust.isActive
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border border-zinc-500/20"
                        }`}
                      >
                        {cust.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedCustomer(cust)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="View Customer Order History"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(cust)}
                          className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                          title="Edit Customer"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setCustomerToDelete(cust)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer Details & Order History Modal */}
      {selectedCustomer && (
        <Modal
          isOpen={!!selectedCustomer}
          onClose={() => setSelectedCustomer(null)}
          title={`Customer Profile: ${selectedCustomer.name}`}
          maxWidth="max-w-3xl"
        >
          <div className="space-y-6">
            {/* Customer Profile Header */}
            <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Customer Name
                </span>
                <h4 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                  {selectedCustomer.name}
                </h4>
                <span className="text-xs font-mono text-orange-500 font-bold">
                  {selectedCustomer.id}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Contact Details
                </span>
                <p className="text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-zinc-400" /> {selectedCustomer.phone}
                </p>
                <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                  <Mail className="w-3.5 h-3.5 text-zinc-400" /> {selectedCustomer.email || "N/A"}
                </p>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Lifetime Value
                </span>
                <p className="text-base font-black text-orange-500 font-heading">
                  Rs. {Number(selectedCustomer.totalSpent || 0).toLocaleString()}
                </p>
                <p className="text-xs text-zinc-500 font-medium">
                  {selectedCustomer.totalOrders || 0} Total Orders
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                  Saved Delivery Address
                </span>
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200 mt-0.5">
                  {selectedCustomer.address || "Counter Walk-in / Dine-in customer"}
                </p>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-3 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-orange-500" /> Order History ({customerOrders.length})
              </h4>

              {customerOrders.length === 0 ? (
                <div className="p-6 text-center text-xs text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800/30 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                  No orders recorded for this customer yet.
                </div>
              ) : (
                <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-100/60 dark:bg-zinc-800/50 text-[11px] font-bold uppercase text-zinc-500 border-b border-zinc-200 dark:border-zinc-800">
                      <tr>
                        <th className="py-2.5 px-3">Order ID</th>
                        <th className="py-2.5 px-3">Type</th>
                        <th className="py-2.5 px-3">Date</th>
                        <th className="py-2.5 px-3 text-right">Total</th>
                        <th className="py-2.5 px-3">Payment</th>
                        <th className="py-2.5 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                      {customerOrders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40">
                          <td className="py-3 px-3 font-mono font-bold text-orange-500">
                            #{ord.id}
                          </td>
                          <td className="py-3 px-3 uppercase font-semibold text-[10px]">
                            {ord.orderType}
                          </td>
                          <td className="py-3 px-3 text-zinc-500">
                            {new Date(ord.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-3 text-right font-bold text-zinc-900 dark:text-zinc-100">
                            Rs. {ord.total}
                          </td>
                          <td className="py-3 px-3 capitalize text-zinc-700 dark:text-zinc-300">
                            {ord.paymentMethod}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200">
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Add / Edit Customer Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingCustomer ? `Edit Customer (${editingCustomer.id})` : "Add Customer Profile"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Customer Full Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Daniyal Khan"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Phone Number *
            </label>
            <input
              type="tel"
              required
              placeholder="03001234567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              placeholder="customer@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Delivery Address
            </label>
            <textarea
              rows={2}
              placeholder="Street, Building, Sector, Area..."
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
              />
              <span>Customer Account is Active</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsFormModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              {editingCustomer ? "Save Changes" : "Create Customer"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Customer Dialog */}
      <ConfirmDialog
        isOpen={!!customerToDelete}
        onClose={() => setCustomerToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Customer"
        message={`Are you sure you want to delete customer "${customerToDelete?.name}"?`}
        confirmText="Delete Customer"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
