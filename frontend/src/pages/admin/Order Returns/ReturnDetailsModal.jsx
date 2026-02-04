import { useEffect, useState } from "react";
import api from "../../../services/api";

/* ======================
   CONSTANTS
====================== */
const STATUS_STYLES = {
  REQUESTED: "bg-blue-50 text-blue-700",
  APPROVED: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
  PICKED_UP: "bg-purple-50 text-purple-700",
  RECEIVED: "bg-amber-50 text-amber-700",
  REFUNDED: "bg-emerald-50 text-emerald-700",
};

const NEXT_ACTIONS = {
  REQUESTED: ["APPROVED", "REJECTED"],
  APPROVED: ["PICKED_UP"],
  PICKED_UP: ["RECEIVED"],
  RECEIVED: ["REFUNDED"],
};

const TERMINAL_STATUSES = ["REJECTED", "REFUNDED"];

export default function ReturnDetailsModal({
  returnId,
  onClose,
  onUpdated,
}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  /* ======================
     FETCH DETAILS
  ====================== */
  const fetchDetails = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/orders/admin/returns/${returnId}/details`
      );
      setData(res.data.data);
    } catch (err) {
      alert("Failed to load return details");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (returnId) fetchDetails();
  }, [returnId]);

  /* ======================
     UPDATE STATUS
  ====================== */
  const updateStatus = async (status) => {
    try {
      setActionLoading(true);
      await api.patch(
        `/orders/admin/returns/${returnId}/status`,
        { status }
      );
      await fetchDetails();
      onUpdated?.();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (!returnId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-lg overflow-hidden">

        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-4 border-b">
          <div>
            <h2 className="text-xl font-semibold">
              Return #{data?.return?.id?.slice(-6)}
            </h2>
            {data && (
              <p className="text-sm text-gray-500">
                Order #{data.order.id.slice(-6)} · Requested on{" "}
                {new Date(data.return.requestedAt).toLocaleDateString()}
              </p>
            )}
          </div>

          {data && (
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                STATUS_STYLES[data.return.status]
              }`}
            >
              {data.return.status.replaceAll("_", " ")}
            </span>
          )}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {loading ? (
            <p className="text-gray-500">Loading return details…</p>
          ) : (
            <>
              {/* CUSTOMER + ORDER */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Customer</h3>
                  <p>{data.user.name}</p>
                  <p className="text-sm text-gray-500">
                    {data.user.email}
                  </p>
                </div>

                <div className="border rounded-lg p-4">
                  <h3 className="font-medium mb-1">Order Info</h3>
                  <p className="text-sm text-gray-500">Delivered At</p>
                  <p>
                    {data.order.deliveredAt
                      ? new Date(
                          data.order.deliveredAt
                        ).toLocaleString()
                      : "—"}
                  </p>
                </div>
              </div>

              {/* ITEMS */}
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Returned Items
                </h3>

                <div className="border rounded-lg divide-y">
                  {data.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 p-4"
                    >
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-14 h-14 rounded object-cover"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Quantity: {item.quantity}
                        </p>
                      </div>

                      <div className="text-right text-sm">
                        <p>₹{item.unitPrice}</p>
                        <p className="font-semibold">
                          ₹{item.total}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* REFUND */}
              <div className="border rounded-lg p-4 max-w-md space-y-2">
                <div className="flex justify-between">
                  <span>Refund Amount</span>
                  <span className="font-semibold">
                    ₹{data.return.refundAmount}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Refund Mode</span>
                  <span className="font-medium">
                    {data.return.refundMode || "ORIGINAL"}
                  </span>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Reason</p>
                  <p>{data.return.reason}</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center px-6 py-4 border-t bg-gray-50">
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Close
          </button>

          {!loading &&
            data &&
            NEXT_ACTIONS[data.return.status] &&
            !TERMINAL_STATUSES.includes(
              data.return.status
            ) && (
              <div className="flex gap-2">
                {NEXT_ACTIONS[data.return.status].map(
                  (status) => (
                    <button
                      key={status}
                      disabled={actionLoading}
                      onClick={() => updateStatus(status)}
                      className="px-4 py-2 bg-blue-600 text-white rounded text-sm disabled:opacity-50"
                    >
                      {actionLoading
                        ? "Processing…"
                        : status.replaceAll("_", " ")}
                    </button>
                  )
                )}
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
