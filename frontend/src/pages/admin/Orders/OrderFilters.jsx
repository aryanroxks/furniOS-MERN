export default function OrderFilters({ filters, setFilters }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-wrap gap-4">
      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.status}
        onChange={(e) =>
          setFilters((prev) => ({ ...prev, status: e.target.value }))
        }
      >
        <option value="">All Status</option>
        <option value="PLACED">Placed</option>
        <option value="CONFIRMED">Confirmed</option>
        <option value="SHIPPED">Shipped</option>
        <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
        <option value="DELIVERED">Delivered</option>
        <option value="CANCELLED">Cancelled</option>
      </select>

      <select
        className="border rounded px-3 py-2 text-sm"
        value={filters.deliveryAssigned}
        onChange={(e) =>
          setFilters((prev) => ({
            ...prev,
            deliveryAssigned: e.target.value,
          }))
        }
      >
        <option value="">Delivery (All)</option>
        <option value="true">Assigned</option>
        <option value="false">Not Assigned</option>
      </select>
    </div>
  );
}
