import { useEffect, useState } from "react";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";

export default function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate =useNavigate();



  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6">Loading orders...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">My Orders</h2>

      <div className="space-y-6">
        {orders.map(order => (
          <div
            key={order._id}
            className="bg-white border rounded-lg p-5"
          >
            {/* Order Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <p className="text-sm text-gray-500">Order ID</p>
                <p className="font-medium text-gray-800">
                  {order._id}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-600 font-medium">
                  {order.status}
                </p>
                <p className="text-sm text-gray-500">
                  Delivered on{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              {order.products.map(product => (
                <div
                  key={product.productID}
                  className="flex gap-4 border-t pt-4 first:border-t-0 first:pt-0"
                >
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-50 rounded flex items-center justify-center">
                    {product.primaryImage ? (
                      <img
                        src={product.primaryImage}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      {product.name}
                    </p>
                    <p className="text-gray-600 mt-1">
                      ₹{product.price}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Qty: {product.quantity}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Footer */}
            <div className="flex justify-between items-center mt-5 border-t pt-4">
              <p className="font-medium text-gray-800">
                Order Total: ₹{order.total}
              </p>

              <button
                onClick={() => navigate(`/profile/myorders/${order._id}`)}
                className="text-sm text-orange-600 hover:underline"
              >
                View order details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
