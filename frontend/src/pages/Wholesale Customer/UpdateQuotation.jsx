import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../services/api";

const UpdateQuotation = () => {
  const { quotationID } = useParams();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [userNote, setUserNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ================= FETCH EXISTING QUOTATION ================= */
  const fetchQuotation = async () => {
    try {
      setLoading(true);
      const res = await api.get(
        `/wholesale/quotations/${quotationID}`
      );

      const q = res.data.data;

      if (q.status !== "REQUESTED") {
        alert("This quotation can no longer be edited");
        navigate("/profile/quotations");
        return;
      }

      const preparedItems = q.items.map((item) => ({
        productID: item.productID,
        name: item.product.name,
        image: item.product.primaryImage?.url,
        quantity: item.quantity,
        requestedPrice: item.requestedPrice,
      }));

      setItems(preparedItems);
      setUserNote(q.userNote || "");
    } catch (err) {
      console.error("Failed to fetch quotation", err);
      navigate("/profile/quotations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotation();
  }, [quotationID]);

  /* ================= UPDATE HANDLER ================= */
  const updateItem = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const totalQuantity = items.reduce(
    (sum, i) => sum + Number(i.quantity || 0),
    0
  );

  const totalAmount = items.reduce(
    (sum, i) =>
      sum + Number(i.quantity || 0) * Number(i.requestedPrice || 0),
    0
  );

  /* ================= SUBMIT UPDATE ================= */
  const submitUpdate = async () => {
    for (const item of items) {
      if (item.quantity < 50) {
        alert("Minimum 50 quantity required per product");
        return;
      }
      if (!item.requestedPrice || item.requestedPrice <= 0) {
        alert("Please enter requested price for all products");
        return;
      }
    }

    try {
      setSaving(true);

      const payload = {
        userNote,
        products: items.map((item) => ({
          productID: item.productID,
          quantity: Number(item.quantity),
          requestedPrice: Number(item.requestedPrice),
        })),
      };

      await api.put(
        `/wholesale/quotations/${quotationID}/modify`,
        payload
      );

      navigate(`/profile/quotations/${quotationID}`);
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update quotation");
    } finally {
      setSaving(false);
    }
  };

  /* ================= UI STATES ================= */
  if (loading) {
    return <p className="p-6">Loading quotation...</p>;
  }

  /* ================= RENDER ================= */
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">
        Update Wholesale Quotation
      </h1>

      {/* PRODUCTS TABLE */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Product</th>
              <th className="p-3 text-center">Quantity</th>
              <th className="p-3 text-center">
                Requested Price (₹)
              </th>
              <th className="p-3 text-right">Subtotal</th>
            </tr>
          </thead>

          <tbody>
            {items.map((item, index) => (
              <tr key={item.productID} className="border-t">
                <td className="p-3 flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <span className="font-medium">
                    {item.name}
                  </span>
                </td>

                <td className="p-3 text-center">
                  <input
                    type="number"
                    min={50}
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        e.target.value
                      )
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
                      updateItem(
                        index,
                        "requestedPrice",
                        e.target.value
                      )
                    }
                    className="w-28 border rounded px-2 py-1 text-center"
                  />
                </td>

                <td className="p-3 text-right font-medium">
                  ₹
                  {Number(item.quantity || 0) *
                    Number(item.requestedPrice || 0)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* NOTE + SUMMARY */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-1">
            Note for Admin
          </label>
          <textarea
            value={userNote}
            onChange={(e) => setUserNote(e.target.value)}
            className="w-full border rounded p-3 min-h-[100px]"
          />
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <div className="flex justify-between">
            <span>Total Quantity</span>
            <span className="font-medium">
              {totalQuantity}
            </span>
          </div>

          <div className="flex justify-between text-lg font-semibold">
            <span>Total Requested Amount</span>
            <span>₹{totalAmount}</span>
          </div>

          <button
            onClick={submitUpdate}
            disabled={saving}
            className="w-full mt-4 bg-blue-600 text-white py-3 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Updating..." : "Update Quotation"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateQuotation;
