import { useEffect, useState } from "react";
import api from "../../../services/api.js";
import { Plus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function PurchaseForm({ mode = "create", purchaseId }) {
  const navigate = useNavigate();

  // ===== Master data =====
  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  // ===== Purchase state =====
  const [vendorId, setVendorId] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [status, setStatus] = useState("PENDING");

  const [items, setItems] = useState([
    { itemType: "", itemId: "", quantity: 1, unitPrice: 0 }
  ]);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // ===== Fetch master data =====
  useEffect(() => {
    api.get("/vendors").then(res => setVendors(res.data.data || []));
    api.get("/products").then(res => setProducts(res.data.data || []));
    api.get("/raw-materials").then(res => setRawMaterials(res.data.data || []));
  }, []);

  // ===== Fetch purchase (EDIT MODE) =====
  useEffect(() => {
    if (mode === "edit" && purchaseId) {
      setPageLoading(true);
      api.get(`/purchases/${purchaseId}`)
        .then(res => {
          const p = res.data.data;
          setVendorId(p.vendorId?._id);
          setPurchaseDate(p.purchaseDate.slice(0, 10));
          setStatus(p.status);
          setItems(
            p.items.map(i => ({
              itemType: i.itemType,
              itemId: i.itemId,
              quantity: i.quantity,
              unitPrice: i.unitPrice
            }))
          );
        })
        .finally(() => setPageLoading(false));
    }
  }, [mode, purchaseId]);

  // ===== Calculations =====
  const lineTotal = (i) => i.quantity * i.unitPrice;

  const totalAmount = items.reduce(
    (sum, i) => sum + lineTotal(i),
    0
  );

  // ===== Item handlers =====
  const updateItem = (index, key, value) => {
    const copy = [...items];
    copy[index][key] = value;

    // reset itemId when type changes
    if (key === "itemType") copy[index].itemId = "";

    setItems(copy);
  };

  const addItem = () =>
    setItems([...items, { itemType: "", itemId: "", quantity: 1, unitPrice: 0 }]);

  const removeItem = (index) =>
    setItems(items.filter((_, i) => i !== index));

  // ===== Submit =====
  const handleSubmit = async () => {
    if (!vendorId) return alert("Vendor is required");
    if (items.length === 0) return alert("Add at least one item");

    for (const i of items) {
      if (!i.itemType || !i.itemId || i.quantity <= 0 || i.unitPrice < 0) {
        return alert("Invalid item data");
      }
    }

    try {
      setLoading(true);

      const payload = {
        vendorId,
        purchaseDate: purchaseDate || undefined,
        items
      };

      if (mode === "create") {
        await api.post("/purchases", payload);
      } else {
        await api.patch(`/purchases/${purchaseId}`, payload);
      }

      navigate("/dashboard/purchases");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save purchase");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">

      <h1 className="text-2xl font-semibold">
        {mode === "create" ? "Create Purchase" : "Edit Purchase"}
      </h1>

      {/* ===== Meta ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 rounded-lg border">
        <select
          disabled={mode === "edit" && status !== "PENDING"}
          className="border rounded-md px-3 py-2"
          value={vendorId}
          onChange={(e) => setVendorId(e.target.value)}
        >
          <option value="">Select Vendor</option>
          {vendors.map(v => (
            <option key={v._id} value={v._id}>{v.name}</option>
          ))}
        </select>

        <input
          type="date"
          className="border rounded-md px-3 py-2"
          value={purchaseDate}
          onChange={(e) => setPurchaseDate(e.target.value)}
        />

        <input
          readOnly
          className="border rounded-md px-3 py-2 bg-gray-100"
          value={status}
        />
      </div>

      {/* ===== Items ===== */}
      <div className="bg-white border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2">Type</th>
              <th className="px-3 py-2">Item</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Unit Price</th>
              <th className="px-3 py-2">Line Total</th>
              <th />
            </tr>
          </thead>

          <tbody>
            {items.map((i, idx) => (
              <tr key={idx} className="border-t">
                <td className="px-3 py-2">
                  <select
                    disabled={mode === "edit" && status !== "PENDING"}
                    value={i.itemType}
                    onChange={(e) =>
                      updateItem(idx, "itemType", e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select</option>
                    <option value="PRODUCT">Product</option>
                    <option value="RAWMATERIAL">Raw Material</option>
                  </select>
                </td>

                <td className="px-3 py-2">
                  <select
                    disabled={!i.itemType}
                    value={i.itemId}
                    onChange={(e) =>
                      updateItem(idx, "itemId", e.target.value)
                    }
                    className="border rounded px-2 py-1"
                  >
                    <option value="">Select item</option>

                    {i.itemType === "PRODUCT" &&
                      products.map(p => (
                        <option key={p._id} value={p._id}>
                          {p.name}
                        </option>
                      ))}

                    {i.itemType === "RAWMATERIAL" &&
                      rawMaterials.map(r => (
                        <option key={r._id} value={r._id}>
                          {r.name}
                        </option>
                      ))}
                  </select>
                </td>

                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="1"
                    value={i.quantity}
                    onChange={(e) =>
                      updateItem(idx, "quantity", Number(e.target.value))
                    }
                    className="border rounded px-2 py-1 w-20"
                  />
                </td>

                <td className="px-3 py-2">
                  <input
                    type="number"
                    min="0"
                    value={i.unitPrice}
                    onChange={(e) =>
                      updateItem(idx, "unitPrice", Number(e.target.value))
                    }
                    className="border rounded px-2 py-1 w-24"
                  />
                </td>

                <td className="px-3 py-2 font-medium">
                  ₹{lineTotal(i)}
                </td>

                <td className="px-3 py-2">
                  {items.length > 1 && (
                    <button
                      onClick={() => removeItem(idx)}
                      className="text-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={addItem}
          className="flex items-center gap-2 px-4 py-3 text-indigo-600"
        >
          <Plus size={16} />
          Add Item
        </button>
      </div>

      {/* ===== Summary ===== */}
      <div className="bg-white border rounded-lg p-4 flex justify-between">
        <span className="font-semibold">Total</span>
        <span className="font-semibold">₹{totalAmount}</span>
      </div>

      {/* ===== Actions ===== */}
      {status === "PENDING" && (
        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-md"
          >
            {loading ? "Saving..." : "Save Purchase"}
          </button>

          <button
            onClick={() => navigate("/dashboard/purchases")}
            className="border px-6 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
