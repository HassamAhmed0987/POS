import React from "react";
import { Plus, ShoppingBag, CheckCircle, XCircle } from "lucide-react";

export default function ProductCard({
  product,
  categoryName,
  onAddToCart,
  onEdit,
  onToggleStatus,
  mode = "pos", // 'pos' or 'catalog'
}) {
  const isAvailable = product.isAvailable && (product.stock > 0 || product.stock === undefined);

  if (mode === "pos") {
    return (
      <div
        id={`pos-product-${product.id}`}
        onClick={() => isAvailable && onAddToCart && onAddToCart(product)}
        className={`group relative flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer select-none overflow-hidden ${
          isAvailable
            ? "bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 hover:border-orange-500 dark:hover:border-orange-500 hover:shadow-lg hover:shadow-orange-500/5 active:scale-[0.98]"
            : "bg-zinc-100 dark:bg-zinc-900/40 border-zinc-200 dark:border-zinc-800/60 opacity-60 cursor-not-allowed"
        }`}
      >
        <div>
          {/* Image Container */}
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
            <img
              src={product.image}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";
              }}
            />
            {categoryName && (
              <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-xs text-orange-400">
                {categoryName}
              </span>
            )}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center">
                <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-xs font-bold uppercase tracking-wider">
                  Out of Stock
                </span>
              </div>
            )}
          </div>

          <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1 group-hover:text-orange-500 transition-colors">
            {product.name}
          </h4>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 block">Price</span>
            <span className="text-base font-extrabold text-orange-500 font-heading">
              Rs. {Number(product.price).toLocaleString()}
            </span>
          </div>

          <button
            type="button"
            disabled={!isAvailable}
            className={`w-8 h-8 rounded-xl flex items-center justify-center transition-transform duration-150 ${
              isAvailable
                ? "bg-orange-500 text-white shadow-xs group-hover:scale-110"
                : "bg-zinc-300 dark:bg-zinc-800 text-zinc-500"
            }`}
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Catalog Mode
  return (
    <div
      id={`catalog-product-${product.id}`}
      className="flex flex-col justify-between p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-xs hover:shadow-md transition-all duration-200"
    >
      <div>
        <div className="relative aspect-16/10 w-full rounded-xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 mb-3">
          <img
            src={product.image}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => {
              e.target.src = "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80";
            }}
          />
          <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/70 backdrop-blur-xs px-2 py-1 rounded-lg">
            {product.isAvailable ? (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                <CheckCircle className="w-3.5 h-3.5" /> Available
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-red-400">
                <XCircle className="w-3.5 h-3.5" /> Unavailable
              </span>
            )}
          </div>
          {categoryName && (
            <span className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-500 text-white shadow-sm">
              {categoryName}
            </span>
          )}
        </div>

        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 font-heading">
              {product.name}
            </h3>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">ID: {product.id}</p>
          </div>
          <span className="text-lg font-black text-orange-500 font-heading">
            Rs. {Number(product.price).toLocaleString()}
          </span>
        </div>

        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2 leading-relaxed">
          {product.description}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs text-zinc-500 dark:text-zinc-400">
          <div>
            Stock: <span className="font-bold text-zinc-800 dark:text-zinc-200">{product.stock ?? 0}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onToggleStatus && onToggleStatus(product)}
          className={`text-xs px-3 py-1.5 rounded-xl font-semibold border transition-colors ${
            product.isAvailable
              ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10"
              : "border-zinc-500/30 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-500/10"
          }`}
        >
          {product.isAvailable ? "Set Inactive" : "Set Active"}
        </button>

        <button
          type="button"
          onClick={() => onEdit && onEdit(product)}
          className="text-xs px-3.5 py-1.5 rounded-xl font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-orange-500 hover:text-white transition-colors"
        >
          Edit Product
        </button>
      </div>
    </div>
  );
}
