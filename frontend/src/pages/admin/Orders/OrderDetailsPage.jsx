import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../../services/api";

import OrderDetailsModal from "./OrderDetailsModal";

export default function OrderDetailsPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${orderId}`);
      setOrder(res.data.data);
    } catch (err) {
      navigate("/admin/orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!order) return null;

  return (
    <OrderDetailsModal
      order={order}
      onClose={() => navigate("/admin/orders")}
      onUpdated={fetchOrder}
    />
  );
}
