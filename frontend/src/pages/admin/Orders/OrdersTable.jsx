import { Eye } from "lucide-react";

const STATUS_STYLES = {
  PLACED: "bg-blue-50 text-blue-700 ring-blue-600/20",
  CONFIRMED: "bg-indigo-50 text-indigo-700 ring-indigo-600/20",
  SHIPPED: "bg-purple-50 text-purple-700 ring-purple-600/20",
  OUT_FOR_DELIVERY: "bg-amber-50 text-amber-700 ring-amber-600/20",
  DELIVERED: "bg-green-50 text-green-700 ring-green-600/20",
  CANCELLED: "bg-red-50 text-red-700 ring-red-600/20",
};

export default function OrdersTable({ orders, loading, onView }) {
  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm">
        Loading orders…
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="px-6 py-4 text-left">Order</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Total</th>
            <th className="px-6 py-4">Delivery</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {orders.map((order) => (
            <tr
              key={order._id}
              className="hover:bg-gray-50 transition"
            >
              {/* Order */}
              <td className="px-6 py-4">
                <p className="font-medium text-gray-900">
                  #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </td>

              {/* Customer */}
              <td className="px-6 py-4 text-gray-700">
                {order.userID?.fullname || "Customer"}
              </td>

              {/* Total */}
              <td className="px-6 py-4 font-semibold">
                ₹{order.total.toLocaleString()}
              </td>

              {/* Delivery */}
              <td className="px-6 py-4">
                {order.deliveryPersonID ? (
                  <span className="text-green-600 font-medium">
                    Assigned
                  </span>
                ) : (
                  <span className="text-gray-400">N/A</span>
                )}
              </td>

              {/* Status */}
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ring-1 ${STATUS_STYLES[order.status]}`}
                >
                  {order.status.replaceAll("_", " ")}
                </span>
              </td>

              {/* Action */}
              <td className="px-6 py-4 text-right">
                <button
                  onClick={() => onView(order)}
                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800"
                >
                  <Eye size={16} />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {orders.length === 0 && (
        <div className="p-6 text-center text-gray-500">
          No orders found
        </div>
      )}
    </div>
  );
}
