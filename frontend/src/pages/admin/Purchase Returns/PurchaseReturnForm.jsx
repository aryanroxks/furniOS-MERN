import { useEffect, useMemo, useState } from "react";
import api from "../../../services/api";

export default function PurchaseReturnForm({
  mode, // "create" | "edit"
  initialData,
  onSubmit,
  loading,
}) {
  const [purchases, setPurchases] = useState([]);
  const [purchaseID, setPurchaseID] = useState(initialData?.purchaseID || "");
  const [items, setItems] = useState(initialData?.items || []);
  const [reason, setReason] = useState(initialData?.reason || "");

  /* ---------------- Fetch RECEIVED purchases ---------------- */
  useEffect(() => {
    if (mode === "edit") return;

    api
      .get("/purchases", { params: { status: "RECEIVED" } })
      .then((res) => setPurchases(res.data.data || []))
      .catch(() => {});
  }, [mode]);

  /* ---------------- Load purchase items ---------------- */
  useEffect(() => {
    if (!purchaseID || mode === "edit") return;

    api.get(`/purchases/${purchaseID}`).then((res) => {
      const purchase = res.data.data;

      const mapped = purchase.items.map((i) => ({
        itemType: i.itemType,
        itemID: i.itemId,
        maxQty: i.quantity,
        quantity: 0,
        unitPrice: i.unitPrice,
        reason: "",
      }));

      setItems(mapped);
    });
  }, [purchaseID, mode]);

  /* ---------------- Calculations ---------------- */
  const returnAmount = useMemo(() => {
    return items.reduce(
      (sum, i) => sum + i.quantity * i.unitPrice,
      0
    );
  }, [items]);

  /* ---------------- Handlers ---------------- */
  const updateItem = (index, key, value) => {
    setItems((prev) =>
      prev.map((i, idx) =>
        idx === index ? { ...i, [key]: value } : i
      )
    );
  };

  const handleSubmit = () => {
    const payload = {
      purchaseID,
      items: items
        .filter((i) => i.quantity > 0)
        .map((i) => ({
          itemType: i.itemType,
          itemID: i.itemID,
          quantity: i.quantity,
          reason: i.reason,
        })),
      reason,
    };

    onSubmit(payload);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="space-y-6">
      {/* Purchase selector */}
      {mode === "create" && (
        <select
          className="border rounded-md px-3 py-2 w-full"
          value={purchaseID}
          onChange={(e) => setPurchaseID(e.target.value)}
        >
          <option value="">Select Purchase</option>
          {purchases.map((p) => (
            <option key={p._id} value={p._id}>
              {p.vendorId?.name} —{" "}
              {new Date(p.purchaseDate).toLocaleDateString()}
            </option>
          ))}
        </select>
      )}

      {/* Items */}
      {items.length > 0 && (
        <div className="bg-white border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">Item</th>
                <th className="px-4 py-3 text-left">Purchased</th>
                <th className="px-4 py-3 text-left">Return Qty</th>
                <th className="px-4 py-3 text-left">Unit Price</th>
                <th className="px-4 py-3 text-left">Line Total</th>
                <th className="px-4 py-3 text-left">Reason</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {items.map((i, idx) => (
                <tr key={idx}>
                  <td className="px-4 py-3">{i.itemType}</td>
                  <td className="px-4 py-3">{i.maxQty}</td>
                  <td className="px-4 py-3">
                    <input
                      type="number"
                      min={0}
                      max={i.maxQty}
                      value={i.quantity}
                      onChange={(e) =>
                        updateItem(
                          idx,
                          "quantity",
                          Math.min(i.maxQty, Number(e.target.value))
                        )
                      }
                      className="border rounded-md px-2 py-1 w-24"
                    />
                  </td>
                  <td className="px-4 py-3">₹{i.unitPrice}</td>
                  <td className="px-4 py-3 font-medium">
                    ₹{i.quantity * i.unitPrice}
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={i.reason}
                      onChange={(e) =>
                        updateItem(idx, "reason", e.target.value)
                      }
                      className="border rounded-md px-2 py-1 w-full"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Overall reason */}
      <textarea
        placeholder="Overall return reason (optional)"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        className="border rounded-md px-3 py-2 w-full"
      />

      {/* Summary */}
      <div className="flex justify-between items-center">
        <p className="text-lg font-semibold">
          Return Amount: ₹{returnAmount}
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 text-white px-5 py-2 rounded-md disabled:opacity-50"
        >
          {mode === "create" ? "Create Return" : "Update Return"}
        </button>
      </div>
    </div>
  );
}
