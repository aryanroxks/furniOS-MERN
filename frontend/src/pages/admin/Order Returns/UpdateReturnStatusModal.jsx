import React from "react";

const STATUS_LABELS = {
  APPROVED: "Approve Return",
  REJECTED: "Reject Return",
  PICKED_UP: "Mark as Picked Up",
  RECEIVED: "Mark as Received",
  REFUNDED: "Mark as Refunded",
};

const STATUS_DESCRIPTIONS = {
  APPROVED: "This will approve the return request.",
  REJECTED: "This will reject/cancel the return request.",
  PICKED_UP: "Confirm that items have been picked up from customer.",
  RECEIVED: "Confirm that items are received at warehouse.",
  REFUNDED: "Confirm that refund has been completed.",
};

export default function UpdateReturnStatusModal({
  status,
  loading,
  onConfirm,
  onClose,
}) {
  if (!status) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg">

        {/* HEADER */}
        <div className="px-6 py-4 border-b">
          <h2 className="text-lg font-semibold">
            {STATUS_LABELS[status]}
          </h2>
        </div>

        {/* BODY */}
        <div className="px-6 py-4 space-y-3">
          <p className="text-gray-700">
            {STATUS_DESCRIPTIONS[status]}
          </p>

          <p className="text-sm text-gray-500">
            This action cannot be undone.
          </p>
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm border rounded"
          >
            Cancel
          </button>

          <button
            onClick={() => onConfirm(status)}
            disabled={loading}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? "Processing…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
