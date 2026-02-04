export default function ActionConfirmModal({
  open,
  title,
  description,
  confirmText = "Confirm",
  confirmColor = "bg-indigo-600 hover:bg-indigo-700",
  loading,
  onConfirm,
  onCancel,
  children,           // ✅ OPTIONAL, new
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-2">
          {title}
        </h2>

        {/* Existing description stays exactly same */}
        {description && (
          <p className="text-sm text-gray-600 mb-4">
            {description}
          </p>
        )}

        {/* ✅ NEW: only renders if passed */}
        {children && (
          <div className="mb-6">
            {children}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className={`rounded-md px-4 py-2 text-sm text-white ${confirmColor} disabled:opacity-50`}
          >
            {loading ? "Processing..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
