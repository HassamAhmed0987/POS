import React, { useState, useMemo } from "react";
import { 
  FolderTree, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Layers 
} from "lucide-react";
import { useCategories } from "../hooks/useCategories";
import { useProducts } from "../hooks/useProducts";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";

export default function Categories() {
  const { 
    categories, 
    isLoading, 
    createCategory, 
    updateCategory, 
    toggleCategoryStatus, 
    deleteCategory 
  } = useCategories();
  const { products } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Form State - strictly id, name, description, isActive, createdAt (NO IMAGE FIELD)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const filteredCategories = useMemo(() => {
    return (categories || []).filter((cat) => {
      return (
        searchTerm === "" ||
        cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cat.id?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [categories, searchTerm]);

  // Product counts per category
  const productCountMap = useMemo(() => {
    const map = {};
    (products || []).forEach((p) => {
      map[p.categoryId] = (map[p.categoryId] || 0) + 1;
    });
    return map;
  }, [products]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || "",
      description: category.description || "",
      isActive: category.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      const payload = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isActive: Boolean(formData.isActive),
      };

      if (editingCategory) {
        await updateCategory({
          id: editingCategory.id,
          data: { ...editingCategory, ...payload },
        });
      } else {
        payload.id = `C00${(categories?.length || 0) + 1}`;
        payload.createdAt = new Date().toISOString();
        await createCategory(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error("Failed to save category", err);
    }
  };

  const handleDelete = async () => {
    if (categoryToDelete) {
      try {
        await deleteCategory(categoryToDelete.id);
      } catch (err) {
        console.error("Failed to delete category", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-100 font-heading">
            Category Management
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Organize fast food items into searchable menu groups
          </p>
        </div>

        <button
          type="button"
          id="add-category-btn"
          onClick={handleOpenAdd}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-orange-500/20 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search and Quick Overview */}
      <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            id="category-search-input"
            type="text"
            placeholder="Search categories by name or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        <div className="text-xs text-zinc-500 font-semibold">
          Total: <span className="text-orange-500 font-bold">{categories?.length || 0}</span> Categories
        </div>
      </div>

      {/* Categories Cards Grid */}
      {isLoading ? (
        <div className="text-center py-16 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          Loading menu categories...
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="text-center py-16 text-zinc-400 bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800">
          <FolderTree className="w-12 h-12 mx-auto mb-3 text-zinc-300 dark:text-zinc-700" />
          <h4 className="text-base font-bold text-zinc-800 dark:text-zinc-200 font-heading">
            No categories found
          </h4>
          <p className="text-xs text-zinc-500 mt-1">
            Create a new category to group your food products.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCategories.map((cat) => {
            const count = productCountMap[cat.id] || 0;
            return (
              <div
                key={cat.id}
                id={`category-card-${cat.id}`}
                className="flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:border-orange-500/40 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold">
                        <FolderTree className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-heading">
                          {cat.name}
                        </h3>
                        <span className="text-[11px] font-mono text-zinc-400">ID: {cat.id}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        toggleCategoryStatus({ id: cat.id, isActive: !cat.isActive })
                      }
                      title={cat.isActive ? "Deactivate Category" : "Activate Category"}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                        cat.isActive
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/30"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/30"
                      }`}
                    >
                      {cat.isActive ? "Active" : "Inactive"}
                    </button>
                  </div>

                  <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed min-h-[32px]">
                    {cat.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-orange-500" />
                    <span>{count} {count === 1 ? "Product" : "Products"}</span>
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(cat)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-orange-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingCategory ? `Edit Category (${editingCategory.id})` : "Add Menu Category"}
        maxWidth="max-w-md"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Category Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Burgers, Pizza, Desserts"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-sm text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Brief description of this menu section..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
              <span>Category is Active (Visible on POS and Online Ordering)</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-zinc-200 dark:border-zinc-700 text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-md shadow-orange-500/20"
            >
              {editingCategory ? "Save Changes" : "Create Category"}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Confirmation */}
      <ConfirmDialog
        isOpen={!!categoryToDelete}
        onClose={() => setCategoryToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message={`Are you sure you want to delete category "${categoryToDelete?.name}"?`}
        confirmText="Delete Category"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
}
