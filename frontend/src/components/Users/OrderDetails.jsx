import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../services/api";
import ReturnOrderModal from "./ReturnOrderModal.jsx";

export default function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [returnInfo, setReturnInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  /* ---------------- FETCH ORDER ---------------- */

  const fetchOrder = async () => {
    const res = await api.get(`/orders/${orderId}`);
    setOrder(res.data.data);
  };

  /* ---------------- FETCH RETURN STATUS ONLY ---------------- */

  const fetchReturn = async () => {
    try {
      const res = await api.get("/orders/returns/my");

      const found = res.data.data.find(r =>
        typeof r.orderID === "string"
          ? r.orderID === orderId
          : r.orderID?._id === orderId
      );

      setReturnInfo(found || null);
    } catch {
      setReturnInfo(null);
    }
  };

  /* ---------------- LOAD PAGE ---------------- */

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        await fetchOrder();
        await fetchReturn();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load order");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [orderId]);

  /* ---------------- CANCEL ORDER ---------------- */

  const handleCancelOrder = async () => {
    const confirmed = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmed) return;

    try {
      setCancelLoading(true);
      const res = await api.patch(`/orders/${order._id}/cancel`);

      setOrder(prev => ({
        ...prev,
        status: res.data.data.status
      }));
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };
  
  const handleCancelReturn = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this return request?"
    );
    if (!confirmed) return;

    try {
      await api.patch(`/orders/returns/${returnInfo._id}/cancel`);

      // Refresh return info
      fetchReturn();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel return");
    }
  };


  /* ---------------- STATES ---------------- */

  if (loading) return <div className="p-6">Loading order...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!order) return null;

  const productsSubtotal = order.products.reduce(
    (sum, p) => sum + p.price * p.quantity,
    0
  );

  const canCancelOrder = ![
    "SHIPPED",
    "OUT_FOR_DELIVERY",
    "DELIVERED",
    "CANCELLED"
  ].includes(order.status);

  const canReturnOrder =
    order.status === "DELIVERED" && !returnInfo;

  /* ---------------- JSX ---------------- */

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-semibold">Order Details</h2>
          <p className="text-sm text-gray-500">Order ID: {order._id}</p>
          <p className="text-sm text-gray-500">
            Ordered on {new Date(order.createdAt).toLocaleString()}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm">
          {order.status}
        </span>
      </div>

      {/* PRODUCTS */}
      <div className="bg-white border rounded-lg p-5">
        <h3 className="font-semibold mb-4">Items</h3>

        {order.products.map(item => (
          <div key={item.productID} className="flex gap-4 border-t pt-4">
            <div className="w-24 h-24 bg-gray-50 rounded">
              <img
                src={item.primaryImage}
                alt={item.name}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p>₹{item.price}</p>
              <p className="text-sm text-gray-500">
                Qty: {item.quantity}
              </p>
            </div>

            <div className="font-medium">
              ₹{item.price * item.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border rounded-lg p-5">
          <h3 className="font-semibold mb-3">Delivery Address</h3>
          <p>{order.deliveryAddress1}</p>
          <p>{order.deliveryAddress2}</p>
        </div>

        <div className="bg-white border rounded-lg p-5 space-y-2">
          <h3 className="font-semibold mb-3">Order Summary</h3>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₹{productsSubtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>CGST</span>
            <span>₹{order.CGST}</span>
          </div>
          <div className="flex justify-between">
            <span>SGST</span>
            <span>₹{order.SGST}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>₹{order.shippingCharge}</span>
          </div>
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>₹{order.total}</span>
          </div>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 items-center">
        {canCancelOrder && (
          <button
            onClick={handleCancelOrder}
            disabled={cancelLoading}
            className="px-4 py-2 border border-red-500 text-red-600 rounded"
          >
            Cancel Order
          </button>
        )}

        {canReturnOrder && (
          <button
            onClick={() => setShowReturnModal(true)}
            className="px-4 py-2 border border-orange-500 text-orange-600 rounded"
          >
            Return Items
          </button>
        )}

        {returnInfo && (
          <div className="flex items-center gap-3">
            <span className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded">
              Return Status: {returnInfo.status}
            </span>

            {returnInfo.status === "REQUESTED" && (
              <button
                onClick={handleCancelReturn}
                className="px-4 py-2 border border-red-500 text-red-600 rounded"
              >
                Cancel Return
              </button>
            )}
          </div>
        )}

      </div>

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-600 hover:underline"
      >
        ← Back to orders
      </button>

      {/* RETURN MODAL */}
      {showReturnModal && (
        <ReturnOrderModal
          order={order}
          onClose={() => setShowReturnModal(false)}
          onSuccess={() => {
            fetchReturn(); // refresh return status only
          }}
        />
      )}
    </div>
  );
}
