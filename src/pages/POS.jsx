import React, { useState, useMemo, useRef } from "react";
import { 
  Search, 
  ShoppingCart, 
  Trash2, 
  Plus, 
  Minus, 
  CreditCard, 
  Banknote, 
  Printer, 
  CheckCircle, 
  User, 
  UtensilsCrossed, 
  Layers,
  ArrowRight,
  Flame,
  Clock
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { useCustomers } from "../hooks/useCustomers";
import { useOrders } from "../hooks/useOrders";
import { useOrderItems } from "../hooks/useOrderItems";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import { PrintReceiptButton } from "../components/Receipt";

export default function POS() {
  const { products, isLoading: isProductsLoading } = useProducts();
  const { categories } = useCategories();
  const { customers } = useCustomers();
  const { createOrder } = useOrders();
  const { createBulkOrderItems } = useOrderItems();

  // Search and Category Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Cart State: Array of { product, quantity }
  const [cart, setCart] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState("WALK-IN");
  const [customCustomerName, setCustomCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash"); // 'cash', 'card'
  const [diningOption, setDiningOption] = useState("dine-in"); // 'dine-in', 'takeaway'
  
  // Checkout & Receipt Modal
  const [placedOrder, setPlacedOrder] = useState(null);
  const [placedOrderItems, setPlacedOrderItems] = useState([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  // Category Map
  const categoryMap = useMemo(() => {
    const map = {};
    (categories || []).forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  // Filtered Products for POS
  const filteredProducts = useMemo(() => {
    return (products || []).filter((prod) => {
      const matchesSearch =
        searchTerm === "" ||
        prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || prod.categoryId === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Cart Calculations
  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const deliveryCharges = 0; // POS Counter orders have 0 delivery charges
  const totalAmount = subtotal + deliveryCharges;

  // Cart Operations
  const handleAddToCart = (product) => {
    if (!product.isAvailable) return;
    setCart((prevCart) => {
      const existing = prevCart.find((i) => i.product.id === product.id);
      if (existing) {
        return prevCart.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevCart, { product, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart
        .map((i) => {
          if (i.product.id === productId) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter(Boolean);
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((i) => i.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Place POS Order
  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const orderId = `ORD${Date.now().toString().slice(-6)}`;
      
      let customerName = "Walk-in Customer";
      let customerPhone = "03000000000";
      let customerAddress = diningOption === "dine-in" ? "Counter Dine-in" : "Counter Takeaway";

      if (selectedCustomerId !== "WALK-IN") {
        const found = customers?.find((c) => c.id === selectedCustomerId);
        if (found) {
          customerName = found.name;
          customerPhone = found.phone;
        }
      } else if (customCustomerName.trim()) {
        customerName = customCustomerName.trim();
      }

      // 1. Create order in Orders collection (orderType: "pos")
      const newOrder = {
        id: orderId,
        orderType: "pos",
        customerId: selectedCustomerId,
        customerName,
        customerPhone,
        customerAddress,
        subtotal,
        deliveryCharges: 0,
        total: totalAmount,
        paymentMethod,
        paymentStatus: "paid",
        status: "preparing",
        createdAt: new Date().toISOString(),
      };

      // 2. Create items in OrderItem collection connected by orderId
      const itemsToCreate = cart.map((item, idx) => ({
        id: `OI${Date.now().toString().slice(-6)}${idx}`,
        orderId,
        productId: item.product.id,
        productName: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        total: item.product.price * item.quantity,
      }));

      await createOrder(newOrder);
      await createBulkOrderItems(itemsToCreate);

      // Set order & items for instant thermal receipt modal
      setPlacedOrder(newOrder);
      setPlacedOrderItems(itemsToCreate);
      setCart([]);
      setCustomCustomerName("");
    } catch (err) {
      console.error("Failed to place POS order", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* POS Two-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Menu Catalog (Products & Categories) */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          {/* Header Controls: Search & Category Chips */}
          <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                id="pos-search-input"
                type="text"
                placeholder="Search menu items (e.g. Zinger, Pizza, Fries)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500"
              />
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory("all")}
                className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === "all"
                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                All Menu ({products?.length || 0})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          {isProductsLoading ? (
            <div className="text-center py-20 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              Loading menu products...
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
              <UtensilsCrossed className="w-12 h-12 mx-auto mb-2 text-zinc-400" />
              <p className="text-sm font-bold">No products match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  categoryName={categoryMap[prod.categoryId]}
                  mode="pos"
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Walk-in POS Cart & Instant Checkout */}
        <div className="lg:col-span-5 xl:col-span-4 sticky top-20">
          <div className="rounded-3xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden flex flex-col max-h-[calc(100vh-100px)]">
            {/* Cart Header */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/80 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-orange-500" />
                <h3 className="text-base font-extrabold text-zinc-900 dark:text-zinc-100 font-heading">
                  Active POS Cart
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-black bg-orange-500 text-white">
                  {cart.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>

              {cart.length > 0 && (
                <button
                  type="button"
                  onClick={handleClearCart}
                  className="text-xs font-bold text-red-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Customer & Dining Selection */}
            <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 space-y-3 bg-zinc-50/50 dark:bg-zinc-900/40">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setDiningOption("dine-in")}
                  className={`py-2 rounded-xl text-xs font-bold text-center transition-all ${
                    diningOption === "dine-in"
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  🍔 Dine-in
                </button>
                <button
                  type="button"
                  onClick={() => setDiningOption("takeaway")}
                  className={`py-2 rounded-xl text-xs font-bold text-center transition-all ${
                    diningOption === "takeaway"
                      ? "bg-orange-500 text-white shadow-xs"
                      : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400"
                  }`}
                >
                  🥡 Takeaway
                </button>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 block mb-1">
                  Customer (Optional)
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-medium text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500 mb-1.5"
                >
                  <option value="WALK-IN">Walk-in Customer (Standard Counter)</option>
                  {customers?.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>

                {selectedCustomerId === "WALK-IN" && (
                  <input
                    type="text"
                    placeholder="Enter customer name / Table # (optional)"
                    value={customCustomerName}
                    onChange={(e) => setCustomCustomerName(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
                  />
                )}
              </div>
            </div>

            {/* Cart Items List */}
            <div className="p-4 overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-800/80 space-y-2 max-h-64">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-zinc-400">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-zinc-300 dark:text-zinc-700 stroke-1" />
                  <p className="text-xs font-semibold">Cart is currently empty</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">
                    Click items on the left to add to checkout
                  </p>
                </div>
              ) : (
                cart.map((item) => (
                  <div
                    key={item.product.id}
                    className="pt-2 flex items-center justify-between gap-2"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                        {item.product.name}
                      </h4>
                      <p className="text-[11px] text-orange-500 font-bold font-heading">
                        Rs. {item.product.price}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 rounded-xl p-1">
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, -1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center hover:text-orange-500 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-black text-zinc-900 dark:text-zinc-100">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateQuantity(item.product.id, 1)}
                        className="w-6 h-6 rounded-lg bg-white dark:bg-zinc-700 text-zinc-700 dark:text-zinc-200 flex items-center justify-center hover:text-orange-500 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <div className="text-right w-16">
                      <span className="text-xs font-black text-zinc-900 dark:text-zinc-100 font-heading block">
                        Rs. {item.product.price * item.quantity}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveFromCart(item.product.id)}
                      className="text-zinc-400 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Cart Footer / Payment & Place Order */}
            <div className="p-4 bg-zinc-50 dark:bg-zinc-800/60 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
              {/* Payment Method Selector */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block mb-1.5">
                  Payment Method
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod("cash")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      paymentMethod === "cash"
                        ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-600 dark:text-emerald-400 shadow-xs"
                        : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <Banknote className="w-4 h-4" />
                    <span>Cash</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod("card")}
                    className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                      paymentMethod === "card"
                        ? "bg-purple-500/10 border-purple-500/40 text-purple-600 dark:text-purple-400 shadow-xs"
                        : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Card</span>
                  </button>
                </div>
              </div>

              {/* Total Calculation */}
              <div className="space-y-1 pt-1 border-t border-zinc-200 dark:border-zinc-700/80 text-xs">
                <div className="flex justify-between text-zinc-500">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>Delivery / Takeaway Fee</span>
                  <span>Rs. 0</span>
                </div>
                <div className="flex justify-between text-base font-black text-zinc-900 dark:text-zinc-100 pt-1 font-heading">
                  <span>TOTAL PAYABLE</span>
                  <span className="text-orange-500">
                    Rs. {totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="button"
                id="pos-place-order-btn"
                disabled={cart.length === 0 || isPlacingOrder}
                onClick={handlePlaceOrder}
                className="w-full py-3 rounded-2xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <span>Processing Counter Order...</span>
                ) : (
                  <>
                    <span>Place Order & Print</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Instant Order Placed & Thermal Receipt Modal */}
      {placedOrder && (
        <Modal
          isOpen={!!placedOrder}
          onClose={() => setPlacedOrder(null)}
          title="Order Successfully Placed!"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-center">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-heading">
                Order #{placedOrder.id}
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Sent to kitchen queue. Total paid: <strong className="text-orange-500">Rs. {placedOrder.total}</strong> ({placedOrder.paymentMethod})
              </p>
            </div>

            {/* Thermal Print Action */}
            <div className="p-4 rounded-2xl bg-zinc-50 dark:bg-zinc-800/80 border border-zinc-200 dark:border-zinc-700 flex flex-col items-center gap-3">
              <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Ready for 80mm Thermal Printer
              </span>
              <PrintReceiptButton
                order={placedOrder}
                items={placedOrderItems}
                label="Print 80mm Customer Receipt"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20 py-2.5"
              />
            </div>

            <button
              type="button"
              onClick={() => setPlacedOrder(null)}
              className="w-full py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-bold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Start Next Counter Sale
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
