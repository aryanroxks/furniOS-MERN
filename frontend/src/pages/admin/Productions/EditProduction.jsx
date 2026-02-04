import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../services/api";
import { Trash2 } from "lucide-react";

export default function EditProduction() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const [productionNumber, setProductionNumber] = useState("");
  const [productionDate, setProductionDate] = useState("");
  const [status, setStatus] = useState("");

  const [lines, setLines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------------- FETCH MASTER DATA ---------------- */
  useEffect(() => {
    api.get("/products").then(res => setProducts(res.data.data || []));
    api.get("/raw-materials").then(res => setRawMaterials(res.data.data || []));
  }, []);

  /* ---------------- FETCH PRODUCTION ---------------- */
  useEffect(() => {
    const fetchProduction = async () => {
      try {
        const res = await api.get(`/productions/${id}`);
        const p = res.data.data;

        if (["COMPLETED", "CANCELLED"].includes(p.status)) {
          alert("This production cannot be edited");
          navigate(`/dashboard/productions/${id}`);
          return;
        }

        setProductionNumber(p.productionNumber);
        setProductionDate(p.productionDate.slice(0, 10));
        setStatus(p.status);

        setLines(
          p.products.map(prod => ({
            productID: prod.productID._id,
            quantityProduced: prod.quantityProduced,
            materialsUsed: prod.materialsUsed.map(m => ({
              rawMaterialID: m.rawMaterialID._id,
              quantityUsed: m.quantityUsed,
              unitCostAtTime: m.unitCostAtTime,
              totalCost: m.totalCost,
            })),
            unitCost: prod.unitCost,
            totalCost: prod.totalCost,
          }))
        );

      } catch (err) {
        alert("Failed to load production");
        navigate("/dashboard/productions");
      } finally {
        setLoading(false);
      }
    };

    fetchProduction();
  }, [id]);

  /* ---------------- HELPERS ---------------- */
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

  const updateLine = (index, key, value) => {
    const updated = [...lines];
    updated[index][key] = value;
    recalcLine(updated, index);
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

  const removeMaterial = (lineIndex, matIndex) => {
    const updated = [...lines];
    updated[lineIndex].materialsUsed.splice(matIndex, 1);
    recalcLine(updated, lineIndex);
    setLines(updated);
  };

  const totalProductionCost = lines.reduce(
    (sum, l) => sum + l.totalCost,
    0
  );

  /* ---------------- SUBMIT ---------------- */
  const handleUpdate = async () => {
    try {
      setSaving(true);

      const rawMaterialMap = {};

      lines.forEach(l => {
        l.materialsUsed.forEach(m => {
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

      await api.patch(`/productions/${id}`, {
        productionDate,
        products: lines,
        productionRawMaterial: Object.values(rawMaterialMap),
        totalProductionCost,
      });

      navigate(`/dashboard/productions/${id}`);
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-semibold">
        Edit Production #{productionNumber}
      </h1>

      {/* Meta */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-4 border rounded-lg">
        <input
          type="date"
          className="border px-3 py-2 rounded-md"
          value={productionDate}
          onChange={(e) => setProductionDate(e.target.value)}
        />

        <input
          disabled
          className="border px-3 py-2 rounded-md bg-gray-100"
          value={status}
        />
      </div>

      {/* Products */}
      {lines.map((line, idx) => (
        <div key={idx} className="bg-white p-4 border rounded-lg space-y-3">
          <h3 className="font-medium">Product #{idx + 1}</h3>

          <div className="grid grid-cols-2 gap-4">
            <select
              disabled
              className="border px-3 py-2 rounded-md bg-gray-100"
              value={line.productID}
            >
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              className="border px-3 py-2 rounded-md"
              value={line.quantityProduced}
              onChange={(e) =>
                updateLine(idx, "quantityProduced", Number(e.target.value))
              }
            />
          </div>

          {/* Materials */}
          {line.materialsUsed.map((m, mi) => (
            <div key={mi} className="grid grid-cols-5 gap-2">
              <select
                className="border px-2 py-1 rounded"
                value={m.rawMaterialID}
                onChange={(e) =>
                  updateMaterial(idx, mi, "rawMaterialID", e.target.value)
                }
              >
                {rawMaterials.map(rm => (
                  <option key={rm._id} value={rm._id}>
                    {rm.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                value={m.quantityUsed}
                onChange={(e) =>
                  updateMaterial(idx, mi, "quantityUsed", Number(e.target.value))
                }
                className="border px-2 py-1 rounded"
              />

              <input
                type="number"
                value={m.unitCostAtTime}
                onChange={(e) =>
                  updateMaterial(idx, mi, "unitCostAtTime", Number(e.target.value))
                }
                className="border px-2 py-1 rounded"
              />

              <input
                readOnly
                value={m.totalCost}
                className="border px-2 py-1 rounded bg-gray-100"
              />

              <button onClick={() => removeMaterial(idx, mi)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}

          <button
            onClick={() => addMaterial(idx)}
            className="text-sm text-indigo-600"
          >
            + Add Raw Material
          </button>

          <p className="text-sm text-gray-600">
            Product Cost: ₹{line.totalCost} · Unit Cost: ₹{line.unitCost}
          </p>
        </div>
      ))}

      {/* Footer */}
      <div className="flex justify-between items-center bg-white p-4 border rounded-lg">
        <p className="font-semibold">
          Total Production Cost: ₹{totalProductionCost}
        </p>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2 rounded-md"
        >
          Update Production
        </button>
      </div>
    </div>
  );
}
