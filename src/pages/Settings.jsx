import React, { useState, useEffect } from "react";
import { 
  Settings as SettingsIcon, 
  Store, 
  Clock, 
  Phone, 
  MapPin, 
  DollarSign, 
  CreditCard, 
  User, 
  Save, 
  CheckCircle,
  Image as ImageIcon
} from "lucide-react";
import { useSettings } from "../hooks/useSettings";

export default function Settings() {
  const { settings, updateSettings, isUpdating } = useSettings();

  const [formData, setFormData] = useState({
    restaurantName: "",
    tagline: "",
    logo: "",
    address: "",
    phone: "",
    email: "",
    openingTime: "11:00 AM",
    closingTime: "02:00 AM",
    minimumOrder: 300,
    deliveryCharges: 150,
    acceptCash: true,
    acceptCard: true,
    acceptOnline: true,
    adminProfile: {
      name: "Daniyal Khan",
      email: "admin@crispandgrill.com",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    },
  });

  const [showSavedToast, setShowSavedToast] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        restaurantName: settings.restaurantName || "",
        tagline: settings.tagline || "",
        logo: settings.logo || "",
        address: settings.address || "",
        phone: settings.phone || "",
        email: settings.email || "",
        openingTime: settings.openingTime || "11:00 AM",
        closingTime: settings.closingTime || "02:00 AM",
        minimumOrder: settings.minimumOrder ?? 300,
        deliveryCharges: settings.deliveryCharges ?? 150,
        acceptCash: settings.acceptCash ?? true,
        acceptCard: settings.acceptCard ?? true,
        acceptOnline: settings.acceptOnline ?? true,
        adminProfile: settings.adminProfile || {
          name: "Daniyal Khan",
          email: "admin@crispandgrill.com",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
      });
    }
  }, [settings]);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(formData);
      setShowSavedToast(true);
      setTimeout(() => setShowSavedToast(false), 3000);
    } catch (err) {
      console.error("Failed to update settings", err);
      alert("Failed to save settings.");
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-heading">
            Restaurant & Terminal Settings
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Configure restaurant identity, delivery charges, operational hours, and staff credentials
          </p>
        </div>

        {showSavedToast && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-xs font-bold animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* 1. Restaurant Identity Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-heading flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <Store className="w-4 h-4 text-orange-500" />
            <span>Restaurant Information</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Restaurant Name *
              </label>
              <input
                type="text"
                required
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Tagline / Motto
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
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
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Physical Address (Printed on Receipts) *
              </label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Opening Time
              </label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Closing Time
              </label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* 2. Order & Delivery Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-heading flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <DollarSign className="w-4 h-4 text-orange-500" />
            <span>Order & Delivery Fees</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Minimum Order Amount (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={formData.minimumOrder}
                onChange={(e) => setFormData({ ...formData, minimumOrder: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Flat Online Delivery Charges (Rs.)
              </label>
              <input
                type="number"
                min="0"
                value={formData.deliveryCharges}
                onChange={(e) => setFormData({ ...formData, deliveryCharges: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* 3. Payment Methods Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-heading flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <CreditCard className="w-4 h-4 text-orange-500" />
            <span>Accepted Payment Gateways</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptCash}
                onChange={(e) => setFormData({ ...formData, acceptCash: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
              />
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                  Cash on Delivery / Counter
                </span>
                <span className="text-[11px] text-zinc-400">Physical paper cash</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptCard}
                onChange={(e) => setFormData({ ...formData, acceptCard: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
              />
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                  Credit / Debit Card
                </span>
                <span className="text-[11px] text-zinc-400">POS Card Machine</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.acceptOnline}
                onChange={(e) => setFormData({ ...formData, acceptOnline: e.target.checked })}
                className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
              />
              <div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 block">
                  Online Payment
                </span>
                <span className="text-[11px] text-zinc-400">Digital Gateway / Wallet</span>
              </div>
            </label>
          </div>
        </div>

        {/* 4. Admin Profile Settings */}
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 font-heading flex items-center gap-2 border-b border-zinc-100 dark:border-zinc-800 pb-3">
            <User className="w-4 h-4 text-orange-500" />
            <span>Admin Profile</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Admin Full Name
              </label>
              <input
                type="text"
                value={formData.adminProfile.name}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminProfile: { ...formData.adminProfile, name: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                value={formData.adminProfile.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminProfile: { ...formData.adminProfile, email: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Profile Avatar URL (Unsplash)
              </label>
              <input
                type="url"
                value={formData.adminProfile.avatar}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    adminProfile: { ...formData.adminProfile, avatar: e.target.value },
                  })
                }
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>
        </div>

        {/* Save CTA */}
        <div className="flex justify-end">
          <button
            type="submit"
            id="save-settings-btn"
            disabled={isUpdating}
            className="px-6 py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{isUpdating ? "Saving Settings..." : "Save All Settings"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
