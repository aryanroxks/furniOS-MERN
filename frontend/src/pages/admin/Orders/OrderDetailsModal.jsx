import { useEffect, useState } from "react";
import api from "../../../services/api";
import AssignDeliveryModal from "./AssignDeliveryModal";

const STATUS_STYLES = {
  PLACED: "bg-blue-50 text-blue-700",
  CONFIRMED: "bg-indigo-50 text-indigo-700",
  SHIPPED: "bg-purple-50 text-purple-700",
  OUT_FOR_DELIVERY: "bg-amber-50 text-amber-700",
  DELIVERED: "bg-green-50 text-green-700",
  CANCELLED: "bg-red-50 text-red-700",
};

export default function OrderDetailsModal({ order, onClose, onUpdated }) {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusLoading, setStatusLoading] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  /* 🔹 Fetch full order details (IMPORTANT FIX) */
  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const res = await api.get(`/orders/${order._id}`);
        setOrderDetails(res.data.data);
      } catch (err) {
        console.error("Failed to fetch order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [order._id]);

  const updateStatus = async (newStatus) => {
    try {
      setStatusLoading(true);
      await api.patch(`/orders/${order._id}/status`, { newStatus });
      onUpdated();
      onClose();
    } finally {
      setStatusLoading(false);
    }
  };

  const markAsDelivered = async () => {
    try {
      setStatusLoading(true);
      await api.patch(`/orders/${order._id}/delivered`);
      onUpdated();
      onClose();
    } finally {
      setStatusLoading(false);
    }
  };

  const downloadInvoice = () => {
    const token = localStorage.getItem("accessToken");

    const invoiceUrl = `${import.meta.env.VITE_API_BASE_URL}/orders/${order._id}/invoice`;

    window.open(
      invoiceUrl,
      "_blank",
      `noopener,noreferrer`
    );
  };


  /* 🔹 Loading state */
  if (loading || !orderDetails) {
    return (
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg shadow">
          Loading order details…
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 overflow-y-auto">
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-5xl rounded-xl shadow-lg">

          {/* HEADER */}
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <div>
              <h2 className="text-xl font-semibold">
                Order #{orderDetails._id.slice(-6)}
              </h2>
              <p className="text-sm text-gray-500">
                Placed on {new Date(orderDetails.createdAt).toLocaleString()}
              </p>
            </div>

            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_STYLES[orderDetails.status]}`}
            >
              {orderDetails.status.replaceAll("_", " ")}
            </span>

            <button
              onClick={onClose}
              className="text-gray-500 hover:text-black"
            >
              ✕
            </button>
          </div>

          {/* CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">

            {/* PRODUCTS */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-lg">Products</h3>

              {orderDetails.products.map((item, i) => (
                <div
                  key={i}
                  className="flex gap-4 border rounded-lg p-4"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
                    {item.primaryImage ? (
                      <img
                        src={item.primaryImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">
                      Quantity: {item.quantity}
                    </p>
                  </div>

                  {/* Price */}
                  <div className="text-right font-semibold">
                    ₹{item.price}
                  </div>
                </div>
              ))}
            </div>

            {/* SUMMARY */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Order Summary</h3>

              <div className="border rounded-lg p-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>CGST</span>
                  <span>₹{orderDetails.CGST}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST</span>
                  <span>₹{orderDetails.SGST}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₹{orderDetails.shippingCharge}</span>
                </div>

                <div className="border-t pt-2 flex justify-between font-semibold text-base">
                  <span>Total</span>
                  <span>₹{orderDetails.total}</span>
                </div>
              </div>

              {/* DELIVERY INFO */}
              <div className="border rounded-lg p-4 text-sm space-y-1">
                <h4 className="font-medium mb-1">Delivery Address</h4>
                <p>{orderDetails.deliveryAddress1}</p>
                {orderDetails.deliveryAddress2 && (
                  <p>{orderDetails.deliveryAddress2}</p>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex flex-wrap justify-end gap-2 px-6 py-4 border-t bg-gray-50">

            <button
              onClick={downloadInvoice}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-100"
            >
              Download Invoice
            </button>

            {orderDetails.status === "PLACED" && (
              <button
                onClick={() => updateStatus("CONFIRMED")}
                className="px-4 py-2 bg-green-600 text-white rounded"
              >
                Confirm
              </button>
            )}

            {orderDetails.status === "CONFIRMED" && (
              <button
                onClick={() => updateStatus("SHIPPED")}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Ship
              </button>
            )}

            {["PLACED", "CONFIRMED"].includes(orderDetails.status) && (
              <button
                onClick={() => updateStatus("CANCELLED")}
                className="px-4 py-2 bg-red-600 text-white rounded"
              >
                Cancel
              </button>
            )}

            {["SHIPPED", "OUT_FOR_DELIVERY"].includes(orderDetails.status) && (
              <button
                onClick={() => setShowAssignModal(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                {orderDetails.deliveryPersonID
                  ? "Reassign Delivery"
                  : "Assign Delivery"}
              </button>
            )}

            {orderDetails.status === "OUT_FOR_DELIVERY" && (
              <button
                onClick={markAsDelivered}
                disabled={statusLoading}
                className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {statusLoading ? "Marking..." : "Mark as Delivered"}
              </button>
            )}


          </div>
        </div>
      </div>

      {/* ASSIGN DELIVERY MODAL */}
      {showAssignModal && (
        <AssignDeliveryModal
          order={orderDetails}
          onClose={() => setShowAssignModal(false)}
          onSuccess={() => {
            setShowAssignModal(false);
            onUpdated();
          }}
        />
      )}
    </div>
  );
}
