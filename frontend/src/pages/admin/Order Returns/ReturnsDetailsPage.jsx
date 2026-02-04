import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../services/api";
import UpdateReturnStatusModal from "./UpdateReturnStatusModal";

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

export default function ReturnDetailsPage() {
  const { returnId } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [pendingStatus, setPendingStatus] = useState(null);

  /* ======================
     FETCH DETAILS
  ====================== */
  const fetchDetails = async () => {
    try {
      const res = await api.get(
        `/orders/admin/returns/${returnId}/details`
      );
      setData(res.data.data);
    } catch {
      navigate("/dashboard/returns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [returnId]);

  /* ======================
     CONFIRM STATUS UPDATE
  ====================== */
  const confirmStatusUpdate = async (status) => {
    try {
      setActionLoading(true);
      await api.patch(
        `/orders/admin/returns/${returnId}/status`,
        { status }
      );
      setPendingStatus(null);
      await fetchDetails();
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="p-6">Loading…</div>;
  if (!data) return null;

  const { return: ret, order, user, items } = data;

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">
            Return #{ret.id.slice(-6)}
          </h1>
          <p className="text-sm text-gray-500">
            Order #{order.id.slice(-6)}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[ret.status]
            }`}
        >
          {ret.status.replaceAll("_", " ")}
        </span>
      </div>

      {/* CUSTOMER & ORDER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Customer</h3>
          <p>{user.name}</p>
          <p className="text-sm text-gray-500">{user.email}</p>
        </div>

        <div className="border rounded-lg p-4">
          <h3 className="font-medium">Delivered At</h3>
          <p>
            {order.deliveredAt
              ? new Date(order.deliveredAt).toLocaleString()
              : "—"}
          </p>
        </div>
      </div>

      {/* RETURN REASON */}
      <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-lg">
        <p className="text-xs uppercase tracking-wide text-blue-700 font-semibold mb-1">
          Return Reason (Customer)
        </p>

        <p className="text-gray-800 leading-relaxed">
          {ret.reason}
        </p>

        <p className="text-xs text-gray-500 mt-1">
          Submitted on {new Date(ret.requestedAt).toLocaleDateString()}
        </p>
      </div>


      {/* ITEMS */}
      <div>
        <h2 className="text-lg font-semibold mb-2">
          Returned Items
        </h2>

        <div className="border rounded-lg divide-y">
          {items.map((item, idx) => (
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
                  Qty: {item.quantity}
                </p>
              </div>
              <div className="text-right">
                <p>₹{item.unitPrice}</p>
                <p className="font-semibold">₹{item.total}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      {!TERMINAL_STATUSES.includes(ret.status) &&
        NEXT_ACTIONS[ret.status] && (
          <div className="flex gap-2">
            {NEXT_ACTIONS[ret.status].map((status) => (
              <button
                key={status}
                onClick={() => setPendingStatus(status)}
                className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
              >
                {status.replaceAll("_", " ")}
              </button>
            ))}
          </div>
        )}

      {/* BACK */}
      <button
        onClick={() => navigate("/dashboard/returns")}
        className="text-sm text-blue-600 hover:underline"
      >
        ← Back to returns
      </button>

      {/* STATUS MODAL */}
      {pendingStatus && (
        <UpdateReturnStatusModal
          status={pendingStatus}
          loading={actionLoading}
          onConfirm={confirmStatusUpdate}
          onClose={() => setPendingStatus(null)}
        />
      )}
    </div>
  );
}
