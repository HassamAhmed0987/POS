import React from "react";
import Modal from "./Modal";
import { AlertTriangle } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
  isLoading = false,
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div id="confirm-dialog-content" className="text-center py-2">
        <div
          id="confirm-dialog-icon-wrapper"
          className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            isDestructive
              ? "bg-red-500/10 text-red-500 border border-red-500/20"
              : "bg-orange-500/10 text-orange-500 border border-orange-500/20"
          }`}
        >
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 id="confirm-dialog-title" className="text-xl font-bold text-zinc-900 dark:text-zinc-100 font-heading mb-2">
          {title}
        </h3>
        <p id="confirm-dialog-message" className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 px-4">
          {message}
        </p>
        <div id="confirm-dialog-actions" className="flex items-center justify-center gap-3">
          <button
            id="confirm-dialog-cancel-btn"
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 font-medium text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          >
            {cancelText}
          </button>
          <button
            id="confirm-dialog-submit-btn"
            type="button"
            onClick={async () => {
              await onConfirm();
              onClose();
            }}
            disabled={isLoading}
            className={`px-5 py-2.5 rounded-xl font-medium text-sm text-white shadow-lg transition-colors flex items-center gap-2 ${
              isDestructive
                ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/20"
            }`}
          >
            {isLoading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
}
