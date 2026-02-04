import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api.js";

const QuotationCreate = () => {
  const [cartItems, setCartItems] = useState([]);
  const [userNote, setUserNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  /* ================= FETCH CART ================= */
  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await api.get("/carts");
      const products = res.data.data?.products || [];

      // Attach requestedPrice field for UI
      const prepared = products.map((p) => ({
        productID: p._id,
        name: p.name,
        image: p.image,
        quantity: p.quantity,
        requestedPrice: "",
      }));

      setCartItems(prepared);
    } catch (err) {
      console.error("Failed to fetch cart", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  /* ================= HANDLERS ================= */
  const updateItem = (index, field, value) => {
    const updated = [...cartItems];
    updated[index][field] = value;
    setCartItems(updated);
  };

  const totalQuantity = cartItems.reduce(
    (sum, item) => sum + Number(item.quantity || 0),
    0
  );

  const totalAmount = cartItems.reduce(
    (sum, item) =>
      sum + Number(item.quantity || 0) * Number(item.requestedPrice || 0),
    0
  );

  /* ================= SUBMIT ================= */
  const submitQuotation = async () => {
    // Frontend validation
    for (const item of cartItems) {
      if (!item.requestedPrice || item.requestedPrice <= 0) {
        alert("Please enter requested price for all products");
        return;
      }
    }

    try {
      setSubmitting(true);

      const payload = {
        userNote,
        products: cartItems.map((item) => ({
          productID: item.productID,
          quantity: Number(item.quantity),
          requestedPrice: Number(item.requestedPrice),
        })),
      };

      const res = await api.post("/wholesale/quotations", payload);

      // Optional: clear cart (depends on your backend)
      // await api.delete("/carts/clear");
      console.error(res.data.data.message)

      navigate("/profile/quotations");
    } catch (err) {
      console.error("Quotation submission failed", err);
      setError(err?.response?.data?.message || err?.message || "Failed to submit quotation");
    } finally {
      setSubmitting(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="p-6">Loading quotation...</p>;
  }

  if (!cartItems.length) {
    return <p className="p-6">Cart is empty.</p>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">
        Create Wholesale Quotation
      </h1>

      {/* TABLE */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-center">Requested Price (₹)</th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, index) => (
              <tr key={item.productID} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <span className="font-medium">{item.name}</span>
                </td>

                <td className="p-3 text-center">
                  <input
                    type="number"
                    min={50}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", e.target.value)
                    }
                    className="w-20 border rounded px-2 py-1 text-center"
                  />
                </td>

                <td className="p-3 text-center">
                  <input
                    type="number"
                    min={1}
                    value={item.requestedPrice}
                    onChange={(e) =>
                      updateItem(index, "requestedPrice", e.target.value)
                    }
                    className="w-28 border rounded px-2 py-1 text-center"
                    placeholder="₹"
                  />
                </td>

                <td className="p-3 text-right font-medium">
                  ₹{Number(item.quantity || 0) *
                    Number(item.requestedPrice || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700">
          {error}
        </div>
      )}
      {/* SUMMARY */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Note for Admin (optional)
          </label>
          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="w-full border rounded p-3 min-h-[100px]"
            placeholder="Any special pricing, delivery, or quantity notes..."
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span>Total Quantity</span>
            <span className="font-medium">{totalQuantity}</span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Requested Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={submitQuotation}
            disabled={submitting}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {submitting ? "Submitting..." : "Submit Quotation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuotationCreate;
