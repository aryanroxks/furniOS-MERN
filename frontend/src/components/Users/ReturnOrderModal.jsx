import { useState } from "react";
import api from "../../services/api";

export default function ReturnOrderModal({ order, onClose, onSuccess }) {
  const [items, setItems] = useState(
    order.products.map(p => ({
      productID: p.productID,
      name: p.name,
      maxQty: p.quantity,
      quantity: 0
    }))
  );

  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQtyChange = (productID, qty) => {
    setItems(prev =>
      prev.map(i =>
        i.productID === productID
          ? { ...i, quantity: Math.max(0, qty) }
          : i
      )
    );
  };

  const handleSubmit = async () => {
    const selectedItems = items
      .filter(i => i.quantity > 0)
      .map(i => ({
        productID: i.productID,
        quantity: i.quantity
      }));

    if (!selectedItems.length) {
      alert("Select at least one product");
      return;
    }

    if (!reason.trim()) {
      alert("Return reason is required");
      return;
    }

    try {
      setLoading(true);

      await api.post(`/orders/${order._id}/return`, {
        items: selectedItems,
        reason
      });

      alert("Return request submitted");
      onSuccess(); // 🔁 refresh order
      onClose();   // ❌ close modal
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create return");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg rounded-lg p-6 space-y-4">
        <h3 className="text-lg font-semibold">Return Items</h3>

        <div className="space-y-3 max-h-64 overflow-auto">
          {items.map(item => (
            <div
              key={item.productID}
              className="flex justify-between items-center border-b pb-2"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Max: {item.maxQty}
                </p>
              </div>

              <input
                type="number"
                min="0"
                max={item.maxQty}
                value={item.quantity}
                onChange={e =>
                  handleQtyChange(
                    item.productID,
                    Number(e.target.value)
                  )
                }
                className="w-20 border rounded px-2 py-1"
              />
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Reason for return
          </label>
          <textarea
            rows="3"
            value={reason}
            onChange={e => setReason(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded"
          >
            {loading ? "Submitting..." : "Submit Return"}
          </button>
        </div>
      </div>
    </div>
  );
}
