export default function CompleteConfirmModal({
  title = "Complete Action?",
  message,
  loading = false,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900">
          {title}
        </h2>

        {/* Message */}
        <p className="mt-2 text-sm text-gray-600">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md border text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-md bg-green-600 text-white text-sm hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Yes, Complete"}
          </button>
        </div>
      </div>
    </div>
  );
}
