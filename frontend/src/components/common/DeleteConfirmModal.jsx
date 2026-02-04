export default function DeleteConfirmModal({
  title = "Delete?",
  message = "This action cannot be undone.",
  onConfirm,
  onCancel,
  loading = false
}) {
  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl space-y-4 w-full max-w-sm">
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{message}</p>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg border"
            disabled={loading}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
