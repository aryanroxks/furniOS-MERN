import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../services/api";
import { Plus, Trash2 } from "lucide-react";

export default function CreateProduction() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [productionNumber, setProductionNumber] = useState("");
  const [productionDate, setProductionDate] = useState("");

  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- FETCH MASTER DATA ---------------- */
  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data.data || []));
    api.get("/raw-materials").then(res => setRawMaterials(res.data.data || []));
  }, []);

  /* ---------------- HELPERS ---------------- */
  const addProductLine = () => {
    setLines([
      ...lines,
      {
        productID: "",
        quantityProduced: 1,
        materialsUsed: [],
        unitCost: 0,
        totalCost: 0,
      },
    ]);
  };

  const removeProductLine = (index) => {
    setLines(lines.filter((_, i) => i !== index));
  };

  const updateLine = (index, key, value) => {
    const updated = [...lines];
    updated[index][key] = value;
    recalcLine(updated, index);
    setLines(updated);
  };

  const addMaterial = (lineIndex) => {
    const updated = [...lines];
    updated[lineIndex].materialsUsed.push({
      rawMaterialID: "",
      quantityUsed: 0,
      unitCostAtTime: 0,
      totalCost: 0,
    });
    setLines(updated);
  };

  const updateMaterial = (lineIndex, matIndex, key, value) => {
    const updated = [...lines];
    const mat = updated[lineIndex].materialsUsed[matIndex];

    mat[key] = value;
    mat.totalCost = mat.quantityUsed * mat.unitCostAtTime;

    recalcLine(updated, lineIndex);
    setLines(updated);
  };

  const removeMaterial = (lineIndex, matIndex) => {
    const updated = [...lines];
    updated[lineIndex].materialsUsed.splice(matIndex, 1);
    recalcLine(updated, lineIndex);
    setLines(updated);
  };

  const recalcLine = (updated, index) => {
    const line = updated[index];
    const materialCost = line.materialsUsed.reduce(
      (sum, m) => sum + m.totalCost,
      0
    );

    line.totalCost = materialCost;
    line.unitCost =
      line.quantityProduced > 0
        ? materialCost / line.quantityProduced
        : 0;
  };

  const totalProductionCost = lines.reduce(
    (sum, l) => sum + l.totalCost,
    0
  );

  /* ---------------- SUBMIT ---------------- */
  const handleSubmit = async () => {
    if (!productionNumber || !productionDate || lines.length === 0) {
      alert("Required fields missing");
      return;
    }

    try {
      setLoading(true);

      const rawMaterialMap = {};

      lines.forEach((l) => {
        l.materialsUsed.forEach((m) => {
          if (!rawMaterialMap[m.rawMaterialID]) {
            rawMaterialMap[m.rawMaterialID] = {
              rawMaterialID: m.rawMaterialID,
              totalQuantityUsed: 0,
              totalCost: 0,
            };
          }

          rawMaterialMap[m.rawMaterialID].totalQuantityUsed += Number(m.quantityUsed);
          rawMaterialMap[m.rawMaterialID].totalCost += Number(m.totalCost);
        });
      });

      await api.post("/productions/create", {
        productionNumber,
        productionDate,
        products: lines,
        productionRawMaterial: Object.values(rawMaterialMap),
        totalProductionCost,
      });

      navigate("/dashboard/productions");
    } catch (err) {
      alert(err.response?.data?.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold">Create Production</h1>

      {/* Production Meta */}
      <div className="bg-white p-4 border rounded-lg grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">Production Number</label>
          <input
            className="w-full border px-3 py-2 rounded-md"
            value={productionNumber}
            onChange={(e) => setProductionNumber(e.target.value)}
          />
        </div>

        <div>
          <label className="text-sm text-gray-600">Production Date</label>
          <input
            type="date"
            className="w-full border px-3 py-2 rounded-md"
            value={productionDate}
            onChange={(e) => setProductionDate(e.target.value)}
          />
        </div>
      </div>

      {/* Products */}
      <div className="space-y-4">
        {lines.map((line, idx) => (
          <div key={idx} className="bg-white p-4 border rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Product #{idx + 1}</h3>
              <button onClick={() => removeProductLine(idx)}>
                <Trash2 size={16} className="text-red-600" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Product</label>
                <select
                  className="w-full border px-3 py-2 rounded-md"
                  value={line.productID}
                  onChange={(e) =>
                    updateLine(idx, "productID", e.target.value)
                  }
                >
                  <option value="">Select Product</option>
                  {products.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-sm text-gray-600">
                  Quantity Produced
                </label>
                <input
                  type="number"
                  min="1"
                  className="w-full border px-3 py-2 rounded-md"
                  value={line.quantityProduced}
                  onChange={(e) =>
                    updateLine(
                      idx,
                      "quantityProduced",
                      Number(e.target.value)
                    )
                  }
                />
              </div>
            </div>

            {/* Raw Materials */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">
                Raw Materials Used
              </p>

              {line.materialsUsed.map((m, mi) => (
                <div key={mi} className="grid grid-cols-5 gap-2 items-end">
                  <div>
                    <label className="text-xs text-gray-600">Raw Material</label>
                    <select
                      className="border px-2 py-1 rounded w-full"
                      value={m.rawMaterialID}
                      onChange={(e) =>
                        updateMaterial(idx, mi, "rawMaterialID", e.target.value)
                      }
                    >
                      <option value="">Select</option>
                      {rawMaterials.map((rm) => (
                        <option key={rm._id} value={rm._id}>
                          {rm.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Quantity</label>
                    <input
                      type="number"
                      min="1"
                      className="border px-2 py-1 rounded w-full"
                      value={m.quantityUsed}
                      onChange={(e) =>
                        updateMaterial(
                          idx,
                          mi,
                          "quantityUsed",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Unit Cost</label>
                    <input
                      type="number"
                      min="0"
                      className="border px-2 py-1 rounded w-full"
                      value={m.unitCostAtTime}
                      onChange={(e) =>
                        updateMaterial(
                          idx,
                          mi,
                          "unitCostAtTime",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-600">Total Cost</label>
                    <input
                      readOnly
                      className="border px-2 py-1 rounded bg-gray-100 w-full"
                      value={m.totalCost}
                    />
                  </div>

                  <button onClick={() => removeMaterial(idx, mi)}>
                    <Trash2 size={14} className="text-red-600" />
                  </button>
                </div>
              ))}

              <button
                onClick={() => addMaterial(idx)}
                className="text-sm text-indigo-600"
              >
                + Add Raw Material
              </button>
            </div>

            <p className="text-sm text-gray-600">
              Product Cost: ₹{line.totalCost} · Unit Cost: ₹{line.unitCost}
            </p>
          </div>
        ))}
      </div>

      <button
        onClick={addProductLine}
        className="bg-gray-200 px-4 py-2 rounded-md"
      >
        + Add Product
      </button>

      {/* Footer */}
      <div className="flex justify-between items-center bg-white p-4 border rounded-lg">
        <p className="font-semibold">
          Total Production Cost: ₹{totalProductionCost}
        </p>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md"
        >
          Create Production
        </button>
      </div>
    </div>
  );
}
