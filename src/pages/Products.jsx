import React, { useState, useMemo } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  UtensilsCrossed, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  Sparkles
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import ProductCard from "../components/ProductCard";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

const UNSPLASH_PRESETS = [
  { label: "Classic Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80" },
  { label: "Smash Burger", url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=600&auto=format&fit=crop&q=80" },
  { label: "Cheesy Pizza", url: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=600&auto=format&fit=crop&q=80" },
  { label: "Crispy Fries", url: "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&auto=format&fit=crop&q=80" },
  { label: "Loaded Fries", url: "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&auto=format&fit=crop&q=80" },
  { label: "Shawarma Wrap", url: "https://images.unsplash.com/photo-1648838776602-53b050d249f7?w=600&auto=format&fit=crop&q=80" },
  { label: "Iced Beverage", url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&auto=format&fit=crop&q=80" },
  { label: "Oreo Shake", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80" },
  { label: "Chocolate Cake", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80" },
];

export default function Products() {
  const { 
    products, 
    isLoading, 
    createProduct, 
    updateProduct, 
    toggleAvailability, 
    deleteProduct 
  } = useProducts();
  const { categories } = useCategories();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedAvailability, setSelectedAvailability] = useState("all"); // 'all', 'available', 'unavailable'
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'

  // Modal states
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
    stock: 50,
    isAvailable: true,
  });

  const categoryMap = useMemo(() => {
    const map = {};
    (categories || []).forEach((c) => {
      map[c.id] = c.name;
    });
    return map;
  }, [categories]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return (products || []).filter((prod) => {
      const matchesSearch =
        searchTerm === "" ||
        prod.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        prod.id?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || prod.categoryId === selectedCategory;

      const matchesAvailability =
        selectedAvailability === "all" ||
        (selectedAvailability === "available" && prod.isAvailable) ||
        (selectedAvailability === "unavailable" && !prod.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, searchTerm, selectedCategory, selectedAvailability]);

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      categoryId: categories[0]?.id || "C001",
      description: "",
      price: "",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      stock: 50,
      isAvailable: true,
    });
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || "",
      categoryId: product.categoryId || categories[0]?.id || "C001",
      description: product.description || "",
      price: product.price || "",
      image: product.image || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80",
      stock: product.stock ?? 50,
      isAvailable: product.isAvailable ?? true,
    });
    setIsFormModalOpen(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.categoryId) {
      alert("Please fill in the product name, price, and category.");
      return;
    }

    try {
      const payload = {
        name: formData.name.trim(),
        categoryId: formData.categoryId,
        description: formData.description.trim(),
        price: Number(formData.price),
        image: formData.image.trim(),
        stock: Number(formData.stock),
        isAvailable: Boolean(formData.isAvailable),
      };

      if (editingProduct) {
        await updateProduct({ id: editingProduct.id, data: { ...editingProduct, ...payload } });
      } else {
        payload.id = `P00${(products?.length || 0) + 1}`;
        payload.createdAt = new Date().toISOString();
        await createProduct(payload);
      }
      setIsFormModalOpen(false);
    } catch (err) {
      console.error("Failed to save product", err);
    }
  };

  const handleDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete.id);
      } catch (err) {
        console.error("Failed to delete product", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-heading">
            Products Catalog
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage fast food menu items, prices, stock levels and availability
          </p>
        </div>

        <button
          type="button"
          id="add-product-btn"
          onClick={handleOpenAddModal}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters and Controls */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              id="product-search-input"
              type="text"
              placeholder="Search by name, description, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <select
              id="product-category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              id="product-availability-filter"
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-orange-500"
            >
              <option value="all">All Availability Statuses</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable / Out of Stock</option>
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800 text-xs">
          <span className="text-zinc-400 font-medium">Category:</span>
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
              selectedCategory === "all"
                ? "bg-orange-500 text-white shadow-xs"
                : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            }`}
          >
            All ({products?.length || 0})
          </button>
          {categories.map((cat) => {
            const count = products?.filter((p) => p.categoryId === cat.id).length || 0;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-orange-500 text-white shadow-xs"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Products Display Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          Loading products catalog...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <UtensilsCrossed className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
          <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200 font-heading">
            No products found
          </h4>
          <p className="text-xs text-zinc-500 mt-1">
            Try resetting your search query or add a new menu item.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              categoryName={categoryMap[prod.categoryId] || "Menu Item"}
              mode="catalog"
              onEdit={handleOpenEditModal}
              onToggleStatus={(p) =>
                toggleAvailability({ id: p.id, isAvailable: !p.isAvailable })
              }
            />
          ))}
        </div>
      )}

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title={editingProduct ? `Edit Product (${editingProduct.id})` : "Add New Menu Product"}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmitForm} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Product Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Zinger Supreme Burger"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Category *
              </label>
              <select
                required
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Price (Rs.) *
              </label>
              <input
                type="number"
                required
                min="1"
                placeholder="450"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="Fresh crispy fillet, double cheese sauce, jalapeños..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Initial Stock Count
              </label>
              <input
                type="number"
                min="0"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
                Status
              </label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 text-xs font-semibold text-zinc-800 dark:text-zinc-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAvailable}
                    onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                    className="w-4 h-4 rounded text-orange-500 focus:ring-orange-400"
                  />
                  <span>Is Available for Ordering</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Product Image (Unsplash URL) *
            </label>
            <input
              type="url"
              required
              placeholder="https://images.unsplash.com/..."
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
            
            {/* Quick Unsplash Food Presets */}
            <div className="mt-2">
              <span className="text-[11px] text-zinc-400 block mb-1">Quick Unsplash Presets:</span>
              <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto">
                {UNSPLASH_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setFormData({ ...formData, image: preset.url })}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-orange-500 hover:border-orange-500 border border-transparent transition-colors"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-zinc-200 dark:border-zinc-800">
            {editingProduct ? (
              <button
                type="button"
                onClick={() => {
                  setProductToDelete(editingProduct);
                  setIsFormModalOpen(false);
                }}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
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
                {editingProduct ? "Save Changes" : "Create Product"}
              </button>
            </div>
          </div>
        </form>
      </Modal>

      {/* Delete Product Confirmation */}
      <ConfirmDialog
        isOpen={!!productToDelete}
        onClose={() => setProductToDelete(null)}
        onConfirm={handleDeleteProduct}
        title="Delete Menu Product"
        message={`Are you sure you want to permanently delete "${productToDelete?.name}"?`}
        confirmText="Delete Product"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
