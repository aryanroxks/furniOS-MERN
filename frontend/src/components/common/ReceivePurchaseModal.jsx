export default function ReceivePurchaseModal({
  loading,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-2 text-green-700">
          Receive Purchase
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Receiving this purchase will update product and raw material stock.
          This action <b>cannot be undone</b>.
        </p>

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
            className="rounded-md bg-green-600 px-4 py-2 text-sm text-white hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Receiving..." : "Receive"}
          </button>
        </div>
      </div>
    </div>
  );
}
