import { useEffect, useState } from "react";
import api from "../../../services/api.js";
import OrdersTable from "./OrdersTable.jsx";
import OrderFilters from "./OrderFilters.jsx";
import Pagination from "./Pagination.jsx";
import OrderDetailsModal from "./OrderDetailsModal.jsx";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState({
    status: "",
    deliveryAssigned: "",
  });

  const [selectedOrder, setSelectedOrder] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    const { data } = await api.get("/orders", {
      params: {
        ...filters,
        page,
        limit,
      },
    });

    setOrders(data.data.orders);
    setTotal(data.data.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, [page, filters]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Orders Management
        </h1>
      </div>

      {/* Filters */}
      <OrderFilters filters={filters} setFilters={setFilters} />

      {/* Orders Table */}
      <OrdersTable
        orders={orders}
        loading={loading}
        onView={(order) => setSelectedOrder(order)}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        total={total}
        limit={limit}
        onPageChange={setPage}
      />

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={fetchOrders}
        />
      )}
    </div>
  );
}
