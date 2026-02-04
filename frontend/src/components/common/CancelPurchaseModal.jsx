export default function CancelPurchaseModal({
  loading,
  onConfirm,
  onCancel,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-lg">
        <h2 className="text-lg font-semibold mb-2 text-red-700">
          Cancel Purchase
        </h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to cancel this purchase?
          <br />
          <span className="font-medium text-red-600">
            Cancelled purchases cannot be received later.
          </span>
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-md border px-4 py-2 text-sm"
          >
            Back
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-md bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Cancelling..." : "Cancel Purchase"}
          </button>
        </div>
      </div>
    </div>
  );
}
